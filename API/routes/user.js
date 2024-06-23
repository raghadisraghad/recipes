const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipes");
const Request = require("../models/request");

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/user/:id", async (req, res) => {
    try {
      const {id} = req.params
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.post("/user", async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(200).json({message : "Operation success "})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const {id}= req.params
    const update = req.body
    const user = await User.findByIdAndUpdate(id,update,{new:true});
    res.status(200).json({message: "User Updated successfuly"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const {id}= req.params
    const recipes = await Recipe.find({ 'userId.id': id });
    if (recipes.length > 0) {
      await Recipe.deleteMany({ 'userId.id': id });
    }
    const request = await Request.find({ 'Userid': id });
    if (request.length > 0) {
      await Request.deleteMany({ 'Userid': id });
    }
    const user = await User.findByIdAndDelete(id);
    if(!user){
      res.status(404).json({message:"User Doesn't Exist !!!"})
    }
    res.status(200).json({message: "User Deleted successfuly"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/user/rate/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const recipes = await Recipe.find({ 'userId.id': userId });
    const user = await User.findById(userId);
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
    const updatedUser = await User.findById(userId);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router
