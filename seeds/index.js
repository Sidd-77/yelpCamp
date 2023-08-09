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
    for(let i=0;i<15;i++){
        const random20= Math.floor(Math.random()*citites.length);
        const price = Math.floor(Math.random()*300);
        const camp = new Campground({
            title: `${discriptors[Math.floor(Math.random()*discriptors.length)]} ${places[Math.floor(Math.random()*places.length)]}`,
            location: `${citites[random20].largestCity}, ${citites[random20].name}`,
            image: 'https://picsum.photos/600/300',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis recusandae non consequatur, fugiat itaque molestiae voluptatibus aspernatur omnis velit cumque similique corporis iusto rem modi, sapiente reprehenderit, deleniti placeat amet.',
            author: '64d212772fcb7af1a1fd68f7',
            price
        });
        await camp.save();
    }
    console.log("and donee!!");
}

DBseed();