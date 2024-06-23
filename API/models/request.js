const mongoose = require('mongoose');
const path = require('path');

const requestSchema = new mongoose.Schema({

  Userid: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  RestaurantId: {type: mongoose.Schema.Types.ObjectId,ref: 'Restaurant',required: true},
  description: {type: String,required: true},
  interview: {
    Location: { type: String, required: false },
    content: { type: String, required: false },
    date: { type: Date, required: false }
  },
  position: {type: String,required: true},
  status: {type: Boolean,required: false,default: false}
  
});

module.exports = mongoose.model('Request', requestSchema);
