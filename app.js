const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//* ===================== Middlewares =====================

// Logging middleware (works only in development mode)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Out of the box express doesn't put body of POST request to req object. Using this middleware we put data into req object
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* ===================== Routing =====================

// TOURS
app.use('/api/v1/tours', tourRouter);

// USERS
app.use('/api/v1/users', userRouter);

//* ===================== Exporting a server =====================
// We start a server in server.js file
module.exports = app;
