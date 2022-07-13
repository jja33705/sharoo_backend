const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const House = require('./house');
const Review = require('./review');
const Image = require('./image');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.House = House;
db.Review = Review;
db.Image = Image;

User.init(sequelize);
House.init(sequelize);
Review.init(sequelize);
Image.init(sequelize);

User.associate(db);
House.associate(db);
Review.associate(db);
Image.associate(db);

module.exports = db;
