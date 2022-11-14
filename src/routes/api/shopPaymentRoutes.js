const express = require("express");
const Router = express.Router();
const shopPaymentsController = require("../../controllers/shopPaymentsController");
const { multerUploadS3 } = require("../../utils/multer");

Router.get("/:id", shopPaymentsController.getUserShopPaymetns);
// Router.post("/", multerUploadS3.any(), shopPaymentsController.addLevey);
// Router.post(
//   "/checkout-session/:leveyId/:userId",
//   shopPaymentsController.getCheckOutSessionLevey
// );

module.exports = Router;
