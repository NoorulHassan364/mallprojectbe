const express = require("express");
const authRoutes = require("./authRoutes");
const contactUsRoutes = require("./contactUsRoutes");

let router = express.Router();

router.use("/auth", authRoutes);
router.use("/contactUs", contactUsRoutes);

module.exports = router;
