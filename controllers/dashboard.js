const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Car = require("../models/Car");

exports.dashboardData = async (req, res) => {
  try {
    let cars = await Car.countDocuments({
      active: true,
      user_id: req.user._id,
    });
    let categories = await Category.countDocuments({ active: true });
    return res.status(200).json({
      msg: "dashboard data",
      data: { categoriesCount: categories, carsCount: cars },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};
