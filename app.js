const express = require('express');
const doctorRouter = require('./routes/doctorRoutes');
const userRouter = require('./routes/userRoutes');
const SignUP_Login = require('./routes/Sign&Log Routes');

const cors = require('cors')
const dotenv = require("dotenv").config();

const app = express();

// 1) MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('https://healthhaven.onrender.com/api/doctors', doctorRouter);
app.use('https://healthhaven.onrender.com/api/users', userRouter);
app.use('https://healthhaven.onrender.com/api/', SignUP_Login);

module.exports = app;
