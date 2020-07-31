const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { request } = require('express');

exports.getProducts = (req, res, next) => {
  const userId = req.user._id;

  Product.find({ userId: userId })
    .then(products => {
      res.render('admin/product-list', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products: products,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    validationErrors: [],
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    const message = errorMessages[0].msg;

    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      validationErrors: errorMessages,
      errorMessage: message,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }

  const product = new Product({
    _id: new mongoose.Types.ObjectId('5f22ab66a8169f4d68f4c631'),
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });

  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      res.redirect('/500');
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        validationErrors: [],
        errorMessage: null,
        product: product,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    const message = errorMessages[0].msg;

    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      validationErrors: errorMessages,
      errorMessage: message,
      product: {
        _id: productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
      },
    });
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== userId.toString()) {
        return res.redirect('/');
      }

      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;

      return product.save().then(result => {
        console.log('Updated Product');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const userId = req.user._id;
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: userId })
    .then(() => {
      console.log('Destroyed Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
