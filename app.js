const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const {campgroundSchema, reviewSchema} = require('./schemas');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');


mongoose.connect('mongodb://127.0.0.1:27017/yelp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("Database connected");
});


app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//Routes
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


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