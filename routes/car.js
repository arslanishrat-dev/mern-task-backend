const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { add, cars, carById, update, deleteCar } = require("../controllers/car");
const auth = require("../middlewares/auth");

router
  .route("/add")
  .post(
    check("catId", "Please enter add category of car").not().isEmpty(),
    check("color", "Please enter add color of car").not().isEmpty(),
    check("model", "Please enter add model of car").not().isEmpty(),
    check("make", "Please enter add make of car").not().isEmpty(),
    check("registration", "Please enter add registration number for car")
      .not()
      .isEmpty(),
    auth,
    add
  );
router.route("/all").get(auth, cars);
router.route("/:id").get(auth, carById);
router
  .route("/:id")
  .put(
    check("catId", "Please enter add category of car").not().isEmpty(),
    check("color", "Please enter add color of car").not().isEmpty(),
    check("model", "Please enter add model of car").not().isEmpty(),
    check("make", "Please enter add make of car").not().isEmpty(),
    check("registration", "Please enter add registration number for car")
      .not()
      .isEmpty(),
    auth,
    update
  );
router.route("/:id").delete(auth, deleteCar);

module.exports = router;
