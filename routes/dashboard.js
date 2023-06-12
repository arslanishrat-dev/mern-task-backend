const express = require("express");
const router = express.Router();
const { dashboardData } = require("../controllers/dashboard");
const auth = require("../middlewares/auth");

router.route("/data").get(auth, dashboardData);

module.exports = router;
