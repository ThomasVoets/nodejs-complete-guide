const expect = require('chai').expect;

const authMiddleware = require('../middleware/isAuth');

describe('Auth middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw();
  });

  it('should yield a userId after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer fdfsfgdsgsgsdfdsf';
      },
    };
    const res = {};
    const next = () => {};

    authMiddleware(req, res, next);
    expect(req).to.have.property('userId');
  });
});
