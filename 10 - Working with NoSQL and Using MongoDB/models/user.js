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
    // const cartProductIndex = this.cart.items.findIndex(
    //   p => p._id === product._id
    // );

    const db = getDb();
    const updatedCart = { items: [{ ...product, quantity: 1 }] };

    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = User;
