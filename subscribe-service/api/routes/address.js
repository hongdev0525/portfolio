
var express = require("express");
var router = express.Router();
var crud = require("../models/crud.js")
var common = require("../public/javascripts/common.js")
const userModel = require("../models/user.js");
const { orderAddressUpdate } = require("../models/order.js");
const { getUserNo } = require("../models/user.js");



router.get("/info", async function (req, res) {
  const addressNo = req.query.addressNo;
  const { status, rows } = await crud.getDataListFromTable('', 'UserAddress', { AddressNo: addressNo })
  console.log('rows', rows)
  if (status !== -1) {
    res.status(200).send({ status: "exist", data: rows });
  } else {
    res.status(500).send({ status: "error", error: "Failed to get address information" });
  }
});


router.get("/infowithavailable", async function (req, res) {
  const userNo = await getUserNo(req, res);
  const { status: addressStatus, rows: addressRows } = await crud.getDataListFromTable('', 'UserAddress', { UserNo: userNo })
  if (addressStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get address information" });
  }

  if (addressRows.length != 0) {
    const { status: deliveryAddressStatus, rows: deliveryAddressRows } = await crud.getDataListFromTable('', 'DeliveryAddress', { RoadAddress: addressRows[0].Address })
    if (deliveryAddressStatus === -1) {
      res.status(500).send({ status: "error", error: "Failed to create DeliveryAddress information" });
    } else if (deliveryAddressRows.length === 0) {
      res.status(200).send({ status: "error", data: [] });
    } else {
      console.log('addressRows', addressRows)
      res.status(200).send({ status: "error", data: addressRows });
    }
  } else {
    res.status(200).send({ status: "error", data: [] });

  }

});


router.get("/infowithsubsno", async function (req, res) {
  const subsNo = req.query.subsNo;
  const { status: subsNoStatus, rows: subsNoRows } = await crud.getDataListFromTable('AddressNo', 'SubsMst', { SubsNo: subsNo })
  if (subsNoStatus === -1 || subsNoRows.length === 0) {
    res.status(500).send({ status: "error", error: "Failed to get subscribe   information at /withsubsno" });
  }

  const { status, rows } = await crud.getDataListFromTable('', 'UserAddress', { AddressNo: subsNoRows[0].AddressNo })
  if (status !== -1) {
    res.status(200).send({ status: "exist", data: rows });
  } else {
    res.status(500).send({ status: "error", error: "Failed to get address information" });
  }
});


router.get("/list", async function (req, res) {
  const userNo = await userModel.getUserNo(req, res);
  const { status, rows } = await crud.getDataListFromTable('', 'UserAddress', { UserNo: userNo })
  console.log('rows', rows)
  if (status !== -1) {
    res.status(200).send({ status: "exist", data: rows });
  } else {
    res.status(500).send({ status: "error", error: "Failed to get address information" });
  }

})

router.post("/add", async function (req, res) {
  const addressInfo = common.reqToDatabaseFormat(req.body.addressInfo);
  const userInfo = common.getUserInfoFromCookie(req.cookies._actk);
  const { status, rows: userRows } = await crud.getDataListFromTable('UserNo', 'UserMst', { UserEmail: userInfo.UserEmail, UserPhone: userInfo.UserPhone, StatusCode: "normal" })
  const { rows: deliveryAddressRows } = await crud.getDataListFromTable('ApartmentName', 'DeliveryAddress', { RoadAddress: addressInfo.Address })
  console.log('deliveryAddressRows', deliveryAddressRows)
  if (status === -1) {
    res.status(500).send({ status: "error", error: "Failed to get user information at /address/add" });
  } else {
    addressInfo['UserNo'] = userRows[0].UserNo
    addressInfo['ApartmentName'] = deliveryAddressRows[0]?.ApartmentName ? deliveryAddressRows[0].ApartmentName : ""
    addressInfo['IsBasic'] = 1
    if (addressInfo.length !== 0) {
      const { status, rows } = await crud.createDataRow('UserAddress', addressInfo)
      if (status !== -1) {
        res.status(200).send({ status: "success", data: rows.insertId, available: deliveryAddressRows.length == 0 ? false : true });
      } else {
        res.status(500).send({ status: "error", error: "Failed to add address information" });
      }
    } else {
      res.status(500).send({ status: "error", error: "No input address information" });
    }
  }
})


router.get("/available", async function (req, res) {
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

router.post("/updatesubscribeaddress", async function (req, res) {
  console.log('req.body.addressNo', req.body)
  const addressNo = req.body.addressNo;
  const subsNo = req.body.subsNo;

  const { status } = await crud.updateData('SubsMst', { AddressNo: addressNo }, { SubsNo: subsNo })
  if (status === -1) {
    res.status(200).send({ status: "error", error: "Failed to update subscribe addressNo at /updatesubscribeaddress" });
  }

  const { status: addressStatus, rows: addressRows } = await crud.getDataListFromTable('', 'UserAddress', { AddressNo: addressNo })
  if (addressStatus === -1) {
    res.status(500).send({ status: "error", error: "Failed to get address   information at /updatesubscribeaddress" });
  }
  const addressData = addressRows[0]
  const addressInfo = {
    Address: addressData.Address,
    ApartmentName: addressData.ApartmentName,
    ApartmentBuilding: addressData.ApartmentBuilding,
    ApartmentUnit: addressData.ApartmentUnit,
    RcvName: addressData.RcvName,
    ContactNo: addressData.ContactNo,
  }
  console.log('addressInfo', addressInfo)
  const { status: orderUpdateStatus, rows: orderUpdateRows } = await orderAddressUpdate(subsNo, addressInfo)
  if (orderUpdateStatus === -1) {
    res.status(200).send({ status: "error", error: "Failed to update order addressInfo at /updatesubscribeaddress" });
  }

  res.status(200).send({ status: "success" })
})

/**
 * 1. 구독이나 주문에 배송지 번호가 등록되어 있으면 삭제가 안되게 한다.
 */
router.post("/delete", async function (req, res) {

  console.log('req.body.addressNo', req.body)
  res.status(200).send({ status: "success" })
  // const {status, rows} = await crud.deleteData('UserAddress' , {AddressNo:  req.body.AddressNo})
})

module.exports = router