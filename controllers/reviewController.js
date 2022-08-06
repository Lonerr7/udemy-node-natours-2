const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//* ================= Route Handlers =================

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filterObj = {};
  // Allowing nested GET endpoint
  if (req.params.tourId) filterObj = { tour: req.params.tourId };

  const reviews = await Review.find(filterObj);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review );
