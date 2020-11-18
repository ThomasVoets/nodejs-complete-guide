const expect = require('chai').expect;
const mongoose = require('mongoose');

const FeedController = require('../controllers/feed');

const User = require('../models/user');
const Post = require('../models/post');

describe('Feed Controller', function () {
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
  describe('Creating posts', function () {
    it('should at a created post to the posts of the creator', function (done) {
      const req = {
        body: {
          title: 'Test Post',
          content: 'A Test Post',
        },
        file: {
          path: 'abc',
        },
        userId: '5fae398fbd417346a4abbd2c',
      };
      const res = {
        status: function () {
          return this;
        },
        json: function () {},
      };

      FeedController.postPost(req, res, () => {}).then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
      });
    });
  });
});
