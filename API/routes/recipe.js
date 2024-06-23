const express = require("express");
const router = express.Router();
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

router.post("/rate/:id", async (req, res) => {
  try {
    const {id} = req.params
    const recipe = await Recipe.findById(id);
    const userFavoritesCount = await User.countDocuments({ favorites: id });
    const restaurantFavoritesCount = await Restaurant.countDocuments({ favorites: id });
    const totalFavorites = restaurantFavoritesCount + userFavoritesCount;
    const totalUser = await User.countDocuments();
    const totalRes = await Restaurant.countDocuments();
    const total = totalUser+totalRes
    recipe.rate = parseFloat(((totalFavorites / total)*100).toFixed(2))
    await recipe.save();
    const updatedRecipe = await Recipe.findById(id);
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
