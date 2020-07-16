const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();

// const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add a 'Dummy User' to the request
app.use((req, res, next) => {
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    console.log('Connected to MongoDB via Mongoose');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
