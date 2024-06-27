const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const url = "mongodb://mongo:27017/Recipes";

const authRoutes = require('./routes/auth');
const UserRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
const restaurantsRoutes = require('./routes/restaurant');
const requestsRoutes = require('./routes/request');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.use(authRoutes);
app.use(UserRoutes);
app.use(recipeRoutes);
app.use(restaurantsRoutes);
app.use(requestsRoutes);
app.get('/', (req, res) => {
  res.send('Hello To The Recipe App!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});