const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const House = require('./house');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.House = House;

User.init(sequelize);
House.init(sequelize);

User.associate(db);
House.associate(db);

module.exports = db;
