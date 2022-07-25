const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//* ===================== GLOBAL Middlewares =====================

// Setting security HTTP headers
app.use(helmet());

// Logging middleware (works only in development mode)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate limiting middleware
const limiter = rateLimit({
  max: 100,
  windiwMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Out of the box express doesn't put body of POST request to req object. Using this middleware we put data into req object
app.use(express.json({ limit: '20kb' }));

// Data sanitazation. It reads the data in req.body and cleans it against NoSQL and XSS
app.use(mongoSanitize()); // NoSQL attacks
app.use(xss()); // Against malicious code

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

// HANDLER FOR INVALID ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//* ===================== Error handling middleware =====================

app.use(globalErrorHandler);

//* ===================== Exporting a server =====================
// We start a server in server.js file
module.exports = app;
