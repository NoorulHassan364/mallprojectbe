const express = require("express");
const Router = express.Router();
const leveyController = require("../../controllers/leveyController");
const { multerUploadS3 } = require("../../utils/multer");

Router.post("/", multerUploadS3.any(), leveyController.addLevey);
Router.get("/:id", leveyController.getUserLevey);
Router.post(
  "/checkout-session/:leveyId/:userId",
  leveyController.getCheckOutSessionLevey
);

module.exports = Router;
