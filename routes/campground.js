const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require("../models/campground");

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');





router.post('/', isLoggedIn, validateCampground, catchAsync (async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
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
    //populates authors of reviews
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campground);
    if(!campground){
        console.log("in");
        req.flash('error',"Campground not found");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground,catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    const campground =await Campground.findByIdAndUpdate(id, {...req.body.campground},{new: true});
    req.flash('success',"Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async(req,res,next)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully deleted a campground");
    res.redirect(`/campgrounds`);
}))


module.exports = router;