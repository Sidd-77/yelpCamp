const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Review = require('./review');

const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
});



module.exports = mongoose.model('Campground', campGroundSchema);

