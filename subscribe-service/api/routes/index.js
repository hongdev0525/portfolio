var express = require("express");
var router = express.Router();
var userRouter = require("./user.js");
var loginRouter = require("./login.js");
var authPhoneRouter = require("./authPhone.js")
var codeRouter = require("./code.js")
var addressRouter = require("./address.js")
var paymentRouter = require("./payment.js")
var orderRouter = require("./order.js")
var mainRouter = require("./main.js")
var subscribetRouter = require("./subscribe.js")
var milesRouter = require("./miles.js")
var signupRouter = require("./signup.js")
var auth = require("../middleware/auth.js")

var crud = require("../models/crud.js")

/* GET home page. */
router.get("/", async function (req, res) {
    res.render("index", { title: "Express", data: "Test" });
});



//Not need to auth
router.use("/login", loginRouter);
router.use("/user", userRouter);
router.use("/authphone", authPhoneRouter);
router.use("/code", codeRouter);
router.use("/main", mainRouter);
router.use("/signup",signupRouter);



//Need to auth
router.use("/address", auth, addressRouter);
router.use("/payment", auth, paymentRouter);
router.use("/subscribe", auth, subscribetRouter);
router.use("/order", auth, orderRouter);
router.use("/miles", auth, milesRouter);


module.exports = router;
