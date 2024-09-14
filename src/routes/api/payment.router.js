const { Router } = require("express");
const {PaymentController} = require('../../controllers/payment.controller')

const paymentController = new PaymentController()

const paymentRouter = Router();

paymentRouter.post("/create-checkout-session", paymentController.createSession);

paymentRouter.get("/success", (req, res) => res.redirect("/success.html"));

paymentRouter.get("/cancel", (req, res) => res.redirect("/cancel.html"));

module.exports =  paymentRouter ;
