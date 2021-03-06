const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();

const errorController = require('./controllers/error');

const db = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
