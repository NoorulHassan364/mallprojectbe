const express = require("express");
const Router = express.Router();
const adminController = require("../../controllers/adminController");
const { multerUploadS3 } = require("../../utils/multer");

Router.post("/shop", multerUploadS3.any(), adminController.addShop);
Router.get("/shops", adminController.getShops);
Router.delete("/shop/:id", adminController.deleteShop);
Router.patch("/shop/:id", multerUploadS3.any(), adminController.updateShop);

Router.post("/interestForm", multerUploadS3.any(), adminController.addInterestForm);
Router.get("/interestForm", adminController.getInterestForm);

module.exports = Router;
