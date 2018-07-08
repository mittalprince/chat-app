const mongoose = require('mongoose');

const clubNames = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
});

module.exports = mongoose.model('Club', clubNames);