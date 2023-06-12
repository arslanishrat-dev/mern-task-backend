const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config({ path: "./config/config.env" });

module.exports = async function (req, res, next) {
  // Get token from Header
  if (req.headers["authorization"] == undefined) {
    if (req.headers.authorization == undefined)
      return res.status(401).json({ msg: "unauthorized" });
  }
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  // Check if no Token
  if (!token) return res.status(401).json({ msg: "authorization denied" });

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");
    if (user) {
      req.user = user;
      req.user.id = user._id;
      next();
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
