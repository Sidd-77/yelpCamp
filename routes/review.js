const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');

const Review = require('../models/review');
const Campground = require("../models/campground");
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/review');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;