const express = require("express");
const Router = express.Router();
const shopController = require("../../controllers/shopController");

Router.post('/checkout-session/:shopId/:userId', shopController.getCheckOutSession)

module.exports = Router;