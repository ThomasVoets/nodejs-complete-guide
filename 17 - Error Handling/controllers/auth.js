const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const sendgridMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

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
    validationErrors: [],
    errorMessage: message,
    oldInput: { email: '', password: '' },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    const message = errorMessages[0].msg;

    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: false,
      validationErrors: errorMessages,
      errorMessage: message,
      oldInput: { email: email, password: password },
    });
  }

  User.findOne({ email: email })
    .then(user => {
      bcrypt.compare(password, user.password).then(doMatch => {
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
          res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            isAuthenticated: false,
            validationErrors: [{ param: 'email' }, { param: 'password' }],
            errorMessage: 'Invalid email or password',
            oldInput: { email: email, password: password },
          });
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    validationErrors: [],
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    const message = errorMessages[0].msg;

    return res.status(422).render('auth/Signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isAuthenticated: false,
      validationErrors: errorMessages,
      errorMessage: message,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }

  bcrypt
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
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: user.resetToken,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let user;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(userDoc => {
      user = userDoc;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;

      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
