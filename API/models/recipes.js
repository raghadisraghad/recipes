const mongoose = require('mongoose');
const path = require('path');

const recipesSchema = new mongoose.Schema({
  
  userId: {
    id: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
    name: {type: String,required: true}
  },
  name: {type: String,required: true},
  ingredients: [{
    name: { type: String, required: true },
    gram: { type: String, required: true }
  }],
  description: {type: String,required: true},
  picture: {type: String,required: false,default: path.join(__dirname, '../media/defaultMeal.png')},
  rate: {type: Number,required: false,default: 0},
  created_at: {type: Date,default: Date.now}

});

module.exports = mongoose.model('Recipes', recipesSchema);
