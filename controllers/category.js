const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const paginator = require("../utils/paginator");

exports.add = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    let checkCategory = await Category.findOne({
      title: req.body.title.toLowerCase(),
      active: true,
    });
    if (checkCategory)
      return res
        .status(409)
        .json({ msg: "category with this name already exists" });

    let category = await Category.create({
      title: req.body.title.toLowerCase(),
    });
    return res
      .status(201)
      .json({ msg: "category created successfully", data: category });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.categories = async (req, res) => {
  try {
    const total = await Category.countDocuments({ active: true });
    const pagination = paginator(req.query.page, req.query.limit, total);
    let categories = await Category.find({ active: true })
      .sort({ created_at: -1 })
      .skip(pagination.start_index)
      .limit(pagination.records_per_page);
    return res
      .status(200)
      .json({ msg: "all categories", pagination, data: categories });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.categoryById = async (req, res) => {
  try {
    let category = await Category.findOne({ _id: req.params.id, active: true });
    if (!category)
      return res
        .status(404)
        .json({ msg: "no category exists against id: " + req.params.id });
    return res
      .status(200)
      .json({ msg: "category against id: " + req.params.id, data: category });
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
      title: req.body.title,
      _id: { $nin: req.params.id },
      active: true,
    });
    if (checkCategory)
      return res
        .status(400)
        .json({ msg: "category with this name already exists" });

    let cat = await Category.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
      },
      { new: true }
    );
    if (!cat)
      return res
        .status(400)
        .json({ msg: "error occured while updating category" });
    return res
      .status(200)
      .json({ msg: "category updated successfully", data: cat });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ _id: req.params.id, active: true });
    if (!category)
      return res
        .status(404)
        .json({ msg: "no category exists against id " + req.params.id });
    let cat = await Category.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
      },
      { new: true }
    );
    if (!cat)
      return res
        .status(400)
        .json({ msg: "error occured while deleting category" });
    return res.status(200).json({ msg: "category deleted successfully" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};
