
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
var userModel = require("../models/user.js")
var db = require("../db/db.js");
const { getMiles } = require("../models/miles.js");


router.get("/getmiles", async (req, res) => {
  const userNo = await userModel.getUserNo(req, res);
  const query = `SELECT 
                  SUM(Amount) as RemainMiles
                  FROM 
                    MilesDetailMst mdm
                  WHERE 
                    UserNo = ${userNo}
                  AND
                    StatusCode != "만료"
                  `;

  const { status, data } = await getMiles(req, res, userNo);
  console.log('data :>> ', data);
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get miles infomation at /miles/getmiles" });
  }

  res.status(200).send({ status: "exist", data: data });

})


router.post("/validatingcoupon", async (req, res) => {
  const couponInfo = common.reqToDatabaseFormat(req.body);
  const { status: couponStatus, rows: couponRows } = await crud.getDataListFromTable('', 'CouponMst', couponInfo)

  if (couponStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get valdating coupon at /miles/validatingcoupon" });
  } else if (couponRows.length === 0) {
    res.status(200).send({ status: "not exist" });
  } else {
    res.status(200).send({ status: "exist", data: couponRows[0] });
  }
})


module.exports = router