const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static getCart(callback) {
    fs.readFile(filePath, (err, fileContent) => {
      const cart = JSON.parse(fileContent);

      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }

  static addProduct(id, price) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +price;

      // Save the cart back to the file
      fs.writeFile(filePath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) return;

      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };

      const product = updatedCart.products.find(p => p.id === id);

      if (!product) return;

      const ProductQty = product.qty;

      updatedCart.products = updatedCart.products.filter(p => p.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * ProductQty;

      fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
};
