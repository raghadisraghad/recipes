const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

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

mongoose.connect('mongodb://localhost:27017/Recipes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.use(authRoutes);
app.use(UserRoutes);
app.use(recipeRoutes);
app.use(restaurantsRoutes);
app.use(requestsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
