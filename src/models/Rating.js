const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    rating: Number
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;