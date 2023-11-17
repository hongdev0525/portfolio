var express = require("express");
var router = express.Router();
const crypto = require('crypto')
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js");
var auth = require("../middleware/auth.js")
var userModel = require("../models/user.js");
const { addMiles, getMiles, expireMiles, handleMilesDetails } = require("../models/miles.js");
/**
 *
 * @param {string} tableName 테이블명
 * @param {object} fieldObj {필드명:필드값}
 */


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("user table");
});



router.get("/info", auth, async function (req, res) {
  console.log('req.accessToken :>> ', req.accessToken);
  const userInfo = common.getUserInfoFromCookie(req.accessToken);
  console.log('userInfo', userInfo)
  if (userInfo) {
    const { status, rows } = await crud.getDataListFromTable('UserEmail,UserName,UserPhone,UserNo,BirthDay,UserGender, UserType', 'UserMst', { UserEmail: userInfo.UserEmail, StatusCode: "normal" })
    if (status !== -1) {
      if (rows.length === 0) {
        res.status(200).send({ status: "Not exist" });
      } else {
        res.status(200).send({ status: "exist", data: rows[0] });
      }
    } else {
      res.status(500).send({ status: "error", error: "Failed to search user information" });
    }
  } else {
    res.status(500).send({ status: "error", error: "No input user information" });
  }
});

router.get("/searchid", async function (req, res) {
  const userInfo = common.reqToDatabaseFormat(req.query);
  console.log('userInfo', userInfo)
  if (userInfo.length !== 0) {
    const { status, rows } = await crud.getDataListFromTable('UserEmail', 'UserMst', userInfo)
    if (status !== -1) {
      if (rows.length === 0) {
        res.status(200).send({ status: "Not exist" });
      } else {
        res.status(200).send({ status: "exist", data: rows });
      }
    } else {
      res.status(500).send({ status: "error", error: "Failed to search user information" });
    }
  } else {
    res.status(500).send({ status: "error", error: "No input user information" });
  }
});


router.post("/create", async function (req, res) {
  const body = req.body;
  const inputInfo = common.reqToDatabaseFormat(body);
  const recommendCode = req.body.recommendCode ? req.body.recommendCode : null;
  console.log('inputinfo :>> ', inputInfo);
  const userInfo = {
    UserType: "회원",
    UserName: inputInfo.UserName,
    UserPhone: inputInfo.UserPhone,
    UserEmail: inputInfo.UserEmail,
    UserGender: inputInfo.UserGender,
    BirthDay: inputInfo.Birthday,
    MarketingAgreement: inputInfo.Marketing,
    Funnel: inputInfo.Funnel,
    TermsAndConditionsAgreement: inputInfo.TermsAndConditions,
    PrivacyPolicyAgreement: inputInfo.PrivacyPolicy,
    RecommendCode: Math.random().toString(36).substring(2, 12)
  }

  //유저 생성
  const { password, salt } = await common.createHashedPassword(inputInfo["UserPassword"]);
  userInfo["UserPassword"] = password
  userInfo["SaltKey"] = salt

  const { status: userCreateStatus, rows: UserCreateRows } = await crud.createDataRow('UserMst', userInfo)

  if (userCreateStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create user information" });
  }


  //마일리지 등록
  let recommendMiles = 0;
  if (recommendCode != null) {
    const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('UserNo', 'UserMst', { RecommendCode: recommendCode, StatusCode: "normal" })
    if (userStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to get user information" });
    }
    recommendMiles = userRows.length !== 0 ? 7000 : 0;
  }


  let amount = 3000 + recommendMiles;

  const milesEventInfo = {
    UserNo: UserCreateRows.insertId,
    StatusCode: "적립",
    Amount: amount,
    EventType: "회원가입"
  }
  const { status: MilesEventMst, rows: MilesEventMstRows } = await crud.createDataRow('MilesEventMst', milesEventInfo);
  if (MilesEventMst === -1) {
    res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
  }

  const result = await addMiles(MilesEventMstRows.insertId, amount, UserCreateRows.insertId)
  if (result.status === -1) {
    res.status(500).send({ status: "error", error: "Failed to create MilesDetailMst information" });
  }

  // const { status: deliveryAddressStatus, rows: deliveryAddressRows } = await crud.getDataListFromTable('', 'DeliveryAddress', { RoadAddress: inputInfo.Address })
  // if (deliveryAddressStatus === -1) {
  //   res.status(500).send({ status: "error", error: "Failed to create DeliveryAddress information" });
  // }

  // console.log('deliveryAddressRows :>> ', deliveryAddressRows);


  const addressInfo = {
    UserNo: UserCreateRows.insertId,
    AddressLabel: "기본 주소",
    RcvName: inputInfo.UserName,
    Address: inputInfo.Address,
    // ApartmentName: deliveryAddressRows[0].ApartmentName,
    ApartmentBuilding: inputInfo.ApartmentBuilding,
    ApartmentUnit: inputInfo.ApartmentUnit,
    ContactNo: inputInfo.UserPhone,
    EnterancePassword: inputInfo.EnterancePassword ? inputInfo.EnterancePassword : "",
  }

  //주소등록
  const { status: UserAddressStatus, rows: UserAddressRows } = await crud.createDataRow('UserAddress', addressInfo);
  if (UserAddressStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to create MilesEventMst information" });
  } else {
    res.status(200).send({ status: "success" });
  }

});


router.post("/setnewpassword", auth, async (req, res, next) => {
  const userNo = await userModel.getUserNo(req, res);
  console.log('userNo', userNo)
  const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('UserPassword,SaltKey', 'UserMst', { UserNo: userNo, StatusCode: "normal" })
  if (userStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to search user information" });
  }

  crypto.pbkdf2(req.body.currentPassword, userRows[0].SaltKey, 9999, 64, 'sha512', async (err, key) => {
    console.log('err,key', err, key)
    if (err) {
      console.log('err', err)
      res.status(500).send({ status: "fail", error: "Failed to salting password" });
    } else {
      if (key.toString('base64') === userRows[0].UserPassword) {
        const userInfo = {};
        const { password, salt } = await common.createHashedPassword(req.body.userPassword);
        console.log('password,salt :>> ', password, salt);
        userInfo["UserPassword"] = password
        userInfo["SaltKey"] = salt
        const { status } = await crud.updateData('UserMst', userInfo, { UserNo: userNo })
        if (status !== -1) {
          res.status(200).send({ status: "success" });
        } else {
          res.status(200).send({ status: "error", error: "Failed to update user password" });
        }

      } else {
        res.status(200).send({ status: "fail", error: "wrong password" });
      }
    }
  });



})


router.post("/setpassword", async function (req, res) {
  const userInfo = {};
  const { password, salt } = await common.createHashedPassword(req.body.userPassword);
  userInfo["UserPassword"] = password
  userInfo["SaltKey"] = salt
  const { status } = await crud.updateData('UserMst', userInfo, { UserEmail: req.body.userID })

  if (status !== -1) {
    res.status(200).send({ status: "success" });
  } else {
    res.status(200).send({ status: "error", error: "Failed to update user password" });
  }

});

router.post("/update", async (req, res) => {
  const userInfo = common.reqToDatabaseFormat(req.body);
  console.log('userInfo', userInfo)

  const { rows } = await crud.getDataListFromTable('', 'UserMst', { UserEmail: userInfo.UserEmail, StatusCode: "normal" })
  if (!rows || rows.length === 0) {
    res.status(200).send({ status: "not found", error: "User information is not found" });
  }

  if (userInfo.UserPassword) {
    if (userInfo.UserType == "회원") {
      crypto.pbkdf2(userInfo.NowPassword, rows[0].SaltKey, 9999, 64, 'sha512', async (err, key) => {
        if (err) {
          res.status(500).send({ status: "fail", error: "Failed to salting password" });
        } else {
          if (key.toString('base64') === rows[0].UserPassword) {
            const { password, salt } = await common.createHashedPassword(userInfo.UserPassword);
            console.log('password,salt', password, salt)
            userInfo["UserPassword"] = password
            userInfo["SaltKey"] = salt
            delete userInfo["NowPassword"]
            const { status } = await crud.updateData('UserMst', userInfo, { UserNo: userInfo.UserNo })
            if (status !== -1) {
              res.status(200).send({ status: "success" });
            } else {
              res.status(200).send({ status: "error", error: "Failed to update user info" });
            }
          } else {
            res.status(200).send({ status: "fail", error: "Wrong password" });
          }
        }
      });
    } else {
      const { password, salt } = await common.createHashedPassword(userInfo.UserPassword);
      console.log('password,salt', password, salt)
      userInfo["UserPassword"] = password
      userInfo["SaltKey"] = salt
      delete userInfo["NowPassword"]
      const { status } = await crud.updateData('UserMst', userInfo, { UserNo: userInfo.UserNo })
      if (status !== -1) {
        res.status(200).send({ status: "success" });
      } else {
        res.status(200).send({ status: "error", error: "Failed to update user info" });
      }
    }
  } else {
    const { status } = await crud.updateData('UserMst', userInfo, { UserNo: userInfo.UserNo })
    if (status !== -1) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(200).send({ status: "error", error: "Failed to update user info" });
    }

  }



})


router.post("/withdraw", async (req, res) => {

  /**
   * 1. 구독에 StatusCode가 normal 인게 있는지 확인
   * 2. 적립금 모두 만료 처리
   */

  const userNo = req.body.userNo;

  const { status: subscribeStatus, rows: subscribeRows } = await crud.getDataListFromTable('', 'SubsMst', { UserNo: userNo, StatusCode: "normal" })
  console.log('subscribeRows', subscribeRows)
  if (subscribeStatus === -1) {
    res.status(500).send({ status: "fail", error: "Failed to search user information" });
  }
  else if (subscribeRows.length !== 0) {
    res.status(200).send({ status: "exist" });
  } else {

    const { status: getMilesStatus, data: milesPrice } = await getMiles(req, res, userNo);
    if (getMilesStatus === -1) {
      res.status(500).send({ status: "fail", error: "Failed to get user miles at /user/withdraw" });
    }
    console.log('milesPrice', milesPrice)

    if (milesPrice !== 0) {
      const { milesEventNo, expiryDate } = await expireMiles(req, userNo, milesPrice);
      const expireMilesStatus = await handleMilesDetails(milesEventNo, milesPrice, userNo, 0, "만료");
      if (expireMilesStatus.status === -1) {
        res.status(500).send({ status: "fail", error: "Failed to expire user miles at /user/withdraw" });
      }
    }

    const { status } = await crud.updateData('UserMst', { StatusCode: "leave", LeaveDate: common.jsDateToMysqlDateTime(new Date()) }, { UserNo: userNo })
    if (status !== -1) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(500).send({ status: "error", error: "Failed to withdraw user at /user/withdraw" });
    }
  }

})


module.exports = router;

