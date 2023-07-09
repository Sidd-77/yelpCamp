const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
});



module.exports = mongoose.model('Campground', campGroundSchema);

