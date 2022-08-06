const { apiFeatures } = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDoc)
      return next(new AppError('No document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      tours: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return an updated document
      runValidators: true,
    });

    if (!updatedDoc)
      return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // it is a shorthand to writing Tour.findOne({_id: req.params.id})
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    doc.__v = undefined;

    res.status(200).json({
      message: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // Allowing nested GET endpoint (hack)
    let filterObj = {};
    if (req.params.tourId) filterObj = { tour: req.params.tourId };

    // BUILD QUERY
    // 1A) Filtering
    const { page, sort, limit, fields, ...queryObj } = req.query;

    // 1B) Advanced filtering. If we don't have those parametres it won't replace them.
    let query = apiFeatures.filter(queryObj, Model, filterObj);

    // 2) Sorting
    query = apiFeatures.sort(sort, query);

    // 3) Fields limiting
    query = apiFeatures.limitFields(fields, query);

    // 4) Pagination
    query = apiFeatures.paginate(page, limit, query);

    // EXECUTE QUERY
    const docs = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
