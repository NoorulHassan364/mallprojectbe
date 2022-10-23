const express = require("express");
const Router = express.Router();
const contactUsController = require("../../controllers/contactUsController");

Router.post("/", contactUsController.addContact);

module.exports = Router;
