const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("./models/campground");

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



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/campgrounds/:id',async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground})
})

app.get('/campgrounds', async (req,res)=> {
    const camps = await Campground.find({});
    //console.log(camps)
    res.render('campgrounds/index',{camps:camps});
})


app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(3000,()=>{
    console.log("Server Port 3000");
})