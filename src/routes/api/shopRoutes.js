const express = require("express");
const Router = express.Router();
const shopController = require("../../controllers/shopController");

Router.post('/checkout-session/:shopId/:userId', shopController.getCheckOutSession)
Router.get('/:id', shopController.getUserShops)

module.exports = Router;