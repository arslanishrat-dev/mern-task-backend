const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Car = require("../models/Car");
const paginator = require("../utils/paginator");

exports.add = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let checkCategory = await Category.findOne({
      _id: req.body.catId,
      active: true,
    });
    if (!checkCategory)
      return res
        .status(404)
        .json({ msg: "no category exist with against id: " + req.body.catId });

    let checkCar = await Car.findOne({
      registration: req.body.registration.toLowerCase(),
      active: true,
    });
    if (checkCar)
      return res
        .status(409)
        .json({ msg: "car with this registration number already exists" });

    let car = await Car.create({
      user_id: req.user._id,
      cat_id: req.body.catId,
      color: req.body.color,
      model: req.body.model,
      make: req.body.make,
      registration: req.body.registration,
    });
    await car.populate("user_id cat_id");
    return res.status(201).json({ msg: "car added successfully", data: car });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.cars = async (req, res) => {
  try {
    const total = await Car.countDocuments({ active: true });
    const pagination = paginator(req.query.page, req.query.limit, total);
    let cars = await Car.find({ active: true })
      .populate("user_id cat_id")
      .sort({ created_at: -1 })
      .skip(pagination.start_index)
      .limit(pagination.records_per_page);
    return res
      .status(200)
      .json({ msg: "list of all cars", pagination, data: cars });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.carById = async (req, res) => {
  try {
    let car = await Car.findOne({ _id: req.params.id, active: true }).populate(
      "user_id cat_id"
    );
    if (!car)
      return res
        .status(404)
        .json({ msg: "no car exists against id: " + req.params.id });
    return res
      .status(200)
      .json({ msg: "car against id: " + req.params.id, data: car });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let checkCategory = await Category.findOne({
      _id: req.body.catId,
      active: true,
    });
    if (!checkCategory)
      return res
        .status(404)
        .json({ msg: "no category exist with against id: " + req.body.catId });

    let checkCar = await Car.findOne({
      registration: req.body.registration.toLowerCase(),
      _id: { $nin: req.params.id },
      active: true,
    });
    if (checkCar)
      return res
        .status(400)
        .json({ msg: "car with this registration number already exists" });

    let car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        cat_id: req.body.catId,
        color: req.body.color,
        model: req.body.model,
        make: req.body.make,
        registration: req.body.registration,
      },
      { new: true }
    );
    if (!car)
      return res.status(400).json({ msg: "error occured while updating car" });
    await car.populate("user_id cat_id");
    return res.status(200).json({ msg: "car updated successfully", data: car });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    let checkCar = await Car.findOne({ _id: req.params.id, active: true });
    if (!checkCar)
      return res
        .status(404)
        .json({ msg: "no car exists against id " + req.params.id });
    let car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
      },
      { new: true }
    );
    if (!car)
      return res.status(400).json({ msg: "error occured while deleting car" });
    return res.status(200).json({ msg: "car deleted successfully" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};
