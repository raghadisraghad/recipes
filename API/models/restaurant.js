const mongoose = require('mongoose');
const path = require('path');

const restaurantSchema = new mongoose.Schema({
  
  name: {type: String,required: true,unique: true},
  password: {type: String,required: true},
  email: {type: String,required: true},
  phone: {type: Number,required: true},
  picture: {type: String,required: false,default: path.join(__dirname, '../media/defaultRestaurant.png')},
  description: {type: String,required: false},
  rate: {type: Number,required: false, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]

});

module.exports = mongoose.model('Restaurant', restaurantSchema);
