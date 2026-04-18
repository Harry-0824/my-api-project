const express = require("express");
const router = express.Router();
const homeSlideController = require("../controllers/homeSlideController");
const checkAuth = require("../middleware/check-auth");

router.get("/", homeSlideController.getAllSlides);
router.post("/", checkAuth, homeSlideController.createSlide);

module.exports = router;
