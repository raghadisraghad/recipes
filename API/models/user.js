const mongoose = require('mongoose');
const path = require('path');

const userSchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  picture: { type: String, required: false, default: path.join(__dirname, '../media/defaultUser.png') },
  diplomas: [{
    name: { type: String, required: false },
    content: { type: String, required: false },
    date: { type: Date, required: false }
  }],
  description: { type: String, required: false },
  rate: { type: Number, required: false, default: 0 },
  experiences: [{
    name: { type: String, required: false },
    content: { type: String, required: false },
    date: { type: Date, required: false }
  }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
  
});

module.exports = mongoose.model('User', userSchema);
