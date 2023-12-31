var express = require("express");
var router = express.Router();
var jwToken = require("../public/javascripts/jwt.js");
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
const crypto = require('crypto')
var axios = require("axios");
const { getUserNo } = require("../models/user.js");
require("dotenv").config();
var auth = require("../middleware/auth.js")
var addAddress = require("./address.js");
const { addMiles, getMiles } = require("../models/miles.js");

const KAKAO_RESTAPI_KEY = process.env.KAKAO_RESTAPI_KEY;

router.post("/", async (req, res) => {

  const loginInfo = common.reqToDatabaseFormat(req.body);
  const { rows } = await crud.getDataListFromTable('', 'UserMst', { UserEmail: loginInfo.UserEmail, StatusCode: "normal" })
  if (!rows || rows.length === 0) {
    res.status(200).send({ status: "not found", error: "User information is not found" });
  } else {
    crypto.pbkdf2(loginInfo.UserPassword, rows[0].SaltKey, 9999, 64, 'sha512', (err, key) => {
      if (err) {
        res.status(500).send({ status: "fail", error: "Failed to salting password" });
      } else {
        if (key.toString('base64') === rows[0].UserPassword) {
          common.setJwtTokens(req, res, rows[0].UserEmail, rows[0].UserPhone);
          res.status(200).send({
            status: "success",
          });
        } else {
          res.status(200).send({ status: "fail", error: "Wrong password" });

        }
      }
    });
  }

});


router.get("/logout", async (req, res) => {
  try {
    res.cookie("_actk", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(),
    });
    res.cookie("_rftk", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(),
    });
    res.status(200).send({ status: "success", error: "logout" });

  } catch (error) {
    res.status(200).send({ status: "fail", error: error });

  }

})

router.post("/kakaologinvalidation", async (req, res) => {
  const code = req.body.code
  console.log('authcode :>> ', code);
  await axios({
    url: "https://kauth.kakao.com/oauth/token",
    method: "POST",
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: {
      grant_type: "authorization_code",
      client_id: KAKAO_RESTAPI_KEY,
      redirect_uri: `http://localhost:3000/login/kakaologin`,
      code: code
    }
  }).then(response => {
    res.status(200).send({ status: "success", data: response.data })
  })


})


router.post("/kakaologin", async (req, res) => {
  const userInfo = req.body.userInfo;
  const userKakaoId = userInfo.id;
  const kakaoAccount = userInfo.kakao_account;
  const recommendCode = req.body.recommendCode ? req.body.recommendCode : null;
  const userEmail = kakaoAccount.email;
  let userPhone = "0" + kakaoAccount.phone_number.split(" ")[1];
  userPhone = userPhone.replace(/[^0-9]/g, "");
  const birthDay = `${kakaoAccount.birthyear}-${kakaoAccount.birthday[0]}${kakaoAccount.birthday[1]}-${kakaoAccount.birthday[2]}${kakaoAccount.birthday[3]}`
  const signupInfo = {
    UserType: `kakao_${userKakaoId}`,
    UserName: kakaoAccount.name,
    UserPhone: userPhone,
    UserEmail: kakaoAccount.email,
    UserGender: kakaoAccount.gender,
    birthDay: common.jsDateToMysqlDateTime(birthDay),
    MarketingAgreement: 1,
    StatusCode: "normal",
  }

  const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('', 'UserMst', { userEmail: userEmail, StatusCode: "normal" });
  if (userStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get User infomation at /login/kakaologin" });
  }
  if (userRows.length === 0) {

    const { password, salt } = await common.createHashedPassword(userKakaoId + new Date());
    signupInfo["UserPassword"] = password
    signupInfo["SaltKey"] = salt
    signupInfo["RecommendCode"] = Math.random().toString(36).substring(2, 12)


    const { status, rows: createdUserRows } = await crud.createDataRow('UserMst', signupInfo);

    if (status !== -1) {

      const milesEventInfo = {
        UserNo: createdUserRows.insertId,
        StatusCode: "적립",
        Amount: 3000,
        EventType: "회원가입"
      }

      const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
      if (MilesEventMst === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
      }

      const result = await addMiles(MilesEventMstRows.insertId, 3000, createdUserRows.insertId)
      if (result.status === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
      }

      common.setJwtTokens(req, res, userEmail, userPhone);
      res.status(200).send({ status: "not exist" });
    } else {
      res.status(200).send({ status: "error", error: "Failed to create user information" });
    }

  } else {
    common.setJwtTokens(req, res, userEmail, userPhone);
    console.log('kakaologin')
    res.status(200).send({
      status: "success",
    });
  }
})

router.post("/simplesignup", auth, async (req, res) => {
  const userNo = await getUserNo(req, res);
  const { funnel, recommendCode } = req.body

  //마일리지 등록
  let recommendMiles = 0;
  if (recommendCode != null) {
    const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('UserNo', 'UserMst', { RecommendCode: recommendCode, StatusCode: "normal" })
    if (userStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get user information" });
    }
    recommendMiles = userRows.length !== 0 ? 7000 : 0;

    if (recommendMiles !== 0) {

      const milesEventInfo = {
        UserNo: userNo,
        StatusCode: "적립",
        Amount: recommendMiles,
        EventType: "회원가입"
      }

      const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
      if (MilesEventMst === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
      }

      const result = await addMiles(MilesEventMstRows.insertId, recommendMiles, userNo)
      if (result.status === -1) {
        res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
      }
    }
  }


  const { status } = await crud.updateData('UserMst', { Funnel: funnel }, { UserNo: userNo })
  if (status === -1) {
    res.status(500).send({ status: "error", error: "유입경로 등록에 실패했습니다." });
  } else {
    res.redirect(307, "/api/address/add");
  }
})


router.get("/check", auth, async (req, res) => {
  res.status(200).send({ status: "success" })
})
module.exports = router;

