const Tour = require('../models/tourModel');

exports.apiFeatures = {
  filter: (queryObj) => {
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    return Tour.find(JSON.parse(queryStr));
  },
  sort: (sort, query) => {
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      return query.sort(sortBy);
    }

    return query.sort('_id');
  },
  limitFields: (fields, query) => {
    if (fields) {
      const limitBy = fields.split(',').join(' ');
      return query.select(limitBy);
    }

    return query;
  },
  paginate: (page, limit, query) => {
    const numPage = +page || 1;
    const numLimit = +limit || 22;
    const skip = (numPage - 1) * numLimit;

    return query.skip(skip).limit(numLimit);
  },
};
