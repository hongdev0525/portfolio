
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
var order = require("../models/order.js")
var userModel = require("../models/user.js")
var tagModel = require("../models/tag.js")
var milesModel = require("../models/miles.js");
const axios = require("axios");
const { getUserNo } = require("../models/user.js");
const { getMiles, addMiles } = require("../models/miles.js");
const { getDeliveryDows } = require("../models/tag.js");
const { orderForSubscribeChange, orderUpdateForSubscribeChange, getMinDeliveryDate, changedOrderForSubscribeCancel, orderForSubscribeCancel, orderUpdateForSubscribeCancel, amountChangeOrderForSubscribeChange } = require("../models/order.js");
const { getMaxPaymentHistoryOfSubscribe, getPaymentHistoryOfSubscribe } = require("../models/payment.js");

require("dotenv").config();

const IMP_KEY = process.env.IMP_KEY;
const IMP_API_SECRET = process.env.IMP_API_SECRET;


router.get("/list", async (req, res) => {
  const userNo = await userModel.getUserNo(req, res);
  const statusCode = req.query.statusCode ? req.query.statusCode : null;
  console.log('statusCode', statusCode)
  const whereParse = statusCode ? { UserNo: userNo, SubsType: "subscribe", StatusCode: statusCode } : { UserNo: userNo, SubsType: "subscribe" }
  if (userNo) {

    const { status, rows: subscribeRows } = await crud.getDataListFromTable(
      `SubsNo ,TagGroupNo ,TotalOrderCnt ,RemainOrderCnt ,SubsRounds ,RegDate, StatusCode, AddressNo, SubsType,
    (SELECT
      GROUP_CONCAT( DISTINCT  DeliveryDow
        ORDER BY
          CodeOrder ASC  ) as deliverydow
        FROM
          Tag t
        LEFT JOIN 
          CodeMst cm ON(cm.CodeLabel=t.DeliveryDow)
        WHERE 
          TagGroupNo  = tb.TagGroupNo) as Dows,
    (
      SELECT 
          min(DeliveryDate)
        FROM
          OrderMst om 
        WHERE 
          om.SubsNo  = tb.SubsNo
          AND
          StatusCode  = '기존주문' 
    ) as NextDeliveryDate,
    (
          SELECT 
      DATE_ADD(MAX(DeliveryDate), INTERVAL -2 DAY) 
          FROM
            OrderMst om 
          WHERE 
            SubsNo  = tb.SubsNo
            AND
            StatusCode  = '기존주문'
    ) as NextPaymentDate
    `, 'SubsMst',
      whereParse,
      "StatusCode desc , RegDate desc "

    );
    console.log('subscribeRows', subscribeRows)
    if (status === -1) {
      res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /subscribe/list" });
    }


    const subscribeData = [...subscribeRows];

    const tmp = await Promise.all(subscribeData.map(async (row) => {
      const tagGroupNo = row.TagGroupNo;
      console.log('subscribe row', row)
      console.log('tagGroupNo', tagGroupNo);
      const { status: tagStatus, rows: tagRows } = await tagModel.getProductListPerDow(tagGroupNo);
      if (tagStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to get Tag infomation at /subscribe/list" });
      }

      let productList = [];
      tagRows.map(tag => {
        productList.push({
          "amount": Number(tag.totalCount),
          "dow": tag.deliverydow,
          "key": tag.tagtype,
          "name": tag.taglabel,
          "price": tag.price
        })
      })

      const { status: addressStatus, rows: addressRows } = await crud.getDataListFromTable("AddressLabel", 'UserAddress', { AddressNo: row.AddressNo });
      if (addressStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to get Order infomation at /subscribe/list" });
      }


      return { ...row, product: productList, addressLabel: addressRows[0].AddressLabel };
    }))

    console.log('tmp', tmp)

    res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(tmp) });
  }
})

router.get("/info", async (req, res) => {
  const userNo = await userModel.getUserNo(req, res);
  const subsNo = req.query.subsNo;
  console.log('subsNo', subsNo);
  const { status, rows: subscribeRows } = await crud.getDataListFromTable('SubsNo,TagGroupNo,TotalOrderCnt,RemainOrderCnt,SubsRounds,RegDate,PaymentNo,AddressNo, DeliveryStartDate as DeliveryDate, SubsType', 'SubsMst', { SubsNo: subsNo, UserNo: userNo });
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /subscribe/list" });
  }

  let tmp = { ...subscribeRows[0] };
  const subcribe = subscribeRows[0];

  const { status: dowsStatus, rows: dowsRows } = await tagModel.getDeliveryDows(subcribe.TagGroupNo);
  if (dowsStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get dows infomation at /subscribe/list" });
  }
  const { status: tagStatus, rows: tagRows } = await tagModel.getProductListPerDow(subcribe.TagGroupNo);
  if (tagStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Tag infomation at /subscribe/list" });
  }

  let productList = [];
  tagRows.map(tag => {
    productList.push({
      "amount": Number(tag.totalCount),
      "dow": tag.deliverydow,
      "key": tag.tagtype,
      "name": tag.taglabel,
      "price": tag.price
    })
  })

  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable("min(DeliveryDate) as nextDeliveryDate", 'OrderMst', { StatusCode: "기존주문" });
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /subscribe/list" });
  }
  let dowList = [];
  dowsRows.map(dow => {
    dowList.push(dow.deliverydow);
  })
  tmp["dows"] = dowList



  tmp["product"] = productList
  tmp["nextDeliveryDate"] = orderRows[0].nextDeliveryDate
  console.log('tmp', tmp)
  res.status(200).send({ status: "exist", data: common.DatabaseToResFormat([tmp])[0] });
})


// 1. TagGruop 테이블에 TagGroupNo 생성 
// 2. Tag 테이블에 구독하기에서 가져온 정보를 토대로 Tag 생성 및 TagGroupNo 입력 
// 3. 태그 및 구독을 생성하고 결제 진행 후 결제 실패시 태그,태그그룹, 구독 삭제
// 4. 결제수단 다시 확인 후 다시 구독 결제하기 버튼 클릭하면 1번 로직으로 이동
// 5. 성공시에 UserAddress, DeliveryAddress , DelivererMst를 통해 주문생성 

const createSubscribe = async (req, res, next) => {
  console.log("Create Subscribe Start...");
  //구독 데이터 확인
  let subscribeInfo = req.body;
  let subsType = req.body.subscribeType === "experience" ? "experience" : "subscribe";
  let period = subsType === "experience" ? 1 : 4;
  const userNo = await userModel.getUserNo(req, res);

  if (subscribeInfo.length === 0 || !subscribeInfo) {
    res.status(500).send({ status: "error", error: "No input subscribe information" });
  }

  //구독 유무 조회
  // const { status: subsribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('', 'SubsMst', { UserNo: userNo, StatusCode: "normal" })
  // if (subsribeStatus === -1) {
  //   res.status(500).send({ status: "error", error: "Failed to get subscribe at /subscribe/create" });
  // } else if (subscribeRows.length !== 0) {
  //   res.status(200).send({ status: "exist", message: "subscribe is already exist" });
  //   return false;
  // }

  //유저 번호 조회
  const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('', 'UserMst', { UserNo: userNo, StatusCode: "normal" })
  if (userStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user info at /subscribe/create" });
  }

  // 태그그룹 생성
  const { status: TagGroupStatus, rows: TagGroupRows } = await crud.createDataRow('TagGroup', { UserNo: userNo })
  const tagGroupNo = TagGroupRows.insertId

  if (TagGroupStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create TagGroup at /subscribe/create" });
  }
  console.log("Create TagGroup Done!");


  //상품 내용 가공
  const productInfo = subscribeInfo.product;
  let tagList = [];
  let discount = 0;
  let totalPrice = 0;
  let defaultDiscountPrice = subscribeInfo.defaultDiscountPrice
  let milesPrice = subscribeInfo.milesAmount && subscribeInfo.milesAmount.length !== 0 ? subscribeInfo.milesAmount : 0;



  for (let i = 0; i < productInfo.length; i++) {
    const product = productInfo[i];
    // if (product.amount >= 2) discount = 1000;
    // let price = product.price * product.amount
    // let price = product.price * product.amount
    //  - discount;
    tagList.push({
      TagGroupNo: tagGroupNo,
      TagType: product.key,
      TagLabel: product.name,
      DeliveryDow: product.dow,
      Amount: product.amount,
      Price: product.price,
      IsUse: 1,
    })
  }

  const totalDiscountAmount = (totalPrice) => {
    const discountType = subscribeInfo.coupon?.type;
    const discount = subscribeInfo.coupon?.discount;
    const milesAmount = parseInt(subscribeInfo.milesAmount);
    let totalDiscount = 0;
    if (discountType && discount) {
      if (discountType === "money") {
        totalDiscount = milesAmount + discount;
      } else {
        totalDiscount = milesAmount + parseInt(totalPrice) * (parseInt(discount) / 100);
      }
    } else {
      totalDiscount = milesAmount ? milesAmount : 0;
    }
    return totalDiscount;
  }

  totalPrice = defaultDiscountPrice - totalDiscountAmount(defaultDiscountPrice);
  console.log('totalPrice :>> ', totalPrice);

  //태그 생성
  const { status: tagCreateStatus, rows: tagCreateRows } = await crud.createDataRowBulk('Tag', tagList)

  if (tagCreateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create Tag at /subscribe/create" });
  }
  console.log("Create Tags Done!");

  let paymentType = null;
  let cuid = null;
  let impUid = null;
  if (subsType === "experience") {
    paymentType = subscribeInfo.paymentType
    impUid = subscribeInfo.impUid
  } else {
    //결제 정보 조회
    const { status: PaymentStatus, rows: paymentRows } = await crud.getDataListFromTable('', 'PaymentMst', { PaymentNo: subscribeInfo.paymentNo })
    if (PaymentStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payment information at /subscribe/create" });
    }
    paymentType = paymentRows[0].PaymentType
    cuid = paymentRows[0].PaymentCuid
    impUid = paymentRows[0].ImpUid
  }

  //주소 정보 조회
  const { status: AddressStatus, rows: addressRows } = await crud.getDataListFromTable('', 'UserAddress', { AddressNo: subscribeInfo.addressNo })
  if (AddressStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get address information at /subscribe/create" });
  }

  req.addressRows = addressRows

  subscribeInfo = {
    UserNo: userNo,
    AddressNo: subscribeInfo.addressNo,
    PaymentNo: subscribeInfo.paymentNo ? subscribeInfo.paymentNo : 0,
    PaymentType: paymentType,
    TagGroupNo: tagGroupNo,
    TotalPrice: totalPrice,
    Period: period,
    DeliveryStartDate: common.jsDateToMysqlDateTime(subscribeInfo.deliveryDate),
    StatusCode: "normal",
    TotalOrderCnt: period * subscribeInfo.dows.length,
    RemainOrderCnt: period * subscribeInfo.dows.length,
    SubsRounds: 1,
    PaymentStatus: "기존주문",
    RecommandCode: "",
    SubsReason: "",
    RefCode: "",
    SubsType: subsType,
    CustomerUid: cuid,
    ContactNo: addressRows[0].ContactNo,
    RcvName: addressRows[0].RcvName,
    ReqMsg: "",
    UpdDate: common.jsDateToMysqlDateTime(new Date()),
  }

  console.log('subscribeInfo', subscribeInfo)


  //구독 생성
  const { status: subscribeCreateStatus, rows: subscribeCreateRows } = await crud.createDataRow('SubsMst', subscribeInfo)
  if (subscribeCreateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create subscribe at /subscribe/create" });
  }
  subscribeInfo['SubsNo'] = subscribeCreateRows.insertId
  console.log("Create Subscribe Done!");
  req.userNo = userNo;
  req.userRows = userRows;
  req.subsNo = subscribeCreateRows.insertId
  req.paymentInfo = {
    paymentType: paymentType,
    payemntNo: subscribeInfo.paymentNo ? subscribeInfo.paymentNo : 0,
    cuid: cuid,
    impUid: impUid
  }
  req.tagGroupNo = tagGroupNo
  req.subscribeInfo = subscribeInfo
  req.milesPrice = milesPrice
  req.subsType = subsType
  next();
}


const billingSubscribe = async (req, res, next) => {
  console.log("Billing Subscribe Start...");

  const userNo = req.userNo;
  const subsNo = req.subsNo
  const paymentInfo = req.paymentInfo
  console.log('paymentInfo', paymentInfo)
  const tagGroupNo = req.tagGroupNo
  const subscribeInfo = req.subscribeInfo
  const milesPrice = req.milesPrice
  const paymentCuid = paymentInfo.cuid
  const paymentType = paymentInfo.paymentType
  const paymentImpUid = paymentInfo.impUid
  const paymentNo = paymentInfo.payemntNo
  const merchantUid = `order_monthly_${userNo}_${Date.now()}`
  const subsType = req.subsType;
  if (subsType !== "experience") {
    if (subscribeInfo.TotalPrice !== 0) {
      try {
        const getToken = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: {
            imp_key: IMP_KEY,
            imp_secret: IMP_API_SECRET
          }
        });
        const { access_token } = getToken.data.response;
        // 결제(재결제) 요청
        let paymentObject = {};
        // const redirectUrl = `http\:\/\/${req.hostname}:3001/subscribe`;
        switch (paymentType) {
          case "Kakao":
            paymentObject =
            {
              pg: "kakaopay.TCSUBSCRIP",
              merchant_uid: merchantUid,
              name: '현관앞키친 ',
              pay_method: "kakaopay",
              // m_redirect_url: redirectUrl,
              amount: Number(subscribeInfo.TotalPrice),
              customer_uid: paymentCuid, // 필수 입력
            }
            break;
          case "Card":
            paymentObject = {
              pg: "nice.nictest04m",
              merchant_uid: merchantUid,
              amount: Number(subscribeInfo.TotalPrice),
              // amount: 100,
              customer_uid: paymentCuid,
              name: "현관앞키친 첫 구독 결제"
            }
            break;
          default:
            break;
        }

        const paymentResult = await axios({
          url: "https://api.iamport.kr/subscribe/payments/again",
          method: "post",
          headers: { "Authorization": access_token },
          data: paymentObject
        })

        const { code } = paymentResult.data;
        const response = paymentResult.data.response;

        console.log('tagGroupNoaaaaa', tagGroupNo)
        const paymentHistoryInfo = {
          ImpUid: response.imp_uid,
          UserNo: userNo,
          SubsNo: subsNo,
          PaymentNo: paymentNo,
          Price: Number(subscribeInfo.TotalPrice),
          PaymentType: subsType === "experience" ? "체험하기" : "구독",
          PaymentDate: common.jsDateToMysqlDateTime(new Date()),
          PaymentStatus: "",
          FailReason: "",
          CancelReason: "",
          TagGroupNo: Number(tagGroupNo)
        }

        if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
          if (response.status === "paid") { //카드 정상 승인
            console.log("Billing Subscribe Done");
            console.log('milesPrice', milesPrice);

            //마일리지 사용 처리
            if (milesPrice !== 0) {
              const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, null, subsType === "experience" ? "체험하기" : "구독", paymentNo);
              await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", null, response.imp_uid);
            }

            //결제내역 생성
            paymentHistoryInfo['PaymentStatus'] = response.status;
            console.log('paymentHistoryInfo', paymentHistoryInfo)
            const { status: paymentHistorytatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
            if (paymentHistorytatus === -1) {
              res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
            }
            console.log("Create Payment History Done");
            next();
          } else { //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)

            //생성된 구독 삭제
            const { status: deleteSubsStatus, rows: deleteSusbsRows } = await crud.deleteData('SubsMst', { SubsNo: subsNo })
            if (deleteSubsStatus === -1) {
              res.status(500).send({ status: "error", error: "Failed to delete subs info at billingSubscribe()" });
            }
            //생성된 태그 삭제
            const { status: deleteTagStatus, rows: deleteTagRows } = await crud.deleteData('Tag', { TagGroupNo: tagGroupNo })
            if (deleteTagStatus === -1) {
              res.status(500).send({ status: "error", error: "Failed to delete tag info at billingSubscribe()" });
            }

            //생성된 태그그룹 삭제
            const { status: deleteTagGruopStatus, rows: deleteTagGruopRows } = await crud.deleteData('TagGroup', { TagGroupNo: tagGroupNo, UserNo: userNo })
            if (deleteTagGruopStatus === -1) {
              res.status(500).send({ status: "error", error: "Failed to delete tag group info at billingSubscribe()" });
            }

            res.status(200).send({ status: "fail", message: response.fail_reason });
          }
        }
      } catch (e) {
        res.status(400).send(e);
      }
    } else {
      //마일리지 사용 처리
      if (milesPrice !== 0) {
        const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, null, subsType === "experience" ? "체험하기" : "구독");
        await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", null, response.imp_uid);
      }
      next()
    }
  } else {
    const paymentHistoryInfo = {
      ImpUid: paymentImpUid,
      UserNo: userNo,
      SubsNo: subsNo,
      PaymentNo: paymentNo,
      Price: Number(subscribeInfo.TotalPrice),
      PaymentType: "체험하기",
      PaymentDate: common.jsDateToMysqlDateTime(new Date()),
      PaymentStatus: "",
      FailReason: "",
      CancelReason: "",
      TagGroupNo: Number(tagGroupNo)
    }

    //마일리지 사용 처리
    if (milesPrice !== 0) {
      const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, null, "체험하기", paymentNo);
      await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", null, paymentImpUid);
    }

    //결제내역 생성
    paymentHistoryInfo['PaymentStatus'] = "paid";
    console.log('paymentHistoryInfo', paymentHistoryInfo)
    const { status: paymentHistorytatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
    if (paymentHistorytatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
    }
    console.log("Create Payment History Done");

    next()

  }

}



router.post("/create", createSubscribe, billingSubscribe, async (req, res) => {
  const addressRows = req.addressRows
  const userRows = req.userRows
  const tagGroupNo = req.tagGroupNo
  const subscribeInfo = req.subscribeInfo
  //배송자 정보 조회
  const { status: delivererStatus, rows: delivererRows } = await crud.getDataListFromTable('', 'DeliveryAddress', { RoadAddress: addressRows[0].Address })
  if (delivererStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get deliverer information at /subscribe/create" });
  }
  //주문 생성
  const { status: orderCreateStatus } = await order.generateNewOrderBulk(subscribeInfo, userRows[0].UserNo, addressRows[0], tagGroupNo, delivererRows[0])
  if (orderCreateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create new oders information at /subscribe/create" });
  }
  console.log("Create Orders Done");
  res.status(200).send({ status: "success", message: "subscribe done" })

});

router.get("/subscribeuserinfo", async (req, res) => {
  const userInfo = common.getUserInfoFromCookie(req.accessToken);
  const userNo = await getUserNo(req, res);
  const subscribeUserInfo = {};
  if (userInfo) {
    const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('UserName, UserGender, RecommendCode', 'UserMst', { UserEmail: userInfo.UserEmail, UserPhone: userInfo.UserPhone })
    if (userStatus !== -1) {
      subscribeUserInfo.userName = userRows[0].UserName;
      subscribeUserInfo.userGender = userRows[0].UserGender;
      subscribeUserInfo.recommendCode = userRows[0].RecommendCode;
    } else {
      res.status(500).send({ status: "error", error: "Failed to search user information" });
    }

    const { status: milesState, data: milesData } = await getMiles(req, res, userNo);

    if (milesState !== -1) {
      subscribeUserInfo.remainMiles = milesData;
      res.status(200).send({ status: "success", data: subscribeUserInfo })
    } else {
      res.status(500).send({ status: "error", error: "Failed to search user information" });
    }


  }
})



function getTagInfo(data) {
  const productInfo = {};

  data.forEach((item) => {
    const products = item.Product.split(",");
    products.forEach((product) => {
      const [name, count] = product.split("-");

      if (productInfo[name]) {
        productInfo[name].TotalAmount += Number(count);
      } else {
        productInfo[name] = {
          TagLabel: name,
          TotalAmount: Number(count),
          UseAmount: 0,
        };
      }

      const now = new Date();
      if (now.getHours() < 16) {
        now.setDate(now.getDate() + 1);
      } else {
        now.setDate(now.getDate() + 2);
      }
      const deliveryDate = new Date(item.DeliveryDate).toISOString().slice(0, 10);
      const formattedDeliveryDate = now.toISOString().slice(0, 10);

      if (item.StatusCode === "배송완료" || new Date(formattedDeliveryDate) > new Date(deliveryDate)) {
        productInfo[name].UseAmount += Number(count);
      }
    });
  });


  return Object.values(productInfo);
}





/**
 * 1. 결제 먼저 진행
 * 2. 결제 완료시 태그그룹 생성 및 태그 생성, 
 * 3. 구독 생성
 * 4. 주문 생성
 * 
 *  
 * 
 */

router.post("/subscribechange", async (req, res) => {

  const userNo = await getUserNo(req, res);


  console.log("Billing Subscribe Start...");

  const subscribeInfo = req.body;
  const subsNo = subscribeInfo.subsNo;

  //결제 정보 조회
  const { status: PaymentStatus, rows: paymentRows } = await crud.getDataListFromTable('', 'PaymentMst', { PaymentNo: subscribeInfo.paymentNo })
  if (PaymentStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get payment information at /subscribe/create" });
  }

  const paymentCuid = paymentRows[0]["PaymentCuid"]
  const paymentType = paymentRows[0]["PaymentType"]
  const merchantUid = `oder_monthly_${userNo}_${Date.now()}`
  let totalPrice = 0;
  let defaultDiscountPrice = subscribeInfo.defaultDiscountPrice;


  const totalDiscountAmount = (totalPrice) => {
    const discountType = subscribeInfo.coupon?.type;
    const discount = subscribeInfo.coupon?.discount;
    const milesAmount = parseInt(subscribeInfo.milesAmount);
    let totalDiscount = 0;
    if (discountType && discount) {
      if (discountType === "money") {
        totalDiscount = milesAmount + discount;
      } else {
        totalDiscount = milesAmount + parseInt(totalPrice) * (parseInt(discount) / 100);
      }
    } else {
      totalDiscount = milesAmount ? milesAmount : 0;
    }
    return totalDiscount;
  }

  totalPrice = defaultDiscountPrice - totalDiscountAmount(defaultDiscountPrice);



  try {
    let paymentCode;
    let paymentResponse;
    let paymentHistoryInfo;
    let tagGroupNo;
    let beforeTagGroupNo;
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        imp_key: IMP_KEY,
        imp_secret: IMP_API_SECRET
      }
    });
    const { access_token } = getToken.data.response;


    //totalPrice가 0이 아닌경우 
    if (totalPrice !== 0) {

      // 결제(재결제) 요청
      let paymentObject = {};
      switch (paymentType) {
        case "Kakao":
          paymentObject =
          {
            pg: "kakaopay.TCSUBSCRIP",
            merchant_uid: merchantUid,
            name: '현관앞키친 - 구독변경',
            pay_method: "kakaopay",
            // m_redirect_url: redirectUrl,
            amount: Number(totalPrice),
            customer_uid: paymentCuid, // 필수 입력
          }
          break;
        case "Card":
          paymentObject = {
            pg: "nice.nictest04m",
            merchant_uid: merchantUid,
            amount: Number(totalPrice),
            // amount: 100,
            customer_uid: paymentCuid,
            name: "현관앞키친 첫 구독 결제"
          }
          break;
        default:
          break;
      }

      const paymentResult = await axios({
        url: "https://api.iamport.kr/subscribe/payments/again",
        method: "post",
        headers: { "Authorization": access_token },
        data: paymentObject
      })

      paymentCode = paymentResult.data.code;
      paymentResponse = paymentResult.data.response;



      //이전 구독 정보 조회
      const { status: beforeSubsStatus, rows: beforeSubsRows } = await crud.getDataListFromTable('', 'SubsMst', { SubsNo: subsNo })
      if (beforeSubsStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to get before subscribe information at /subscribe/subscribechange" });
      }
      beforeTagGroupNo = beforeSubsRows[0].TagGroupNo;
      

      // 태그그룹 생성
      const { status: TagGroupStatus, rows: TagGroupRows } = await crud.createDataRow('TagGroup', { UserNo: userNo })
      tagGroupNo = TagGroupRows.insertId


      if (TagGroupStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to create TagGroup at /subscribe/create" });
      }

      paymentHistoryInfo = {
        ImpUid: paymentResponse.imp_uid,
        UserNo: userNo,
        SubsNo: subsNo,
        PaymentNo: paymentRows[0].PaymentNo,
        Price: Number(totalPrice),
        PaymentType: "구독변경",
        PaymentDate: common.jsDateToMysqlDateTime(new Date()),
        PaymentStatus: "",
        FailReason: "",
        CancelReason: "",
        TagGroupNo: Number(tagGroupNo)
      }
    }



    if (paymentCode === 0 || totalPrice === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
      if (paymentResponse?.status === "paid" || totalPrice === 0) { //카드 정상 승인
        console.log("Billing Subscribe Done");

        //이전 결제 내역 조회
        const { status: beforePaymentHistoryStatus, rows: beforePaymentHistoryRows } = await crud.getMaxOfField('PaymentDate', 'PaymentHistory', { SubsNo: subsNo, OrderNo: null, PaymentStatus: "paid" })
        if (beforePaymentHistoryStatus === -1) {
          res.status(500).send({ status: "error", error: "Failed to get address information at /subscribe/subscribechange" });
        }

        //결제내역 생성
        if (paymentHistoryInfo) {
          paymentHistoryInfo['PaymentStatus'] = paymentResponse.status;
          const { status: paymentHistorytatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
          if (paymentHistorytatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
          }
        }

        const refundPrice = subscribeInfo.refundPrice - (subscribeInfo.refundMilesAmount ? subscribeInfo.refundMilesAmount : 0);

        const refundResult = await axios({
          url: "https://api.iamport.kr/payments/cancel",
          method: "post",
          headers: { "Authorization": access_token },
          data: {
            imp_uid: beforePaymentHistoryRows[0].ImpUid,
            amount: refundPrice,
            reason: "구독변경으로 인한 부분환불",
            name: '현관앞키친 - 구독변경 부분환불',
          }
        })

        const milesPrice = subscribeInfo.milesAmount ? subscribeInfo.milesAmount : 0;
        if (refundResult.data.code === 0) {

          const refundHistoryInfo = {
            ImpUid: beforePaymentHistoryRows[0].ImpUid,
            UserNo: userNo,
            SubsNo: subsNo,
            PaymentNo: paymentRows[0].PaymentNo,
            Price: subscribeInfo.refundPrice,
            PaymentType: "구독변경",
            PaymentDate: common.jsDateToMysqlDateTime(new Date()),
            PaymentStatus: "refund",
            FailReason: "",
            CancelReason: "",
            TagGroupNo: Number(beforePaymentHistoryRows[0].TagGroupNo)
          }
          console.log('refundHistoryInfo', refundHistoryInfo)

          //환불 내역 추가
          const { status: refundHistoryStatus, rows: refundHistoryRows } = await crud.createDataRow('PaymentHistory', refundHistoryInfo)

          if (refundHistoryStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to create refund history at /subscribechange" });
          }

          //마일리지 사용 처리
          if (milesPrice !== 0) {
            const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, null, "구독변경", paymentRows[0].PaymentNo);
            await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", null, beforePaymentHistoryRows[0].ImpUid);
          }


          //상품 내용 가공
          const productInfo = subscribeInfo.product;
          let tagList = [];
          let discount = 0;

          let refundMilesAmount = subscribeInfo.refundMilesAmount && subscribeInfo.refundMilesAmount.length !== 0 ? subscribeInfo.refundMilesAmount : 0;

          for (let i = 0; i < productInfo.length; i++) {
            const product = productInfo[i];
            // if (product.amount >= 2) discount = 1000;
            // let price = product.price * product.amount
            // let price = product.price * product.amount
            //  - discount;
            tagList.push({
              TagGroupNo: tagGroupNo,
              TagType: product.key,
              TagLabel: product.name,
              DeliveryDow: product.dow,
              Amount: product.amount,
              Price: product.price,
              IsUse: 1,
            })
          }


          //태그 생성
          const { status: tagCreateStatus, rows: tagCreateRows } = await crud.createDataRowBulk('Tag', tagList)

          if (tagCreateStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to create Tag at /subscribe/create" });
          }
          console.log("Create Tags Done!");



          //기존 사용마일리지 환급
          if (refundMilesAmount !== 0) {
            const milesEventInfo = {
              UserNo: userNo,
              StatusCode: "적립",
              SubsNo: subsNo,
              Amount: refundMilesAmount,
              EventType: "구독변경환급",
              TagGroupNo: tagGroupNo
            }

            const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
            if (MilesEventMst === -1) {
              res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
            }

            const result = await addMiles(MilesEventMstRows.insertId, refundMilesAmount, userNo)
            if (result.status === -1) {
              res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
            }
          }


          //구독의 태그그룹 번호 업데이트
          const { status: subsMstUpdateStatus } = await crud.updateData('SubsMst', { TagGroupNo: tagGroupNo }, { SubsNo: subsNo })
          if (subsMstUpdateStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to update SubsMst TagGruopNo" });
          }
          console.log("Upate TagGroupNo Done");


          //기존 기존주문 주문의 상태를 업데이트
          // 1. 기존주문 - TagGroupNo !=0, StatusCode = "기존주문"
          // 2. 쉬어가기 - TagGroupNo != 0, StatusCode = "쉬어가기"
          // 3. 수량변경 - TagGroupNo != 0, StatusCode = "수량변경"
          const { status: orderUpdateStatus } = await orderUpdateForSubscribeChange(subsNo)
          if (orderUpdateStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to update order StatusCode" });
          }
          console.log("Upate Exist Order StatusCode Done");

          //이전 태그 그룹 정보 획득
           const { status:  beforeTagStatus, rows: beforeTagRows } = await crud.getDataListFromTable('', 'Tag', { TagGroupNo: beforeTagGroupNo })
           if (beforeTagStatus === -1) {
             res.status(500).send({ status: "error", error: "Failed to get tag information at /subscribe/subscribechange" });
           }


          //수량변경 주문 업데이트
          const {status: amountChangeOrderStatus } = await amountChangeOrderForSubscribeChange(beforeTagRows,subsNo);
          if (amountChangeOrderStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to update amountchange order StatusCode" });
          }


          //구독 정보 조회
          const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('', 'SubsMst', { SubsNo: subsNo })
          if (subscribeStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to get address information at /subscribe/subscribechange" });
          }
          const newSubscribeInfo = subscribeRows[0]
          newSubscribeInfo['DeliveryStartDate'] = subscribeInfo.deliveryDate;

          //주소 정보 조회
          const { status: AddressStatus, rows: addressRows } = await crud.getDataListFromTable('', 'UserAddress', { AddressNo: subscribeInfo.addressNo })
          if (AddressStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to get address information at /subscribe/subscribechange" });
          }

          //배송자 정보 조회
          const { status: delivererStatus, rows: delivererRows } = await crud.getDataListFromTable('', 'DeliveryAddress', { RoadAddress: addressRows[0].Address })
          if (delivererStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to get deliverer information at /subscribe/subscribechange" });
          }

          //주문 생성
          const { status: orderCreateStatus } = await order.generateNewOrderBulk(newSubscribeInfo, userNo, addressRows[0], tagGroupNo, delivererRows[0])
          if (orderCreateStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to create new oders information at /subscribe/subscribechange" });
          }
          console.log("Create Orders Done");
          res.status(200).send({ status: "success", message: "subscribe done" })
        }
      } else { //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)


        //생성된 태그그룹 삭제
        const { status: deleteTagGruopStatus, rows: deleteTagGruopRows } = await crud.deleteData('TagGroup', { TagGroupNo: tagGroupNo, UserNo: userNo })
        if (deleteTagGruopStatus === -1) {
          res.status(500).send({ status: "error", error: "Failed to delete tag group info at billingSubscribe()" });
        }


        //주문내역 생성
        paymentHistoryInfo['PaymentStatus'] = response.status;
        paymentHistoryInfo['FailReason'] = response.fail_reason;
        const { status: paymentHistorytatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
        if (paymentHistorytatus === -1) {
          res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
        }
        res.status(200).send({ status: "fail", message: response.fail_reason });
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }



  // res.status(200).send({ status: "success" })
})

function calculateTotalPrice(items, orders, priceType) {
  let total = 0;

  // 입력받은 주문 내역을 배열로 변환
  const orderList = orders.split(",");

  // 주문 내역에 해당하는 아이템 가격을 찾아서 합산
  orderList.forEach((order) => {
    const [itemName, count] = order.split("-");
    const item = items.find((item) => item.CodeLabel === itemName);
    const priceValue = priceType === "normal" ? item.CodeValue3 : item.CodeValue
    console.log('priceValue', priceType, priceValue)
    total += priceValue * count;
  });

  return total;
}



router.get("/cancelrefundinfo", async (req, res) => {
  console.log('req.body', req.body)
  const subsNo = req.query.subsNo;
  let paymentPrice = null; //실 결제금액
  let totalUseMiles = null; // 구독에 사용된 적립금
  let milesAmount = null // 구독시 사용 적립금
  let totalPrice = null; //  총 결제금액
  let refundPrice = null; // 환불금액
  let refundPayment = null; // 현금으로 환불해야하는 금액
  let refundMiles = null; // 환급 해야하는 적립금
  let totalUseProductPrice = null; // 총 사용금액
  let refundMilesOforderChange = null; // 수량변경에 의해 환급되야하는 적립금
  let priceOforderChange = null;// 수량변경으로 결제한 금액 - 구독해지시 적립금으로 반환


  //구독 정보 획득
  const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('SubsNo,TagGroupNo,SubsRounds', 'SubsMst', { SubsNo: subsNo });
  if (subscribeStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /cancel" });
  }
  const subsRounds = subscribeRows[0].SubsRounds
  const tagGroupNo = subscribeRows[0].TagGroupNo


  //상품 정보 획득
  const { status: codeMstStatus, rows: codeMstRows } = await crud.getDataListFromTable('', 'CodeMst', { CodeType: "ITEM_CATEGORY" });
  if (codeMstStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get product infomation at /cancel" });
  }

  //배송완료 주문 조회
  const { status: orderDoneStatus, rows: orderDoneRows } = await crud.getDataListFromTable('', 'OrderMst', { SubsNo: subsNo, StatusCode: "배송완료", OrderRound: subsRounds });
  if (orderDoneStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get order infomation at /cancel" });
  }
  //배송예정 주문 조회
  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('', 'OrderMst', { SubsNo: subsNo, StatusCode: "기존주문", OrderRound: subsRounds, NotWhere: { TagGroupNo: 0 } });
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get order infomation at /cancel" });
  }

  // 발주시간기준으로 배송나가야하는 주문 조회
  const { status: timeOrderStatus, rows: timeOrderRows } = await orderForSubscribeCancel(subsNo, subsRounds);
  if (timeOrderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get order infomation at /cancel" });
  }


  console.log('orderRows ============== ', orderRows.length, tagGroupNo)


  if (parseInt(subsRounds) === 1) {
    console.log('subscribeRows,subsRounds', subscribeRows[0], subsRounds);
    console.log('orderDoneRows.length', orderDoneRows.length)
    console.log('orderRows.length', orderRows.length)

    orderDoneRows.map(order => {
      let productPrice = 0;
      if (orderDoneRows.length <= orderRows.length) {
        productPrice = calculateTotalPrice(codeMstRows, order.Product, "normal");
      } else {
        productPrice = calculateTotalPrice(codeMstRows, order.Product, "sale");
      }
      totalUseProductPrice += productPrice;
      console.log('order.Product', order.Product, productPrice);
    })

    timeOrderRows?.map((order) => {
      let productPrice = 0;
      if (orderDoneRows.length <= orderRows.length) {
        productPrice = calculateTotalPrice(codeMstRows, order.Product, "normal");
      } else {
        productPrice = calculateTotalPrice(codeMstRows, order.Product, "sale");
      }
      totalUseProductPrice += productPrice;
    })

    //수량 변경 주문 결제내역
    const { status: orderchangePaymentStatus, rows: orderchangePaymentRows } = await crud.getDataListFromTable('', 'PaymentHistory', { SubsNo: subsNo, PaymentType: "수량변경", PaymentStatus: "paid" });
    if (orderchangePaymentStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    }

    //구독, 구독변경의 가장 최신금액 가져오기
    const { status: paymentHistoryStatus, rows: paymentHistoryRows } = await getMaxPaymentHistoryOfSubscribe(subsNo)
    if (paymentHistoryStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    }

    if (paymentHistoryStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    }
    //구독시 사용한 마일리지 조회
    const { status: milesEventMstStatus, rows: milesEventMstRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, EventType: "구독" });
    if (milesEventMstStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    // //수량변경에 의한 적립금 조회
    const { status: amountChangeMilesEventStatus, rows: amountChangeMilesEventMstRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, EventType: "수량변경", StatusCode: "적립" });
    if (amountChangeMilesEventStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    const amountChangeMiles = amountChangeMilesEventMstRows[0] ? amountChangeMilesEventMstRows[0].Amount : 0

    //구독에 사용한 마일리지 조회
    const { status: milesStatus, rows: milesRows } = await crud.getDataListFromTable('SUM(Amount) as TotalUseMiles', 'MilesEventMst', { SubsNo: subsNo, StatusCode: "사용" });
    if (milesStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    totalUseMiles = milesRows[0].TotalUseMiles;



    // 수량변경을 제외한 주문에 대한 환불로직
    // 총결제금액 = 실결제금액 + 적립금
    // |총 결제금액 - (사용금액)|(절대값) = 환불금액
    // 환불금액 > 적립금 이면 [ 실 결제금액 - 사용금액] 의 금액을 환불 , [결제시 사용한 적립금]은 재적립
    // 환불금액 <= 적립금이면 현금으로환불 없음, [환불금액] 전액을 적립금으로 적립


    paymentHistoryRows.map(row => {
      paymentPrice += row.Price;
    })
    orderchangePaymentRows.map(row => {
      paymentPrice += row.Price;
    })
    milesEventMstRows.map(row => {
      milesAmount += row.Amount;
    })

    console.log('paymentPrice', paymentPrice, milesAmount)
    totalPrice = paymentPrice + milesAmount - amountChangeMiles; //  총 결제금액
    refundPrice = Math.abs(totalPrice - totalUseProductPrice); // 환불금액
    paymentPrice -= amountChangeMiles
    // const impUid = paymentHistoryRows[0].ImpUid


    console.log('총 결제금액 : ', totalPrice);
    console.log('실결제금액 : ', paymentPrice);
    console.log('총 사용금액 : ', totalUseProductPrice);
    console.log('환불금액 : ', refundPrice);


    //수량 변경 주문 
    // const { status, rows: orderChangeRows } = await changedOrderForSubscribeCancel(subsNo);
    // if (status === -1) {
    //   res.status(500).send({ status: "error", error: "Failed to get changed order infomation at /cancel" });
    // }

    orderchangePaymentRows.map(row => {
      refundMilesOforderChange += row.RefundMilesAmount;
      priceOforderChange += row.Price
    })


    if (refundPrice > milesAmount) {
      refundPayment = paymentPrice - totalUseProductPrice - priceOforderChange;
      refundMiles = milesAmount + priceOforderChange;
    } else {
      refundPayment = 0;
      refundMiles = refundPrice;
    }
    // refundMiles += refundMilesOforderChange;

    console.log('현금 환불금액 : ', refundPayment);
    console.log('환불 적립금 : ', refundMiles, refundMilesOforderChange);


  } else {

    orderDoneRows.map(order => {
      let productPrice = 0;
      productPrice = calculateTotalPrice(codeMstRows, order.Product, "sale");
      totalUseProductPrice += productPrice;
    })

    timeOrderRows?.map((order) => {
      totalUseProductPrice += productPrice;
    })


    const { status: orderchangePaymentStatus, rows: orderchangePaymentRows } = await crud.getDataListFromTable('', 'PaymentHistory', { SubsNo: subsNo, PaymentType: "수량변경", PaymentStatus: "paid" });
    if (orderchangePaymentStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    }

    //구독, 구독변경의 가장 최신금액 가져오기
    const { status: paymentHistoryStatus, rows: paymentHistoryRows } = await getMaxPaymentHistoryOfSubscribe(subsNo)
    if (paymentHistoryStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    }
    // //수량변경에 의한 적립금 조회
    const { status: amountChangeMilesEventStatus, rows: amountChangeMilesEventMstRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, EventType: "수량변경", StatusCode: "적립" });
    if (amountChangeMilesEventStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    const amountChangeMiles = amountChangeMilesEventMstRows[0] ? amountChangeMilesEventMstRows[0].Amount : 0


    //구독시 사용한 마일리지 조회
    const { status: milesEventMstStatus, rows: milesEventMstRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, EventType: "구독", StatusCode: "사용" });
    if (milesEventMstStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    //구독에 사용한 마일리지 조회
    const { status: milesStatus, rows: milesRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, StatusCode: "사용" });
    if (milesStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get miles infomation at /cancel" });
    }
    totalUseMiles = milesRows[0].TotalUseMiles;


    // 수량변경을 제외한 주문에 대한 환불로직
    // 총결제금액 = 실결제금액 + 적립금
    // |총 결제금액 - (사용금액)|(절대값) = 환불금액
    // 환불금액 > 적립금 이면 [ 실 결제금액 - 사용금액] 의 금액을 환불 , [결제시 사용한 적립금]은 재적립
    // 환불금액 <= 적립금이면 현금으로환불 없음, [환불금액] 전액을 적립금으로 적립

    paymentHistoryRows.map(row => {
      paymentPrice += row.Price;
    })
    orderchangePaymentRows.map(row => {
      paymentPrice += row.Price;
    })
    milesEventMstRows.map(row => {
      milesAmount += row.Amount;
    })
    // paymentPrice = paymentHistoryRows[0].Price; //실 결제금액
    // milesAmount = milesEventMstRows[0].Amount // 구독시 사용 적립금


    totalPrice = paymentPrice + milesAmount - amountChangeMiles; //  총 결제금액
    refundPrice = Math.abs(totalPrice - totalUseProductPrice); // 환불금액
    ppaymentPriceayme -= amountChangeMiles


    console.log('총 결제금액 : ', totalPrice);
    console.log('실결제금액 : ', paymentPrice);
    console.log('총 사용금액 : ', totalUseProductPrice);
    console.log('환불금액 : ', refundPrice);




    // const { status, rows: orderChangeRows } = await changedOrderForSubscribeCancel(subsNo);
    // if (status === -1) {
    //   res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
    // }

    // orderChangeRows.map(row => {
    //   refundMilesOforderChange += row.RefundMilesAmount;
    //   priceOforderChange += row.Price
    // })


    orderchangePaymentRows.map(row => {
      refundMilesOforderChange += row.RefundMilesAmount;
      priceOforderChange += row.Price
    })


    if (refundPrice > milesAmount) {
      refundPayment = paymentPrice - totalUseProductPrice - priceOforderChange;
      refundMiles = milesAmount + priceOforderChange;
    } else {
      refundPayment = 0;
      refundMiles = refundPrice;
    }
    // refundMiles += refundMilesOforderChange;

    console.log('현금 환불금액 : ', refundPayment);
    console.log('환불 적립금 : ', refundMiles, refundMilesOforderChange);

  }


  const { status: orderInfoStatus, rows: orderInfoRows } = await orderForSubscribeChange(subsNo, 'cancel');
  if (orderInfoStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /refundinfo , orderForSubscribeChange()" });
  }

  const tagInfo = getTagInfo(orderInfoRows);

  const result = {
    totalPrice: totalPrice,
    paymentPrice: paymentPrice,
    totalUseProductPrice: totalUseProductPrice,
    refundPrice: refundPrice,
    refundPayment: refundPayment,
    refundMiles: refundMiles,
    refundMilesOforderChange: refundMilesOforderChange,
    priceOforderChange: priceOforderChange,
    totalUseMiles: totalUseMiles,
    tags: tagInfo
  }

  console.log('result', result);

  res.status(200).send({ status: "success", data: result });
})

router.post("/cancel", async (req, res) => {
  const cancelRefundStateInfo = req.body.cancelRefundStateInfo;
  const subsNo = req.body.subsNo;
  const userNo = await getUserNo(req, res);

  //결제 액세스 토큰 발급
  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      imp_key: IMP_KEY,
      imp_secret: IMP_API_SECRET
    }
  });
  const { access_token } = getToken.data.response;

  console.log('cancelRefundStateInfo', cancelRefundStateInfo);

  const { status: subsMstStatus, rows: subsMstRows } = await crud.getDataListFromTable('', 'SubsMst', { SubsNo: subsNo });
  if (subsMstStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /cancel" });
  }

  // const { status: paymentHistoryStatus, rows: paymentHistoryRows } = await crud.getDataListFromTable(
  //   '*, MAX(HistoryNo) as HistoryNo ', 'PaymentHistory',
  //    { SubsNo: subsNo, PaymentStatus: "paid", HistoryNo : `(SELECT MAX(HistoryNo) FROM PaymentHistory WHERE PaymentStatus = "paid" AND SubsNo = ${subsNo} )` });

  const { status: paymentHistoryStatus, rows: paymentHistoryRows } = await getMaxPaymentHistoryOfSubscribe(subsNo)
  if (paymentHistoryStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get payemnt history infomation at /cancel" });
  }


  const refundResult = await axios({
    url: "https://api.iamport.kr/payments/cancel",
    method: "post",
    headers: { "Authorization": access_token },
    data: {
      imp_uid: paymentHistoryRows[0].ImpUid,
      amount: cancelRefundStateInfo.refundPayment,
      reason: "구독변경으로 인한 부분환불",
      name: '현관앞키친 - 구독변경 부분환불',
    }
  })

  console.log('refundResult', refundResult);


  if (refundResult.data.code === 0) {

    const refundHistoryInfo = {
      ImpUid: paymentHistoryRows[0].ImpUid,
      UserNo: userNo,
      SubsNo: subsNo,
      PaymentNo: subsMstRows[0].PaymentNo,
      Price: cancelRefundStateInfo.refundPayment,
      PaymentType: "구독해지",
      PaymentDate: common.jsDateToMysqlDateTime(new Date()),
      PaymentStatus: "refund",
      FailReason: "",
      CancelReason: "",
      TagGroupNo: Number(paymentHistoryRows[0].TagGroupNo)
    }

    console.log('refundHistoryInfo', refundHistoryInfo);

    //환불 내역 추가
    const { status: refundHistoryStatus, rows: refundHistoryRows } = await crud.createDataRow('PaymentHistory', refundHistoryInfo)
    if (refundHistoryStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to create refund history at /subscribechange" });
    }

    //기존 사용마일리지 환급
    if (cancelRefundStateInfo.refundMilesOforderChange) {
      const milesEventInfo = {
        UserNo: userNo,
        StatusCode: "적립",
        SubsNo: subsNo,
        Amount: cancelRefundStateInfo.refundMilesOforderChange,
        EventType: "구독해지환급",
        TagGroupNo: Number(paymentHistoryRows[0].TagGroupNo)
      }

      const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
      if (MilesEventMst === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
      }

      const result = await addMiles(MilesEventMstRows.insertId, cancelRefundStateInfo.refundMilesOforderChange, userNo)
      if (result.status === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
      }
    }

    const { status } = await crud.updateData('SubsMst', { StatusCode: "cancel" }, { SubsNo: subsNo });
    if (status === -1) {
      res.status(500).send({ status: "error", error: "Failed to update in /cancel" });
    }


    const { status: orderUpdateState } = await orderUpdateForSubscribeCancel(subsNo);
    if (orderUpdateState === -1) {
      res.status(500).send({ status: "error", error: "Failed to update in /cancel" });
    };


    const { status: maxDeliveryDateStatus, rows: maxDeliveryDateRows } = await crud.getDataListFromTable('Max(DeliveryDate) as MaxDeliveryDate', 'OrderMst', { SubsNo: subsNo, StatusCode: "기존주문" });
    if (maxDeliveryDateStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get order infomation at /cancel" });
    }

    res.status(200).send({ status: "success", maxDeliveryDate: maxDeliveryDateRows[0].MaxDeliveryDate })

  } else {
    res.status(500).send({ status: "fail", message: "fail to refund " })
  }




})


router.get("/refundinfo", async (req, res) => {
  const subsNo = req.query.subsNo;
  const refundType = req.query.refundType;
  let refundInfo = {};
  const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('SubsNo,TagGroupNo', 'SubsMst', { SubsNo: subsNo });
  if (subscribeStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /refundinfo" });
  }
  refundInfo = { ...subscribeRows[0] };

  let { status: tagStatus, rows: tagRows } = await crud.getDataListFromTable('TagLabel,Price,SUM(Amount) as TotalAmount', 'Tag', { TagGroupNo: subscribeRows[0].TagGroupNo }, null, "TagLabel");
  if (tagStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get tag infomation at /refundinfo" });
  }


  //TagGroup 번호가 0이번 수량변경건이기 때문에 구독변경때 제외시켜줘야함.
  const { status: orderStatus, rows: orderRows } = await orderForSubscribeChange(subsNo, refundType);
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe infomation at /refundinfo , orderForSubscribeChange()" });
  }
  let totalPrice = 0;
  let usePrice = 0;

  console.log('orderRows', orderRows);

  //배송완료인 레코드는 이미 사용한 금액으로 정산.
  orderRows.map((order) => {
    totalPrice += order.OrderPrice;
    if (order.StatusCode === "배송완료") {
      usePrice += order.OrderPrice;
    }
  })
  const tagInfo = getTagInfo(orderRows);
  console.log('tagInfo', tagInfo)

  refundInfo["Tags"] = tagInfo;
  refundInfo["UsePrice"] = usePrice;


  const { status: minOrderStatus, rows: minOrderRows } = await getMinDeliveryDate(subsNo);
  if (minOrderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get max deliverydate info at /refundinfo" });
  }

  refundInfo["NextDeliveryDate"] = minOrderRows[0].MinDeliveryDate;

  const { status: milesEventStatus, rows: milesEventRows } = await crud.getDataListFromTable('', 'MilesEventMst', { SubsNo: subsNo, StatusCode: "사용", OrderNo: 0 });
  if (milesEventStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get miles evnet infomation at /refundinfo" });
  }

  if (milesEventRows.length !== 0) {
    refundInfo["MilesAmount"] = milesEventRows[0].Amount;
    // refundInfo["TotalPrice"] = totalPrice - milesEventRows[0].Amount;
    refundInfo["TotalPrice"] = totalPrice;
  } else {
    refundInfo["TotalPrice"] = totalPrice
  }

  console.log('refundInfo', refundInfo)

  res.status(200).send({ status: "success", data: refundInfo })
})


router.get("/getholidaylist", async (req, res) => {
  const { status: holidayStatus, rows: holidayRows } = await crud.getDataListFromTable('', 'HoliydayMst');
  if (holidayStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get holiday list infomation at /getholidaylist" });
  }
  res.status(200).send({ status: "success", data: holidayRows })
})



module.exports = router


