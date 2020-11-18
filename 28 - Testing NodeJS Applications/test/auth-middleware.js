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
});
