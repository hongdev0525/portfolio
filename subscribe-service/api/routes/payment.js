
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
var db = require("../db/db.js");
const axios = require("axios");
const crypto = require('crypto')
const userModel = require("../models/user.js");
const { getUserNo } = require("../models/user.js");
require("dotenv").config();

const IMP_KEY = process.env.IMP_KEY;
const IMP_API_SECRET = process.env.IMP_API_SECRET;



const paymentDuplicatedCheck = async (req, res, next) => {
  const userNo = await userModel.getUserNo(req, res);
  const { cardNumber } = req.body;
  const { rows: paymentRows } = await crud.getDataListFromTable(["PaymentNumber", "PaymentSaltKey"], 'PaymentMst', { UserNo: userNo })
  if (paymentRows && paymentRows.length !== 0 && paymentRows.PaymentNumber != null) {
    for (row of paymentRows) {
      crypto.pbkdf2(cardNumber, row.PaymentSaltKey, 9999, 64, 'sha512', (err, key) => {
        if (err) {
          res.status(500).send({ status: "fail", error: "Failed to salting password" });
        } else {
          if (key.toString('base64') === row.PaymentNumber) {
            res.status(200).send({ status: "fail", error: "duplicate" });
            res.end();
          }
        }
      });
    }
  } else {
    next()
  }

}



router.get("/info", async (req, res) => {
  const paymentNo = req.query.paymentNo;
  const { status, rows: paymentRows } = await crud.getDataListFromTable('PaymentNo,PaymentType,PaymentName,CardName,BankName', 'PaymentMst', { PaymentNo: paymentNo })
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user payment infomation at /payment/list" });
  } else {
    res.status(200).send({ status: "exist", data: paymentRows });
  }
});

router.get("/infowithsubsno", async (req, res) => {

  const subsNo = req.query.subsNo;
  console.log('subsNo', subsNo);
  const { status: subsMstStatus, rows: subsMstRows } = await crud.getDataListFromTable('PaymentNo', 'SubsMst', { SubsNo: subsNo })
  if (subsMstStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user payment infomation at /payment/list" });
  }

  console.log('subsMstRows', subsMstRows)
  const paymentNo = subsMstRows[0].PaymentNo;
  const { status, rows: paymentRows } = await crud.getDataListFromTable('PaymentNo,PaymentType,PaymentName,CardName,BankName', 'PaymentMst', { PaymentNo: paymentNo })
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user payment infomation at /payment/list" });
  } else {
    res.status(200).send({ status: "exist", data: paymentRows });
  }
});


router.get("/list", async (req, res) => {
  const userNo = await userModel.getUserNo(req, res);
  const { status, rows: paymentRows } = await crud.getDataListFromTable('PaymentNo,PaymentType,PaymentName,CardName,BankName', 'PaymentMst', { UserNo: userNo })
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user payment infomation at /payment/list" });
  } else {
    res.status(200).send({ status: "exist", data: paymentRows });
  }
})


router.post("/issuekakaobilling", async (req, res) => {
  const kakaopayInfo = common.reqToDatabaseFormat(req.body);
  if (kakaopayInfo.length === 0 || !kakaopayInfo) {
    res.status(500).send({ status: "error", error: "No kakao input information" });
  }

  const userNo = await userModel.getUserNo(req, res);
  kakaopayInfo["UserNo"] = userNo
  kakaopayInfo["Status"] = "normal"
  kakaopayInfo["PaymentName"] = "카카오페이"
  kakaopayInfo["PaymentSaltkey"] = ""


  const { status, rows } = await crud.createDataRow('PaymentMst', kakaopayInfo)
  if (status !== -1) {
    res.send({ status: "success", message: "Kakao billing has successfully issued", data: rows.insertId });
  } else {
    res.status(500).send({ status: "error", error: "Failed to create kakao payment information" });
  }
})


router.post("/issuebilling", async (req, res) => {

  const userNo = await userModel.getUserNo(req, res);
  const cuid = `CUID_${userNo}_${Date.now()}`;

  const {
    paymentType,
    paymentName,
    cardNumber, // 카드 번호
    expiry, // 카드 유효기간
    birth, // 생년월일
    pwd2Digit, // 카드 비밀번호 앞 두자리
  } = req.body; // req의 body에서 카드정보 추출
  // 인증 토큰 발급 받기
  const parsedExpiry = `20${expiry[2] + expiry[3]}-${expiry[0] + expiry[1]}`

  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
      imp_key: IMP_KEY, // REST API 키
      imp_secret: IMP_API_SECRET // REST API Secret
    }
  })
  const { access_token } = getToken.data.response; // 인증 토큰
  // 빌링키 발급 요청

  const issueBilling = await axios({
    url: `https://api.iamport.kr/subscribe/customers/${cuid}`,
    method: "post",
    headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
    data: {
      pg: "nice.nictest04m",
      card_number: cardNumber, // 카드 번호
      expiry: parsedExpiry, // 카드 유효기간
      birth: birth, // 생년월일
      pwd_2digit: pwd2Digit, // 카드 비밀번호 앞 두자리
    }
  })
  const { code, message } = issueBilling.data;
  const { password: hashedCardNumber, salt } = await common.createHashedPassword(cardNumber);
  if (code === 0) { // 빌링키 발급 성공
    const paymentInput = {
      PaymentType: paymentType,
      UserNo: userNo,
      PaymentNumber: hashedCardNumber,
      PaymentCuid: cuid,
      Status: "normal",
      PaymentName: paymentName,
      PaymentSaltKey: salt,
      CardName: issueBilling.data.card_name ? issueBilling.data.card_name : ""
    }
    const { status, rows } = await crud.createDataRow('PaymentMst', paymentInput)

    if (status !== -1) {
      res.send({ status: "success", message: "Billing has successfully issued", data: rows.insertId });
    } else {
      res.status(500).send({ status: "error", error: "Failed to create payment information" });
    }

  } else { // 빌링키 발급 실패
    res.send({ status: "failed", message: message });
  }

});

//TEST_CUID_1672712718790

router.post("/billings", async (req, res) => {
  try {
    const { customer_uid } = req.body; // req의 body에서 customer_uid 추출
    // 인증 토큰 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: IMP_KEY, // REST API 키
        imp_secret: IMP_API_SECRET // REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    // 결제(재결제) 요청
    const paymentResult = await axios({
      url: `https://api.iamport.kr/subscribe/payments/again`,
      method: "post",
      headers: { "Authorization": access_token }, // 인증 토큰을 Authorization header에 추가
      data: {
        pg: "nice.nictest04m",
        merchant_uid: `order_monthly_${Date.now()}`, // 새로 생성한 결제(재결제)용 주문 번호
        amount: 1000,
        customer_uid: "TEST_CUID_1672713273158",
        name: "현관 앞 키친  정기결제"
      }
    });
    const { code, message } = paymentResult;
    if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
      if (paymentResult.status === "paid") { //카드 정상 승인
        res.send({ status: "success", message: "Billing success" });
      } else { //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
        //paymentResult.status : failed 로 수신됨
        res.send({ status: "fail", message: paymentResult.fail_reason });
      }
      // res.send({ ... });
    } else { // 카드사 요청에 실패 (paymentResult is null)
      res.send({ status: "fail", message: "No Response from PG" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});


router.post("/updatesubscribepayment", async (req, res) => {
  const { paymentNo, subsNo } = req.body;
  console.log('paymentInfo', paymentNo, subsNo);
  const { status } = await crud.updateData('SubsMst', { PaymentNo: paymentNo }, { SubsNo: subsNo })
  if (status !== -1) {
    res.status(200).send({ status: "success" });
  } else {
    res.status(500).send({ status: "error", error: "Failed to update user password" });
  }
})

router.get("/historylistofsubscribe", async (req, res) => {
  const userNo = await getUserNo(req, res);

  const query =
    `SELECT 
    ph.*
    ,IFNULL(mem.Amount,0) as Amount
	,(SELECT 
	 	SUM(Amount) * IF(sm.SubsType ="experience" , 1, 4)
	 FROM
	 	Tag t 
	 WHERE 
	 	t.TagGroupNo  = ph.TagGroupNo) as ProductAmount
	 ,(SELECT 
	 	GROUP_CONCAT( DISTINCT  t.DeliveryDow  ORDER BY cm.CodeOrder ASC)
	 FROM
	 	Tag t 
	 LEFT JOIN
	 	CodeMst cm ON(cm.CodeLabel  = t.DeliveryDow)
	 WHERE 
	 	t.TagGroupNo  = ph.TagGroupNo
	 	
	 	) as Dows
	 , sm.RegDate as SubsRegDate
  FROM 
    PaymentHistory ph 
  LEFT JOIN
    MilesEventMst mem  ON (IF(ph.PaymentStatus ="refund" ,mem.EventType ="구독변경환급" ,mem.EventType = ph.PaymentType ) AND mem.SubsNo = ph.SubsNo)
  LEFT JOIN
	SubsMst sm ON (sm.SubsNo = ph.SubsNo)
  WHERE 
    ph.OrderNo  IS NULL 
    AND 
    ph.UserNo = ${userNo};
      
      `
    ;
  console.log('query', query)

  try {
    const [rows] = await db.query(query);
    console.log('rows', rows)

    res.status(200).send({ status: "exist", data: rows });

  } catch (error) {
    console.log('error', error)
    console.error(`Error Occured from getDataListFromTable() function : \r`, error.sqlMessage)
  }



})
router.get("/historyinfoofsubscribe", async (req, res) => {
  const userNo = await getUserNo(req, res);
  const historyNo = req.query.historyNo;
  const query =
    `SELECT 
    ph.*
    ,IFNULL(mem.Amount,0) as Amount
    ,sm.SubsType
	,(SELECT 
	 	SUM(Amount) * IF(sm.SubsType ="experience" , 1, 4)
	 FROM
	 	Tag t 
	 WHERE 
	 	t.TagGroupNo  = ph.TagGroupNo) as ProductAmount
	 ,(SELECT 
	 	GROUP_CONCAT( DISTINCT  t.DeliveryDow  ORDER BY cm.CodeOrder ASC)
	 FROM
	 	Tag t 
	 LEFT JOIN
	 	CodeMst cm ON(cm.CodeLabel  = t.DeliveryDow)
	 WHERE 
	 	t.TagGroupNo  = ph.TagGroupNo
	 	
	 	) as Dows
	 , sm.RegDate as SubsRegDate
  FROM 
    PaymentHistory ph 
  LEFT JOIN
    MilesEventMst mem  ON (IF(ph.PaymentStatus ="refund" ,mem.EventType ="구독변경환급" ,mem.EventType = ph.PaymentType ) AND mem.SubsNo = ph.SubsNo)
  LEFT JOIN
	SubsMst sm ON (sm.SubsNo = ph.SubsNo)
  WHERE 
    ph.OrderNo  IS NULL 
    AND 
    ph.UserNo = ${userNo}
    AND
    ph.HistoryNo = ${historyNo}
      `
    ;
  console.log('query', query)

  try {
    const [rows] = await db.query(query);
    console.log('rows', rows)

    res.status(200).send({ status: "exist", data: rows });

  } catch (error) {
    console.log('error', error)
    console.error(`Error Occured from getDataListFromTable() function : \r`, error.sqlMessage)
  }


})

router.get("/historyoforder", async (req, res) => {
  const userNo = await getUserNo(req, res);

  const query =
    `   
    SELECT
      mem.*
      ,ph.PaymentDate
      ,IFNULL( ph.Price , 0 ) as Price
      ,IFNULL( ph.PaymentStatus ,"refund") as PaymentStatus
      ,om.Product 
    FROM 
      MilesEventMst mem
    LEFT JOIN
      PaymentHistory ph ON(ph.OrderNo = mem.OrderNo)
    LEFT JOIN 
      OrderMst om ON(mem.OrderNo = om.OrderNo)
    WHERE 
      mem.OrderNo  IS NOT NULL 
    AND 
        mem.OrderNo  !=0 
    AND 
      mem.UserNo = ${userNo};
      
      `
    ;
  console.log('query', query)

  try {
    const [rows] = await db.query(query);
    console.log('rows', rows)
    res.status(200).send({ status: "exist", data: rows });

  } catch (error) {
    console.log('error', error)
    console.error(`Error Occured from getDataListFromTable() function : \r`, error.sqlMessage)
  }

})
router.get("/historyinfooforder", async (req, res) => {
  const userNo = await getUserNo(req, res);
  const orderNo = req.query.orderNo;
  const query =
    `   
    SELECT
      mem.*
      ,ph.PaymentDate
      ,ph.ImpUid
      ,IFNULL( ph.Price , 0 ) as Price
      ,IFNULL( ph.PaymentStatus ,"refund") as PaymentStatus
      ,om.Product
    FROM 
      MilesEventMst mem
    LEFT JOIN
      PaymentHistory ph ON(ph.OrderNo = mem.OrderNo)
    LEFT JOIN 
      OrderMst om ON(mem.OrderNo = om.OrderNo)
    WHERE 
      mem.OrderNo  IS NOT NULL 
    AND 
        mem.OrderNo  =${orderNo}
    AND 
      mem.UserNo = ${userNo};
      
      `
    ;
  console.log('query', query)

  try {
    const [rows] = await db.query(query);
    console.log('rows', rows)
    res.status(200).send({ status: "exist", data: rows[0] });

  } catch (error) {
    console.log('error', error)
    console.error(`Error Occured from getDataListFromTable() function : \r`, error.sqlMessage)
  }

})


module.exports = router