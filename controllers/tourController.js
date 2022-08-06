const Tour = require('../models/tourModel');
const { apiFeatures } = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//* ================= Middleware functions =================

//* ================= Route Handlers =================

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // BUILD QUERY
  // 1A) Filtering
  const { page, sort, limit, fields, ...queryObj } = req.query;

  // 1B) Advanced filtering. If we don't have those parametres it won't replace them.
  let query = apiFeatures.filter(queryObj);

  // 2) Sorting
  query = apiFeatures.sort(sort, query);

  // 3) Fields limiting
  query = apiFeatures.limitFields(fields, query);

  // 4) Pagination
  query = apiFeatures.paginate(page, limit, query);

  // EXECUTE QUERY
  const tours = await query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // it is a shorthand to writing Tour.findOne({_id: req.params.id})
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  tour.__v = undefined;

  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty', //  For ex: _id: '$difficulty' will print those stats for each difficulty
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // { We can repeat stages
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
