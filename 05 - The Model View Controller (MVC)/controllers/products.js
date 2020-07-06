const products = [];

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    pageTitle: 'Products',
    path: '/',
    products: products,
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
};
