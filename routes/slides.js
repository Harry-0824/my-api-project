const express = require('express');
const router = express.Router();
const homeSlideController = require('../controllers/homeSlideController');

router.get('/', homeSlideController.getAllSlides);
router.post('/', homeSlideController.createSlide);

module.exports = router;
