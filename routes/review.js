const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Review = require('../models/review');
const Campground = require("../models/campground");
const {reviewSchema} = require('../schemas');


const validateReview = (req,res,next) => {
    const result = reviewSchema.validate(req.body);
    if(result.error){
        console.log(result.error);
        const msg = result.error.details.map(el => el.message).join(',');
        console.error(msg);
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req,res,) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
}))


module.exports = router;