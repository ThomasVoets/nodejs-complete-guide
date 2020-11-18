const expect = require('chai').expect;
const sinon = require('sinon');

const AuthController = require('../controllers/auth');

const User = require('../models/user');

describe('Auth Controller', function () {
  describe('Login process', function () {
    it('should throw an error if accessing the database failsn', function () {
      sinon.stub(User, 'findOne');
      User.findOne.throws();

      expect(AuthController.login);

      User.findOne.restore();
    });
  });
});
