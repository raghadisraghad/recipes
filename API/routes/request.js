const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

router.get("/request", async (req, res) => {
  try {
    const requests = await Request.find();
    const results = await Promise.all(requests.map(async (request) => {
      const user = await User.findById(request.Userid);
      const restaurant = await Restaurant.findById(request.RestaurantId);
      return { request, user, restaurant };
    }));
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).send({ error: "Request doesn't exist !!!" });
    }
    const user = await User.findById(request.Userid);
    const restaurant = await Restaurant.findById(request.RestaurantId);
    res.status(200).json({ request, user, restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/requestRestaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await Request.find({ 'RestaurantId': id });
    const results = await Promise.all(requests.map(async (request) => {
      const user = await User.findById(request.Userid);
      return { request, user };
    }));
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/requestUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await Request.find({ 'Userid': id });
    const results = await Promise.all(requests.map(async (request) => {
      const restaurant = await Restaurant.findById(request.RestaurantId);
      return { request, restaurant };
    }));
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/request", async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(200).json({ message: "Request added successfully", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const request = await Request.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json({ message: "Request updated successfully", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found !!!" });
    }
    res.status(200).json({ message: "Request deleted successfully", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
