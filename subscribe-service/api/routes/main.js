var express = require("express");
const db = require("../db/db.js");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
require("dotenv").config();


router.get("/holiday", async (req, res) => {

  const deliveryAvailableCheck = (locdate) => {
    /**
     * 조건
     * 1. 일수 차이가 이틀이상의 주문
     * 2. 오늘 시간이 16:00이전
     * 3. 일수만 따지면 안되고 월도 따져야한다. 
     */
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const selectedDate = new Date(locdate);
    const limitMonth = selectedDate.getMonth() + 1;
    const limitHours = today.getHours();
    const dayDiff = selectedDate.getDate() - today.getDate();
    if (limitMonth >= thisMonth) {
      if (dayDiff > 2) {
        return true;
      } else if (dayDiff === 2) {
        if (limitHours < 16) {
          return true
        } else {
          return false;

        }
      } else {
        return false;

      }
    } else {
      return false;
    }

  }

  const today = new Date();
  let dayOfWeek = today.getDay();
  let daysToAdd = dayOfWeek == 0 ? 3 : dayOfWeek <= 3 ? 2 : ((7 - dayOfWeek + 3) % 7);
  let deliveryDate = new Date(today.setDate(today.getDate() + daysToAdd));
  let locdate = common.jsDateToMysqlDateTime(deliveryDate).split(' ')[0];
  let len = 0;
  do {
    const { status: holidayStatus, rows: holidayRows } = await crud.getDataListFromTable('', 'HoliydayMst', { Locdate: common.jsDateToMysqlDateTime(locdate).split(' ')[0] })
    if (holidayStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to delete subs info at billingSubscribe()" });
    }
    if (holidayRows?.length !== 0) {
      len = holidayRows.length;
      locdate = new Date(deliveryDate.setDate(deliveryDate.getDate() + 1));
    } else {
      dayOfWeek = new Date(locdate).getDay();
      daysToAdd = dayOfWeek == 0 ? 1 : dayOfWeek == 6 ? 2 : 0;
      if (daysToAdd !== 0) {
        locdate = new Date(new Date(locdate).setDate(dayOfWeek + daysToAdd));
      } else {
        if (deliveryAvailableCheck(locdate) == false) {
          locdate = new Date(new Date(locdate).setDate(new Date(locdate).getDate() + 1));
        }
      }
      break;
    }
  } while (len > 0)

  res.status(200).send({ status: "success", data: common.jsDateToMysqlDateTime(locdate).split(' ')[0] })
});


router.get("/menulist", async (req, res) => {
  const week = req.query.week;
  const result = {};

  const query =
    `SELECT 
      b.BundleNo
      ,b.BundleType
      ,b.DeliveryDate 
      ,(SELECT
          GROUP_CONCAT(DpName) 
        FROM 
          BundleItem bi 
        LEFT JOIN
          ItemMst im ON(im.ItemNo = bi.ItemNo AND im.StatusCode="normal")
        LEFT JOIN
          BundleMst bm ON(bm.BundleNo=bi.BundleNo)
        WHERE 
          bi.BundleNo = b.BundleNo) as Product
    FROM 
      BundleMst b 
    LEFT JOIN
      CodeMst cm on(b.BundleType = cm.CodeLabel AND CodeType="ITEM_CATEGORY")
    WHERE 
      StatusCode = "normal"
      AND
      (WEEK(DeliveryDate) - WEEK(DATE_FORMAT(DeliveryDate,'%Y-%m-01')))+1 = ${week}
      AND
      MONTH(DeliveryDate) = MONTH(NOW())
    ORDER BY
      DeliveryDate asc , cm.CodeOrder asc
    `
    ;

  try {
    const [rows] = await db.query(query);
    result["bundles"] = rows;
  } catch (error) {
    res.status(500).send({ status: "error", error: "Failed to get menu list" });
  }

  const query2 = `
  SELECT 
    GROUP_CONCAT( DISTINCT  b.DeliveryDate ) as DeliveryDates
  FROM 
    BundleMst b 
  WHERE 
    StatusCode = "normal"
    AND
    (WEEK(DeliveryDate) - WEEK(DATE_FORMAT(DeliveryDate,'%Y-%m-01')))+1 = ${week}
    AND
    MONTH(DeliveryDate) = MONTH(NOW())
  ORDER BY
    DeliveryDate asc
	;
  `
  try {
    const [rows] = await db.query(query2);
    console.log('rows', rows);
    result["deliveryDates"] = rows[0].DeliveryDates != null ? rows[0].DeliveryDates.split(",") : [];
    res.status(200).send({ status: "success", data: result })
  } catch (error) {
    res.status(500).send({ status: "error", error: "Failed to get menu list at query2" });
  }

})
router.get("/menucalendar", async (req, res) => {
  const month = req.query.month;

  const query =
    `SELECT 
      b.BundleNo
      ,b.BundleType
      ,b.DeliveryDate 
      ,(SELECT
          GROUP_CONCAT(DpName) 
        FROM 
          BundleItem bi 
        LEFT JOIN
          ItemMst im ON(im.ItemNo = bi.ItemNo AND im.StatusCode="normal")
        LEFT JOIN
          BundleMst bm ON(bm.BundleNo=bi.BundleNo)
        WHERE 
          bi.BundleNo = b.BundleNo) as Product
    FROM 
      BundleMst b 
    LEFT JOIN
      CodeMst cm on(b.BundleType = cm.CodeLabel AND CodeType="ITEM_CATEGORY")
    WHERE 
      StatusCode = "normal"
      AND
      MONTH(DeliveryDate) = ${month}
    ORDER BY
      DeliveryDate asc , cm.CodeOrder asc
    `
    ;

  try {
    const [rows] = await db.query(query);
    res.status(200).send({ status: "success", data: rows })

  } catch (error) {
    res.status(500).send({ status: "error", error: "Failed to get menu calendar data" });
  }


})

router.get("/addressavailable", async function (req, res) {
  const addressInfo = common.reqToDatabaseFormat(req.query);
  if (addressInfo.length !== 0) {
    const { status, rows } = await crud.getDataListFromTable('', 'DeliveryAddress', addressInfo)
    if (rows.length !== 0) {
      res.status(200).send({ status: "exist", data: rows });
    } else {
      res.status(200).send({ status: "unavailable" });
    }
  } else {
    res.status(500).send({ status: "error", error: "No input address information" });
  }
})


module.exports = router