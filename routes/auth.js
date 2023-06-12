const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { login, register } = require("../controllers/auth");

router
  .route("/register")
  .post(
    check("name", "Please provide name to register account").not().isEmpty(),
    check("email", "Please provide a valid email").not().isEmpty().isEmail(),
    register
  );
router
  .route("/login")
  .post(
    check("email", "Please enter a valid email").not().isEmpty(),
    check("password", "Please enter password").not().isEmpty(),
    login
  );

module.exports = router;
