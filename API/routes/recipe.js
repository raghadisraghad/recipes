const express = require("express");
const router = express.Router();
const axios = require('axios');
const Recipe = require("../models/recipes");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

router.get("/recipe", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/recipe/:id", async (req, res) => {
    try {
      const {id} = req.params
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).send({ error: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.post("/recipe", async (req, res) => {
  try {
    const recipe = new Recipe(req.body)
    await recipe.save()
    res.status(200).json({message : "Operation success "})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/rate/user", async (req, res) => {
  try {
    const users = await User.find();

    // Retrieve all recipes at once to reduce the number of database queries
    const allRecipes = await Recipe.find();

    const userRates = users.map(user => {
      const userRecipes = allRecipes.filter(recipe => recipe.userId.id.toString() === user._id.toString());
      const totalRate = userRecipes.reduce((acc, recipe) => acc + recipe.rate, 0);
      user.rate = userRecipes.length > 0 ? totalRate / userRecipes.length : 0;
      return user.save();
    });

    // Wait for all user rate updates to complete
    await Promise.all(userRates);

    // Retrieve the updated users from the database
    const updatedUsers = await User.find();
    res.json(updatedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/rate/restaurant", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    // Retrieve all recipes at once to reduce the number of database queries
    const allRecipes = await Recipe.find();

    const restaurantRates = restaurants.map(restaurant => {
      const restaurantRecipes = allRecipes.filter(recipe => recipe.userId.id.toString() === restaurant._id.toString());
      const totalRate = restaurantRecipes.reduce((acc, recipe) => acc + recipe.rate, 0);
      restaurant.rate = restaurantRecipes.length > 0 ? totalRate / restaurantRecipes.length : 0;
      return restaurant.save();
    });

    // Wait for all restaurant rate updates to complete
    await Promise.all(restaurantRates);

    // Retrieve the updated restaurants from the database
    const updatedRestaurants = await Restaurant.find();
    res.json(updatedRestaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/rate/:idRecipe", async (req, res) => {
  try {
    const { idRecipe } = req.params;
    const recipe = await Recipe.findById(idRecipe);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const userFavoritesCount = await User.countDocuments({ favorites: idRecipe });
    const restaurantFavoritesCount = await Restaurant.countDocuments({ favorites: idRecipe });
    const totalFavorites = restaurantFavoritesCount + userFavoritesCount;
    const totalUser = await User.countDocuments();
    const totalRes = await Restaurant.countDocuments();
    const total = totalUser + totalRes;

    recipe.rate = parseFloat(((totalFavorites / total) * 100).toFixed(2));
    await recipe.save();

    // Update rates for all users and restaurants
    await axios.post('http://localhost:3000/rate/user');
    await axios.post('http://localhost:3000/rate/restaurant');

    const updatedRecipe = await Recipe.findById(idRecipe);
    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
  
router.get("/favorites/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let user = await User.findById(id);
    if (!user) {
      user = await Restaurant.findById(id);
      if (!user) {
        return user.status(404).json({ message: 'not found' });
      }
    }

    const favorites = await Recipe.find({ '_id': { $in: user.favorites } });

    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/favorites", async (req, res) => {
  try {
    const user = await User.find({}, 'favorites');
    const restaurant = await Restaurant.find({}, 'favorites');
    res.status(200).json({ user, restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;

    let user = await User.findById(userId);
    if (!user) {
      user = await Restaurant.findById(userId);
      if (!user) {
        return user.status(404).json({ message: ' not found' });
      }
    }

    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push(recipeId);
    await user.save();

    res.status(200).json({ message: 'Recipe added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;

    let user = await User.findById(userId);
    if (!user) {
      user = await Restaurant.findById(userId);
      if (!user) {
        return user.status(404).json({ message: ' not found' });
      }
    }

    user.favorites = user.favorites.filter(fav => fav.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: 'Recipe removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/recipe/:id", async (req, res) => {
  try {
    const {id}= req.params
    const update = req.body
    const recipe = await Recipe.findByIdAndUpdate(id,update,{new:true});
    res.status(200).json({message: "Recipe Updated successfuly"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/recipe/:id", async (req, res) => {
  try {
    const {id}= req.params
    const recipe = await Recipe.findByIdAndDelete(id);
    if(!recipe){
      res.status(404).json({message:"Recipe Doesn't Exist !!!"})
    }
    res.status(200).json({message: "Recipe Deleted successfuly"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router
