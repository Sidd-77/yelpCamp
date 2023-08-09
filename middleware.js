const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas');

const isLoggedIn = (req,res,next)=>{
    //console.log('info : ',req.user);
    if(!req.isAuthenticated()){
        req.flash('error',"You must be logged in");
        return res.redirect('/users/login');
    }
    next();
}

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

const isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campg= await Campground.findById(id);
    if(!campg.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

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

const isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports = {isLoggedIn , isAuthor, validateReview, validateCampground, isReviewAuthor};



