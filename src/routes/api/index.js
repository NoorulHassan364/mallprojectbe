const express = require("express");
const authRoutes = require("./authRoutes");
const contactUsRoutes = require("./contactUsRoutes");
const adminRoutes = require("./adminRoutes");
const shopRoutes = require("./shopRoutes");

let router = express.Router();

router.use("/auth", authRoutes);
router.use("/contactUs", contactUsRoutes);
router.use("/admin", adminRoutes);
router.use("/shop", shopRoutes);

module.exports = router;
