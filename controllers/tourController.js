const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//* ================= Middleware functions =================

// Param middleware function which checks if id is correct
exports.checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'You need to specify name and price when creating a new tour!',
    });
  }

  next();
};

//* ================= Route Handlers =================

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  const updatedTour = { ...tour, ...req.body };
  const updatedTours = tours.map((t) => (t.id === +tour.id ? updatedTour : t));

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  const updatedTours = [...tours].filter((t) => t.id !== +tour.id);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        tours: null,
      });
    }
  );
};
