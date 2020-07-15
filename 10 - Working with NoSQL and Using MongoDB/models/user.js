const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;

    const cartProductIndex = this.cart.items.findIndex(
      p => p.productId.toString() === product._id.toString()
    );

    if (cartProductIndex >= 0) {
      const cartProduct = this.cart.items[cartProductIndex];
      newQuantity = cartProduct.quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          const cartItem = this.cart.items.find(
            i => i.productId.toString() === p._id.toString()
          );
          return { ...p, quantity: cartItem.quantity };
        });
      });
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = User;
