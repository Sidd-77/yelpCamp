const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const {campgroundSchema } = require('../schemas');
const isLoggedIn = require('../middleware');


const validateCampground = (req,res,next) => {
    const result = campgroundSchema.validate(req.body);
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(",");  
        console.error(msg);
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


router.post('/', isLoggedIn, validateCampground, catchAsync (async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success',"Successfully made a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/', async (req,res)=> {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

router.get('/new', isLoggedIn, (req,res)=>{
    res.render("campgrounds/new");
})

router.get('/:id',catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    //console.log(campground);
    if(!campground){
        console.log("in");
        req.flash('error',"Campground not found");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id', isLoggedIn, validateCampground,catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    const campground =await Campground.findByIdAndUpdate(id, {...req.body.campground},{new: true});
    req.flash('success',"Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync (async(req,res,next)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully deleted a campground");
    res.redirect(`/campgrounds`);
}))


module.exports = router;