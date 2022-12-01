const express = require("express");
const Router = express.Router();
const shopPaymentsController = require("../../controllers/shopPaymentsController");
const { multerUploadS3 } = require("../../utils/multer");

Router.get("/:id", shopPaymentsController.getUserShopPaymetns);
Router.post(
  "/checkout-session/:paymentId/:userId",
  shopPaymentsController.getCheckOutSessionShopPayment
);
// Router.post("/", multerUploadS3.any(), shopPaymentsController.addLevey);

module.exports = Router;
