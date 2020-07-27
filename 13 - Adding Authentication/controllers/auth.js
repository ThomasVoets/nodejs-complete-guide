const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5f10586c99f65259d42c98a7')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save();
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/Signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};
