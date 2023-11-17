
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
var auth = require("../middleware/auth.js");



router.get("/getcodelist" ,async (req, res) => {
    const requestInfo = common.reqToDatabaseFormat(req.query);
    console.log('requestInfo', requestInfo)
    if (requestInfo.length !== 0) {
        const { status, rows } = await crud.getDataListFromTable('', 'CodeMst', requestInfo,"CodeOrder")
        if (status !== -1) {
            res.status(200).send({ status: "exist", data: rows });
        } else {
            res.status(500).send({ status: "error", error: "Failed to search code information" });
        }
    } else {
        res.status(500).send({ status: "error", error: "No input request information" });
    }
})



module.exports = router