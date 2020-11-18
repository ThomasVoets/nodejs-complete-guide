const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const AuthController = require('../controllers/auth');

const User = require('../models/user');

describe('Auth Controller', function () {
  describe('Login process', function () {
    it('should throw an error if accessing the database fails', function (done) {
      sinon.stub(User, 'findOne');
      User.findOne.throws();

      const req = {
        body: {
          email: 'test@test.com',
          password: 'tester',
        },
      };

      AuthController.login(req, {}, () => {}).then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
      });

      User.findOne.restore();
    });

    describe('User status', function () {
      it('should send a response with a valid user status for an existing user', function (done) {
        mongoose
          .connect('mongodb://localhost:27017/node-messages-test')
          .then(result => {
            const user = new User({
              email: 'test@test.com',
              passwordw: 'tester',
              name: 'Test',
              posts: [],
            });
            return user.save();
          })
          .then(() => {
            // Test Logic...
          })
          .catch(err => console.log(err));
      });
    });
  });
});
