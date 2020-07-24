const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add a 'Dummy User' to the request
app.use((req, res, next) => {
  User.findById('5f10586c99f65259d42c98a7')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Thomas',
          email: 'thomas@test.com',
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(3000);
    console.log('Connected to MongoDB via Mongoose');
  })
  .catch(err => {
    console.log(err);
  });
