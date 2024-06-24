const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');
const Recipe = require("../models/recipes");
const Restaurant = require('../models/restaurant');

router.post('/registerRestaurant', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const existingRestaurant = await Restaurant.findOne({ name: restaurant.name });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }
    restaurant.password = await bcrypt.hash(restaurant.password, 10);
    await restaurant.save();

    const recipeRate = await Recipe.find();
    for (let i = 0; i < recipeRate.length; i++) {
      try {
        await axios.post(`http://localhost:3000/rate/${recipeRate[i]._id}`);
      } catch (err) {
        console.error(`Error updating rate for recipe ${recipeRate[i]._id}:`, err.message);
      }
    }
    res.status(201).json({ message: "Registered Restaurant Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/registerUser', async (req, res) => {
  try {
    const user = new User(req.body);
    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const recipeRate = await Recipe.find();
    for (let i = 0; i < recipeRate.length; i++) {
      try {
        await axios.post(`http://localhost:3000/rate/${recipeRate[i]._id}`);
      } catch (err) {
        console.error(`Error updating rate for recipe ${recipeRate[i]._id}:`, err.message);
      }
    }
    res.status(201).json({ message: "Registered User Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/login', async (req, res) => {
  const login = req.body;
  try {
    let entity;
    entity = await User.findOne({ $or: [{ email: login.email }, { username: login.username }] });

    if (entity) {
      type = 'user';
      entityName = entity.username;
    } else {
      entity = await Restaurant.findOne({ $or: [{ email: login.email }, { name: login.name }] });
      if (entity) {
        type = 'restaurant';
        entityName = entity.name;
      }
    }
    if (!entity)
      return res.status(400).json({ message: "Nom d'utilisateur incorrect" });
    
    const isPasswordValid = await bcrypt.compare(login.password, entity.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    const recipeRate = await Recipe.find();
    for (let i = 0; i < recipeRate.length; i++) {
      try {
        await axios.post(`http://localhost:3000/rate/${recipeRate[i]._id}`);
      } catch (err) {
        console.error(`Error updating rate for recipe ${recipeRate[i]._id}:`, err.message);
      }
    }
    
    const lastActivity = Math.floor(Date.now() / 1000);
    const expiration = lastActivity + (7 * 24 * 60 * 60);
    
    const token = jwt.sign({ userId: entity._id, lastActivity }, 'votre_secret', { expiresIn: expiration });
    res.status(200).json({ token, userId: entity._id, userName: entityName, type });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: error.message});
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

// router.get('/search/:searchingItem', async (req, res) => {
//   const searchingItem = req.params.searchingItem;

//   try {
//     const [clubs, users, events] = await Promise.all([
//       Club.find({ $or: [{ name: searchingItem }, { abrv: searchingItem }] }),
//       User.find({ $or: [{ username: searchingItem }, { firstName: searchingItem }, { lastName: searchingItem }] }),
//       Club.find({ 'events.title': searchingItem })
//     ]);

//     const searchResults = {
//       clubs,
//       users,
//       events
//     };

//     res.status(200).json(searchResults);
//   } catch (error) {
//     res.status(500).json({ message: "Error searching database", error: error.message });
//   }
// });

module.exports = router;
