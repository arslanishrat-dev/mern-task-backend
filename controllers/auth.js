const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const SendMail = require("../utils/mail");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let checkUser = await User.findOne({ email: req.body.email });
    if (checkUser)
      return res
        .status(409)
        .json({ msg: "account with this email already exists" });

    var result = "";
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 12; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(result, salt);
    let user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });

    SendMail(
      req.body.email,
      "Registration Successful",
      `Thank you for registering on our platform. <p>Here is your password: ${result}</p>. You can login by using the above password to the portal.`
    );

    return res.status(201).json({
      msg: "user has been registerd successfully and password has been sent to the entered email",
      data: user,
    });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const email = req.body.email;
    const password = req.body.password;

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({
          msg: "The email or password is incorrect. Please try again",
        });
      const payload = {
        user: {
          id: user._id,
          name: user.name,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY },
        async (err, token) => {
          if (err) throw err;
          res.status(200).json({ token, msg: "user logged in" });
        }
      );
    } else {
      return res.status(400).json({
        msg: "This email is invalid. Please enter a valid account email",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
};
