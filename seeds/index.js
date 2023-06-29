const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("../models/campground");
const citites = require("./cities");
const { discriptors,  places } = require("./seedHelper");

mongoose.connect('mongodb://127.0.0.1:27017/yelp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const DBseed = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random20= Math.floor(Math.random()*citites.length);
        const camp = new Campground({
            title: `${discriptors[Math.floor(Math.random()*discriptors.length)]} ${places[Math.floor(Math.random()*places.length)]}`,
            location: `${citites[random20].largestCity}, ${citites[random20].name}`,
        });
        await camp.save();
    }
    console.log("and donee!!");
}

DBseed();