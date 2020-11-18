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
      before(function (done) {
        mongoose
          .connect('mongodb://localhost:27017/node-messages-test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then(result => {
            const user = new User({
              _id: '5fae398fbd417346a4abbd2c',
              email: 'test@test.com',
              password: 'tester',
              name: 'Test',
              posts: [],
            });
            return user.save();
          })
          .then(() => {
            done();
          });
      });

      after(function (done) {
        User.deleteMany({})
          .then(() => {
            return mongoose.disconnect();
          })
          .then(() => {
            done();
          });
      });

      beforeEach(function () {});

      afterEach(function () {});

      it('should send a response with a valid user status for an existing user', function (done) {
        const req = { userId: '5fae398fbd417346a4abbd2c' };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };

        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal('I am new!');
          done();
        });
      });
    });
  });
});
