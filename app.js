const express = require("express");
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const housesRouter = require("./routes/houses");
const path  = require("path");
const fs = require('fs');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');
const db = require('./models');

require('dotenv').config();

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/images')) {
    fs.mkdirSync('uploads/images');
}
if (!fs.existsSync('uploads/images/house')) {
    fs.mkdirSync('uploads/images/house');
}
if (!fs.existsSync('uploads/images/profile')) {
    fs.mkdirSync('uploads/images/profile');
}

const app = express();

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결됨")
    })
    .catch((err) => {
        console.error(err);
    });

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/houses', housesRouter);

module.exports = app;
