const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Review = require('../models/review');
const Campground = require("../models/campground");
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');





router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res,) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Successfully created review");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success',"Successfully deleted review");
    res.redirect(`/campgrounds/${req.params.id}`);
}))


module.exports = router;