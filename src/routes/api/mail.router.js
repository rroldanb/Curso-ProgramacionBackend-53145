const { Router } = require("express");
const { authorization } = require("../../middlewares/auth.middleware");
const { MailController } = require("../../controllers/mail.controller");
const mailcontroller = new MailController ()
const mailRouter = Router();


mailRouter.get("/testemail", authorization(["admin"]), mailcontroller.sendTest);

mailRouter.post("/recoverpass",authorization(["public"]), mailcontroller.sendResetEmail);
mailRouter.post("/deleteproduct",authorization(["public"]), mailcontroller.sendDeleteProductEmail);
mailRouter.post("/purchasesuccess",authorization(["public"]), mailcontroller.sendPurchaseSuccessEmail);

module.exports = mailRouter;
