const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
//const Joi = require("joi");
const {campgroundSchema, reviewSchema} = require('./schemas');
//teacher did {campgroundSchema} here but it breaks the app
const Review = require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

// new Campground({title: "A",price: "334"}).save()
// .then(()=>{
//     console.log("Success");
// }).catch((err)=>{
//     console.log(err);
// })
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


const validateCampground = (req,res,next) => {
    const result = campgroundSchema.validate(req.body);
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(",");  
        console.error(msg);
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
    //console.log(result);
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


app.post('/campgrounds', validateCampground, catchAsync (async (req,res,next)=>{
    //if(!req.body.campground) throw new ExpressError("Invalid Campgroud Data",400);

    
    const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))


app.get('/campgrounds', async (req,res)=> {
    const campgrounds = await Campground.find({});
    //console.log(camps)
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/new',(req,res)=>{
    res.render("campgrounds/new");
})

app.get('/campgrounds/:id',catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground})
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res,) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id', validateCampground,catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    const campground =await Campground.findByIdAndUpdate(id, {...req.body.campground},{new: true});
    //console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id',catchAsync (async(req,res,next)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error',{err});
    
})

app.listen(3000,()=>{
    console.log("Server Port 3000");
})