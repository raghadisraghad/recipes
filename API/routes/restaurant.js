const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const Request = require("../models/request");
const Recipe = require("../models/recipes");

router.get("/restaurant", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).send({ error: "Restaurant doesn't exist !!!" });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/restaurant", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(200).json({ message: "Restaurant added Successfully", restaurant });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json({ message: "Restaurant Updated successfuly", restaurant });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipes = await Recipe.find({ 'userId.id': id });
    if (recipes.length > 0) {
      await Recipe.deleteMany({ 'userId.id': id });
    }
    const request = await Request.find({ 'RestaurantId': id });
    if (request.length > 0) {
      await Request.deleteMany({ 'RestaurantId': id });
    }
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if(!restaurant){
      return res.status(404).json({message:"Restaurant Not Found !!!"})
    }
    res.status(200).json({ message: "Restaurant Deleted successfuly",restaurant });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


router.post("/restaurant/rate/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const recipes = await Recipe.find({ 'userId.id': userId });
    const user = await Restaurant.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!recipes || recipes.length === 0) {
      return res.json({ message: 'No recipes found for the user', rate: 0 });
    }
    let totalRate = 0;
    recipes.forEach(recipe => {
      totalRate += recipe.rate;
    });
    const numRecipes = recipes.length;
    const rate = totalRate / numRecipes;
    user.rate = rate;
    await user.save();
    const updatedUser = await Restaurant.findById(userId);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
