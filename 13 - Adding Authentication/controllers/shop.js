const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        products: products,
        csrfToken: req.csrfToken(),
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        products: products,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        product: product,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        isAuthenticated: req.session.isLoggedIn,
        products: products,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .removeFromCart(productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .populate('user.userId', 'name email')
    .exec()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        isAuthenticated: req.session.isLoggedIn,
        orders: orders,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });

      const order = new Order({
        user: { userId: req.session.user },
        products: products,
      });

      return order.save();
    })
    .then(result => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session.isLoggedIn,
  });
};
