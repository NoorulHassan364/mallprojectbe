const express = require("express");
const Router = express.Router();
const adminController = require("../../controllers/adminController");
const shopController = require("../../controllers/shopController");
const { multerUploadS3 } = require("../../utils/multer");

Router.post("/shop", multerUploadS3.any(), adminController.addShop);
Router.get("/shops", adminController.getShops);
Router.delete("/shop/:id", adminController.deleteShop);
Router.patch("/shop/:id", multerUploadS3.any(), adminController.updateShop);
Router.get("/shop/statistics", shopController.getShopStatistics);

Router.post(
  "/interestForm",
  multerUploadS3.any(),
  adminController.addInterestForm
);
Router.get("/interestForm", adminController.getInterestForm);

Router.post("/category", adminController.addCategory);
Router.get("/category", adminController.getCategories);
Router.delete("/category/:id", adminController.deleteCategory);
Router.patch("/category/:id", adminController.updateCategory);

Router.get("/users", adminController.getUsers);

module.exports = Router;
