const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const sendgridMail = require('@sendgrid/mail');

const User = require('../models/user');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
              if (err) {
                console.log(err);
              }
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/Signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          'error',
          'Email exists already, please pick a different one!'
        );
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(result => {
          const message = {
            to: email,
            from: 'ThomasV.Development@gmail.com',
            subject: 'Signup succeeded',
            html: '<h1>You successfully signed up!</h1>',
          };

          sendgridMail.send(message);
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found!');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user
          .save()
          .then(result => {
            const message = {
              to: email,
              from: 'ThomasV.Development@gmail.com',
              subject: 'Password reset',
              html: `
              <p>You requested a password reset.</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            `,
            };

            sendgridMail.send(message);
            res.redirect('/');
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
