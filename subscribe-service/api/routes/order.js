
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
var order = require("../models/order.js")
var userModel = require("../models/user.js")
var tagModel = require("../models/tag.js")
var milesModel = require("../models/miles.js");
const axios = require("axios");
const { menuOfDeliveryDate, getMaxDeliveryDate } = require("../models/order.js");
const { addMiles } = require("../models/miles.js");

require("dotenv").config();

const IMP_KEY = process.env.IMP_KEY;
const IMP_API_SECRET = process.env.IMP_API_SECRET;

router.get("/list", async (req, res) => {
  const subsNo = req.query.subsNo;
  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('', 'OrderMst', { SubsNo: subsNo })

  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /order/list" });
  }
  res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(orderRows) });
})


router.get("/info", async (req, res) => {
  // const subsNo = req.query.subsNo;
  const orderInfo = common.reqToDatabaseFormat(req.query);
  // orderInfo["StatusCode"] = "기존주문";
  if (!orderInfo.SubsNo) {
    res.status(200).send({ status: "success", data: [] });
  } else {
    const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('', 'OrderMst', orderInfo)
    if (orderStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get Order infomation at /order/info" });
    }

    let statusCodeData = null;

    const { status: statusCodeStatus, rows: statusCodeRows } = await crud.getDataListFromTable('GROUP_CONCAT(StatusCode) as StatusCodes', 'OrderMst', { SubsNo: orderInfo.SubsNo, DeliveryDate: orderInfo.DeliveryDate })
    if (statusCodeStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get Order infomation at /order/info" });
    }
    statusCodeData = statusCodeRows[0].StatusCodes

    let subscribeData = null;
    if (orderRows.length !== 0) {
      const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('PaymentNo,AddressNo,StatusCode', 'SubsMst', { SubsNo: orderRows[0].SubsNo })
      if (subscribeStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to get Subcribe infomation at /order/info" });
      }
      subscribeData = subscribeRows
      console.log('subscribeRows', subscribeData)
    }
    res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(orderRows), subscribeInfo: subscribeData != null ? subscribeData[0] : "", statusCodes: statusCodeData?.split(",") });
  }
})

router.get("/infowithorderno", async (req, res) => {
  // const subsNo = req.query.subsNo;
  const orderInfo = common.reqToDatabaseFormat(req.query);
  // orderInfo["StatusCode"] = "기존주문";

  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('', 'OrderMst', orderInfo)
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /order/info" });
  }

  let statusCodeData = null;

  const { status: statusCodeStatus, rows: statusCodeRows } = await crud.getDataListFromTable('GROUP_CONCAT(StatusCode) as StatusCodes', 'OrderMst', { SubsNo: orderInfo.SubsNo, DeliveryDate: orderInfo.DeliveryDate })
  if (statusCodeStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /order/info" });
  }
  statusCodeData = statusCodeRows[0].StatusCodes

  let subscribeData = null;
  if (orderRows.length !== 0) {
    const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('PaymentNo,AddressNo,StatusCode', 'SubsMst', { SubsNo: orderRows[0].SubsNo })
    if (subscribeStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get Subcribe infomation at /order/info" });
    }
    subscribeData = subscribeRows
    console.log('subscribeRows', subscribeData)
  }
  res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(orderRows), subscribeInfo: subscribeData != null ? subscribeData[0] : "", statusCodes: statusCodeData?.split(",") });
})


router.get("/productkind", async (req, res) => {
  const subsNo = req.query.subsNo;
  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('OrderNo,DeliveryDate , Product, StatusCode', 'OrderMst', { SubsNo: subsNo }, null, '')
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /productkind" });
  }
  res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(orderRows) });
})


router.get("/menuofdeliverydate", async (req, res) => {
  const deliveryDate = common.jsDateToMysqlDateTime(req.query.deliveryDate);
  const { status: menuOfDeliveryDateStatus, rows: menuOfDeliveryDateRows } = await menuOfDeliveryDate(deliveryDate.split(" ")[0]);

  if (menuOfDeliveryDateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get Order infomation at /menuofdeliverydate" });
  } else {
    res.status(200).send({ status: "exist", data: common.DatabaseToResFormat(menuOfDeliveryDateRows) });
  }
})

/**
 * 1. 쉬어가기하는 날의 주문은 쉬어가기로 상태값 변경
 * 2. 새로운 주문을 생성하여 변경된 날에 생성
 * 3. 기존 "수량 변경" 상태의 주문은 모두 변경된날로 배송날짜를 변경
 */
router.post('/pause', async (req, res) => {
  const deliveryDate = common.jsDateToMysqlDateTime(req.body.deliveryDate);
  const subsNo = req.body.subsNo;
  const orderNo = req.body.orderNo;
  console.log('deliveryDate', deliveryDate)

  const { status: orderRowsStatus, rows: orderRows } = await crud.getDataListFromTable("", "OrderMst", { SubsNo: subsNo, orderNo: orderNo });
  if (orderRowsStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get order information info at /pause" });
  }

  const newOrder = orderRows[0];
  const pauseDate = common.jsDateToMysqlDateTime(req.body.pauseDeliveryDate.slice(0, 19).replace('T', ' '));
  newOrder["DeliveryDate"] = pauseDate;
  newOrder["UpdDate"] = common.jsDateToMysqlDateTime(new Date());
  newOrder["RegDate"] = common.jsDateToMysqlDateTime(new Date());
  delete newOrder["CnlDate"]
  delete newOrder["OrderNo"]

  const whereParse = {
    DeliveryDate: common.jsDateToMysqlDateTime(req.body.deliveryDate),
    OrderNo: req.body.orderNo,
    SubsNo: req.body.subsNo,
  }
  const { status } = await crud.updateData('OrderMst', { StatusCode: "쉬어가기" }, whereParse)
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to update in /pause" });
  }

  const { status: amoutChangeOrderStatus } = await crud.updateData('OrderMst', { deliveryDate: pauseDate }, { deliveryDate: deliveryDate, StatusCode: "수량변경" })
  if (amoutChangeOrderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to amount change order info in /pause" });
  }

  const { status: orderCreateStatus, rows: orderCreateRows } = await crud.createDataRow('OrderMst', newOrder)
  if (orderCreateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create new order information in /pause" });
  }
  res.status(200).send({ status: "success" })

})


router.post("/getpausedate", async (req, res) => {
  const deliveryDate = new Date(req.body.deliveryDate);
  const subsNo = req.body.subsNo;

  const { status: orderRowsStatus, rows: orderRows } = await getMaxDeliveryDate(subsNo, common.jsDateToMysqlDateTime(deliveryDate));
  if (orderRowsStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get max deliverydate info at /getpausedate" });
  }
  console.log('orderRows', orderRows)

  let locdate = common.formatLocaleDate(orderRows[0].MaxDeliveryDate);
  console.log('locdate', locdate)
  let pauseDeliveryDate = new Date(locdate.setDate(locdate.getDate() + 7));
  let len = 0;

  do {
    const { status: holidayStatus, rows: holiydayRows } = await crud.getDataListFromTable('', 'HoliydayMst', { Locdate: pauseDeliveryDate })
    if (holidayStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to delete subs info at billingSubscribe()" });
    }
    if (holiydayRows?.length !== 0) {
      len = holiydayRows.length;
      locdate = new Date(pauseDeliveryDate.setDate(pauseDeliveryDate.getDate() + 7));
    } else {
      break;
    }
  } while (len > 0)

  res.status(200).send({ status: "success", data: locdate })

})


router.get("/initialproductinfo", async (req, res) => {

  const { status: orderStatus, rows: orderRows } = await crud.getDataListFromTable('', 'OrderMst', { OrderNo: req.query.orderNo })
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to  order info at /initialproductinfo" });
  }

  const { status: ordersStatus, rows: ordersRows } = await crud.getDataListFromTable('', 'OrderMst', { DeliveryDate: common.jsDateToMysqlDateTime(orderRows[0].DeliveryDate) })
  if (orderStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to  order info at /initialproductinfo" });
  }


  console.log('ordersRows', ordersRows);

  const { status: codeListStatus, rows: codeListrows } = await crud.getDataListFromTable('', 'CodeMst', { CodeType: "ITEM_CATEGORY" })
  if (codeListStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get product code at /productinfo" });
  }


  const productInfo = orderRows[0].Product.split(",");
  console.log('productInfo', productInfo);
  const tmp = [];


  codeListrows.map(code => {
    for (let i = 0; i < productInfo.length; i++) {
      const productList = productInfo[i].split("-");
      const productName = productList[0];
      const amount = productList[1];
      if (code.CodeLabel === productName) {
        tmp.push({
          key: code.CodeKey,
          name: code.CodeLabel,
          price: code.CodeValue,
          dow: orderRows[0].DeliveryDow,
          amount: parseInt(amount)
        })
      }

    }
  })




  const tagGroupNo = orderRows[0].TagGroupNo;
  const deliveryDow = orderRows[0].DeliveryDow;

  const { status: tagStatus, rows: tagRows } = await crud.getDataListFromTable('', 'Tag', { TagGroupNo: tagGroupNo, DeliveryDow: deliveryDow })
  if (tagStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to  tag info at /productinfo" });
  }


  res.status(200).send({ status: "success", data: tmp })

})




/**
 * 1. 기존 주문의 상태를 "수량변경"으로 변경
 * 2. 차액 계산
 *    1) 변경금액이 큰 경우 ( 수량을 추가한 경우)
 *     결제되어야하는 금액 >0 이고 이는 실제로 결제되어야하는 금액이다. 여기서 포인트를 사용하게 되면 결제되어야하는 금액에서 포인트를 차감하고 결제진행( 단 , 결제되어야하는 금액 보다 포인트를 많이 쓸순 없다)
 *     58,000원(변경 결제 금액) - 32,000원(이전결제 금액) = 16,000(결제되어야하는 금액) - 10,000원(포인트 사용) = 6,000(실제로 결제되는 금액)
 *    2) 이전 결제금액이 큰 경우 ( 수량을 줄인 경우)
 *     결제되어야하는 금액 <0 이고 이는 환불되어야하는 금액이다. 환불되어야하는 금액은 포인트로환불된다. 이때는 포인트 사용이 불가해야한다. 
 */

router.post("/amountchange", async (req, res) => {
  const orderInfo = req.body.orderInfo;
  const paymentNo = orderInfo.paymentNo;
  console.log('paymentNo', paymentNo)



  if (orderInfo.beforeOrderNo) {
    //기존 주문에서 정보 획득
    const { status: orderRowsStatus, rows: orderRows } = await crud.getDataListFromTable("", "OrderMst", { OrderNo: orderInfo.beforeOrderNo });
    if (orderRowsStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get order info in /amountchange" });
    }
    const userNo = orderRows[0].UserNo;
    const subsNo = orderRows[0].SubsNo;
    const tagGroupNo = orderRows[0].TagGroupNo;


    //태그 정보 획득
    const { status: tagStatus, rows: tagRows } = await crud.getDataListFromTable("", "Tag", { TagGroupNo: tagGroupNo });
    if (tagStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get order info in /amountchange" });
    }

    console.log('tagRows', tagRows)



    // 기존 주문 상태변경
    const { status: orderUpdateStatus } = await crud.updateData('OrderMst', { StatusCode: "수량변경" }, { OrderNo: orderInfo.beforeOrderNo })
    if (orderUpdateStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to update order StatusCode in /amountchange" });
    }


    const defaultDiscountPrice = orderInfo.defaultDiscountPrice;
    const beforeTotalPrice = orderInfo.beforeTotalPrice;
    const discountAmount = orderInfo.milesAmount ? orderInfo.milesAmount : 0;
    let paymentPrice = 0;
    let paybackMiles = 0;

    //결제 정보 획득
    const { status: paymentRowsStatus, rows: paymentRows } = await crud.getDataListFromTable("PaymentNo,PaymentType,PaymentCuid", "PaymentMst", { PaymentNo: paymentNo });
    if (paymentRowsStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payment info in /amountchange" });
    }
    const paymentType = paymentRows[0].PaymentType;
    const paymentCuid = paymentRows[0].PaymentCuid;
    const merchantUid = `oder_change_${userNo}_${Date.now()}`
    const milesPrice = parseInt(orderInfo.milesAmount);
    paymentPrice = defaultDiscountPrice - beforeTotalPrice - discountAmount;

    console.log('paymentPrice', paymentPrice, discountAmount)


    //주문생성
    const productInfo = () => {
      const productInfoList = orderInfo.product;
      const productConcat = [];
      productInfoList.sort((a, b) => {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
      }).map((product) => {
        productConcat.push(`${product.name}-${product.amount}`);
      })
      return productConcat.join(",");
    }
    const beforeOrder = orderRows[0];
    const newOrder = {
      UserNo: userNo,
      Period: 4,
      OrderPrice: defaultDiscountPrice,
      SubsNo: subsNo,
      Product: productInfo(),
      StatusCode: "기존주문",
      DeliveryDate: beforeOrder.DeliveryDate,
      DeliveryStartDate: beforeOrder.DeliveryStartDate,
      DeliveryDow: beforeOrder.DeliveryDow,
      Address: beforeOrder.Address,
      ApartmentName: beforeOrder.ApartmentName,
      ApartmentBuilding: beforeOrder.ApartmentBuilding,
      ApartmentUnit: beforeOrder.ApartmentUnit,
      RcvName: beforeOrder.RcvName,
      ContactNo: beforeOrder.ContactNo,
      PaymentType: paymentType,
      CustomerUid: paymentCuid,
      Driver: beforeOrder.Driver,
      Flex: beforeOrder.Flex,
    };

    console.log('newOrder', newOrder)

    const { status: orderCreateStatus, rows: orderCreateRows } = await crud.createDataRow('OrderMst', newOrder)
    if (orderCreateStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to create new order information in /pause" });
    }

    const newOrderNo = orderCreateRows.insertId;

    console.log('orderCreateRowsfirst', orderCreateRows)

    if (defaultDiscountPrice - beforeTotalPrice < 0) {
      /*수량이 줄었으므로 적립금으로 반환*/

      paybackMiles = beforeTotalPrice - defaultDiscountPrice;
      const milesEventInfo = {
        UserNo: userNo,
        StatusCode: "적립",
        SubsNo: subsNo,
        OrderNo: newOrderNo,
        Amount: paybackMiles,
        EventType: "수량변경"
      }

      const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
      if (MilesEventMst === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
      }
      const result = await addMiles(MilesEventMstRows.insertId, paybackMiles, userNo, newOrderNo)
      if (result.status === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
      }

    } else {
      /*추가 수량이므로 추가 결제 진행*/
      //결제 진행
      if (paymentPrice !== 0) {
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
          switch (paymentType) {
            case "Kakao":
              paymentObject =
              {
                pg: "kakaopay.TCSUBSCRIP",
                merchant_uid: merchantUid,
                name: '현관앞키친 수량변경',
                pay_method: "kakaopay",
                amount: Number(paymentPrice),
                customer_uid: paymentCuid,
              }
              break;
            case "Card":
              paymentObject = {
                pg: "nice.nictest04m",
                merchant_uid: merchantUid,
                amount: Number(paymentPrice),
                customer_uid: paymentCuid,
                name: "현관앞키친 수량변경"
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
          });

          const { code } = paymentResult.data;
          const response = paymentResult.data.response;

          const paymentHistoryInfo = {
            ImpUid: response.imp_uid,
            UserNo: userNo,
            SubsNo: subsNo,
            OrderNo: newOrderNo,
            PaymentType: "수량변경",
            PaymentNo: paymentNo,
            Price: Number(paymentPrice),
            PaymentDate: common.jsDateToMysqlDateTime(new Date()),
            PaymentStatus: "",
            FailReason: "",
            CancelReason: "",
          }


          if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
            if (response.status === "paid") { //카드 정상 승인
              console.log("Billing order of amount change Done");
              //마일리지 사용 처리
              if (milesPrice !== 0) {
                const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, newOrderNo, "수량변경");
                await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", newOrderNo, response.imp_uid);
              }
              //결제내역 생성
              paymentHistoryInfo['PaymentStatus'] = response.status;
              const { status: paymentHistorytatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
              if (paymentHistorytatus === -1) {
                res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
              }
              console.log("Create Payment History Done");
            } else { //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
              res.status(200).send({ status: "fail", message: response.fail_reason });
            }
          }
        } catch (e) {
          console.log('payment error', e)
          res.status(400).send(e);
        }
      }
    }


    res.status(200).send({ status: "success", data: { newOrderNo: newOrderNo } })


  }
})





// if(수량변경주문){ // 이 때, 주문을 편리하게 뽑기 위해 상태값을 기존주문 -> 수량변경으로 상태값이 변경되면 보다 구분이 잘될거같음, 필수사항은 아님)
// 	적립금으로 환불
// 	} else {
// 	기존 주문에 미배송만 카운트하여 카드로 환불 }

// -> 적립금으로 환불 상세 로직
// 1. 모든 (추가수량 - 취소수량) -> 예) 반 샐 국 : 1 0 -1
// 2. 각 상품의 값 > 0 : 추가 수량으로 유지되야함
// 						< 0 : 환불되었던 상품
// 						= 0 : 변경없음
// 3. 이때 0보다 작은 값을 가진 상품은 result = (기존 주문 - 환불되었던 상품) 
// result에 대한 값을 적립금으로 환불
// 환불되었던 상품을 빼주는 이유는 기존 주문을 모두 환불하면 이전에 환불된 상품과 중복으로 환불되기 때문

// 4. 추가 수량으로 유지되어야하는 값은(= 0보다 큰 상품들) 새로운 주문으로 만들어주고 이전의 주문들은 구별되어야함 
// -> 현재로는 이전 주문들의 태그그룹번호에 태그번호를 넣어주어 구별하는 방법임, 상태값(수량추가,취소)을 바꿀 수 없는 이유는
// 결제 내역에서 추가수량과 취소수량의 값을 불러와 표시할때 필요하기 때문, 추가로 동시에 일어난 주문들은
// 날짜로 묶어서 분리된 추가,취소를 묶어서 보여줘야함

// 5. 4번 내용과 같이 추가 수량으로 유지되어야하는 값은 새로운 주문으로 만들어줘야하고 
// 보통 추가 수량과 유사한 형태를 가지고 있지만
// 이전 구독에서 유지된 '추가수량'이기때문에 결제히스토리값이 없고 결제내역에 보여지지 않아야한다.

// 6. 새로운 주문에 대해서는 결제 내역에서만 잘 분리된다면 구독변경과 하루수량변경에서 계산에는
// 영향을 끼치치 않는다. 똑같이 태그그룹번호가 없으며 추가수량으로 그날에 대해 계산해주면 되기 때문이다.


router.post("/amountchange2", async (req, res) => {
  const orderInfo = req.body.orderInfo;
  const paymentNo = orderInfo.paymentNo;
  console.log('orderInfo', orderInfo)

  if (orderInfo.beforeOrderNo) {
    //기존 구독주문에서 정보 획득
    const { status: orderRowsStatus, rows: orderRows } = await crud.getDataListFromTable("", "OrderMst", { OrderNo: orderInfo.beforeOrderNo });
    if (orderRowsStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get order info in /amountchange" });
    }
    //기존 수량변경 주문에서 정보 획득
    const { status: amoutChangedOrderStatus, rows: amoutChangedOrderRows } = await crud.getDataListFromTable("", "OrderMst", { DeliveryDate: common.jsDateToMysqlDateTime(orderInfo.deliveryDate), TagGroupNo: 0 });
    if (orderRowsStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get order info in /amountchange" });
    }

    console.log('amoutChangedOrderRows', amoutChangedOrderRows)
    const beforeOrder = orderRows[0];
    const userNo = beforeOrder.UserNo;
    const subsNo = beforeOrder.SubsNo;
    const dow = beforeOrder.DeliveryDow
    const tagGroupNo = beforeOrder.TagGroupNo;
    const beforeProduct = beforeOrder.Product;



    //주문생성
    const productInfo = (productInfo) => {
      const productConcat = [];
      productInfo.sort((a, b) => {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
      }).map((product) => {
        productConcat.push(`${product.name}-${product.amount}`);
      })
      return productConcat.join(",");
    }

    console.log('orderInfo.diff', orderInfo.diff)
    const productDiff = orderInfo.diff

    let incProduct = [];
    let decProduct = [];
    productDiff.forEach(product => {
      if (product.inc.length !== 0) {
        incProduct.push(product.inc[0]);
      }
      if (product.dec.length !== 0) {
        decProduct.push(product.dec[0]);
      }
    });

    console.log('incProduct', productInfo(incProduct));
    console.log('decProduct', productInfo(decProduct));

    const defaultDiscountPrice = orderInfo.defaultDiscountPrice;
    const beforeTotalPrice = orderInfo.beforeTotalPrice;
    const discountAmount = orderInfo.milesAmount ? orderInfo.milesAmount : 0;
    let paymentPrice = 0;
    let paybackMiles = 0;

    //결제 정보 획득
    const { status: paymentRowsStatus, rows: paymentRows } = await crud.getDataListFromTable("PaymentNo,PaymentType,PaymentCuid", "PaymentMst", { PaymentNo: paymentNo });
    if (paymentRowsStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get payment info in /amountchange" });
    }
    const paymentType = paymentRows[0].PaymentType;
    const paymentCuid = paymentRows[0].PaymentCuid;
    const merchantUid = `oder_change_${userNo}_${Date.now()}`
    const milesPrice = parseInt(orderInfo.milesAmount);
    paymentPrice = defaultDiscountPrice - beforeTotalPrice - discountAmount;

    console.log('paymentPrice', paymentPrice, discountAmount)

    if (incProduct.length !== 0) {

      let incOrder = {
        UserNo: userNo,
        Period: 4,
        OrderPrice: defaultDiscountPrice,
        SubsNo: subsNo,
        Product: productInfo(incProduct),
        StatusCode: "수량추가",
        DeliveryDate: beforeOrder.DeliveryDate,
        DeliveryStartDate: beforeOrder.DeliveryStartDate,
        DeliveryDow: beforeOrder.DeliveryDow,
        Address: beforeOrder.Address,
        ApartmentName: beforeOrder.ApartmentName,
        ApartmentBuilding: beforeOrder.ApartmentBuilding,
        ApartmentUnit: beforeOrder.ApartmentUnit,
        RcvName: beforeOrder.RcvName,
        ContactNo: beforeOrder.ContactNo,
        PaymentType: paymentType,
        CustomerUid: paymentCuid,
        Driver: beforeOrder.Driver,
        Flex: beforeOrder.Flex,
      };

      const { status: orderCreateStatus, rows: orderCreateRows } = await crud.createDataRow('OrderMst', incOrder)
      if (orderCreateStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to create new order information in /pause" });
      }

      const newOrderNo = orderCreateRows.insertId;


      /*추가 수량이므로 추가 결제 진행*/
      //결제 진행
      if (paymentPrice !== 0) {
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
          switch (paymentType) {
            case "Kakao":
              paymentObject =
              {
                pg: "kakaopay.TCSUBSCRIP",
                merchant_uid: merchantUid,
                name: '현관앞키친 수량변경',
                pay_method: "kakaopay",
                amount: Number(paymentPrice),
                customer_uid: paymentCuid,
              }
              break;
            case "Card":
              paymentObject = {
                pg: "nice.nictest04m",
                merchant_uid: merchantUid,
                amount: Number(paymentPrice),
                customer_uid: paymentCuid,
                name: "현관앞키친 수량변경"
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
          });

          const { code } = paymentResult.data;
          const response = paymentResult.data.response;

          const paymentHistoryInfo = {
            ImpUid: response.imp_uid,
            UserNo: userNo,
            SubsNo: subsNo,
            OrderNo: newOrderNo,
            PaymentType: "수량변경",
            PaymentNo: paymentNo,
            Price: Number(paymentPrice),
            PaymentDate: common.jsDateToMysqlDateTime(new Date()),
            PaymentStatus: "",
            FailReason: "",
            CancelReason: "",
          }


          if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
            if (response.status === "paid") { //카드 정상 승인
              console.log("Billing order of amount change Done");
              //마일리지 사용 처리
              if (milesPrice !== 0) {
                const { milesEventNo } = await milesModel.useMiles(res, userNo, subsNo, milesPrice, newOrderNo, "수량변경");
                await milesModel.handleMilesDetails(milesEventNo, milesPrice, userNo, subsNo, "사용", newOrderNo, response.imp_uid);
              }
              //결제내역 생성
              paymentHistoryInfo['PaymentStatus'] = response.status;
              const { status: paymentHistoryStatus, rows: paymentHistoryRows } = await crud.createDataRow('PaymentHistory', paymentHistoryInfo)
              if (paymentHistoryStatus === -1) {
                res.status(500).send({ status: "error", error: "Failed to create paymenthistory at billingSubscribe()" });
              }
              console.log("Create Payment History Done");

            } else { //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
              const { status: deleteOrderStatus, rows: deleteOrder } = await crud.deleteData("OrderMst", { OrderNo: newOrderNo });
              if (deleteOrderStatus === -1) {
                res.status(500).send({ status: "error", error: "Failed to delete order at /amoutchange" });
              }
              res.status(200).send({ status: "fail", message: response.fail_reason });
            }
          }
        } catch (e) {
          console.log('payment error', e)
          const { status: deleteOrderStatus, rows: deleteOrder } = await crud.deleteData("OrderMst", { OrderNo: newOrderNo });
          if (deleteOrderStatus === -1) {
            res.status(500).send({ status: "error", error: "Failed to delete order at /amoutchange" });
          }
          res.status(400).send(e);
        }
      }




    }

    if (decProduct.length !== 0) {
      let decOrder = {
        UserNo: userNo,
        Period: 4,
        OrderPrice: 0,
        SubsNo: subsNo,
        Product: productInfo(decProduct),
        StatusCode: "취소수량",
        DeliveryDate: beforeOrder.DeliveryDate,
        DeliveryStartDate: beforeOrder.DeliveryStartDate,
        DeliveryDow: beforeOrder.DeliveryDow,
        Address: beforeOrder.Address,
        ApartmentName: beforeOrder.ApartmentName,
        ApartmentBuilding: beforeOrder.ApartmentBuilding,
        ApartmentUnit: beforeOrder.ApartmentUnit,
        RcvName: beforeOrder.RcvName,
        ContactNo: beforeOrder.ContactNo,
        PaymentType: paymentType,
        CustomerUid: paymentCuid,
        Driver: beforeOrder.Driver,
        Flex: beforeOrder.Flex,
      };

      const { status: orderCreateStatus, rows: orderCreateRows } = await crud.createDataRow('OrderMst', decOrder)
      if (orderCreateStatus === -1) {
        res.status(500).send({ status: "error", error: "Failed to create new order information in /pause" });
      }

      const newOrderNo = orderCreateRows.insertId;

      paybackMiles = beforeTotalPrice - defaultDiscountPrice;
      const milesEventInfo = {
        UserNo: userNo,
        StatusCode: "적립",
        SubsNo: subsNo,
        OrderNo: newOrderNo,
        Amount: paybackMiles,
        EventType: "수량변경"
      }

      const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
      if (MilesEventMst === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
      }
      const result = await addMiles(MilesEventMstRows.insertId, paybackMiles, userNo, newOrderNo)
      if (result.status === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
      }
    }



    res.status(200).send({ status: "success" });


  }


})
module.exports = router