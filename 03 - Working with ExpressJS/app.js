const express = require('express');
const bodyParser = require('body-parser');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(shopRoutes);
app.use(adminRoutes);

app.listen(3000);
