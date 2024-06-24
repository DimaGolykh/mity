const Rating = require('../models/Rating'); // Assuming you have a model for Rating
const mongoose = require('mongoose');

const ratingsData = [
    { name: "Скамья", rating: 4517 },
    { name: "Качалка", rating: 2631 },
    { name: "Качели", rating: 2446 },
    { name: "Комплекс детский", rating: 2094 },
    { name: "Тренажер спортивный", rating: 1994 },
    { name: "Песочница", rating: 1580 },
    { name: "Игровая форма", rating: 1229 },
    { name: "Карусель", rating: 991 },
    { name: "Горка", rating: 487 },
    { name: "Ворота игровые", rating: 411 },
    { name: "Баскетбольная стойка", rating: 372 },
    { name: "Турник", rating: 174 },
    { name: "Шведская стенка", rating: 141 },
    { name: "Волейбольная стойка", rating: 65 },
    { name: "Баскетбольный щит", rating: 33 },
    { name: "Гимнастический комплекс", rating: 33 },
    { name: "Лабиринт", rating: 14 },
    { name: "Грибок", rating: 2 }
];

Rating.insertMany(ratingsData);

mongoose.connect('mongodb://localhost:27017/mity')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));