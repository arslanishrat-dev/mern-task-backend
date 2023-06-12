const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  add,
  categories,
  categoryById,
  update,
  deleteCategory,
} = require("../controllers/category");
const auth = require("../middlewares/auth");

router
  .route("/add")
  .post(
    check("title", "Please enter title for category").not().isEmpty(),
    auth,
    add
  );
router.route("/all").get(auth, categories);
router.route("/:id").get(auth, categoryById);
router
  .route("/:id")
  .put(
    check("title", "Please enter title for category").not().isEmpty(),
    auth,
    update
  );
router.route("/:id").delete(auth, deleteCategory);

module.exports = router;
