const express = require('express');
const fs = require('fs');

const app = express();

//* ===================== Middlewares =====================

// Out of the box express doesn't put body of POST request to req object. Using this middleware we put data into req object
app.use(express.json());

// Our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//* ===================== Routing =====================

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  const updatedTour = { ...tour, ...req.body };
  const updatedTours = tours.map((t) => (t.id === +tour.id ? updatedTour : t));

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const deleteTour = (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  const updatedTours = [...tours].filter((t) => t.id !== +tour.id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        tours: null,
      });
    }
  );
};

// Getting all tours or creating a new tour
app.route('/api/v1/tours').get(getAllTours).post(createTour);
// Getting a tour by id or updating a tour or deleting a tour
app.route('api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

//* ===================== Starting a server =====================

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
