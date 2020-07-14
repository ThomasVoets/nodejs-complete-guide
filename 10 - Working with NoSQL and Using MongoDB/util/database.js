const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize(
  'node-complete',
  'root',
  process.env.DB_PASSWORD,
  { dialect: 'mysql', host: 'localhost' }
);

module.exports = sequelize;
