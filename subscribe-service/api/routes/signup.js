var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")


router.post("/recommendcodecheck", async (req, res) => {
  const body = req.body
  console.log('body.', body)
  const { status: userStatus, rows: userRows } = await crud.getDataListFromTable('UserNo', 'UserMst', { RecommendCode: body.recommendCode })
  console.log('userRows :>> ', userRows);
  if (userStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to search user information" });
  } else if (userRows.length === 0) {
    res.status(200).send({ status: "not exist" });
  } else {
    res.status(200).send({ status: "exist" });
  }


})


module.exports = router;