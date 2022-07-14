const express = require('express');
const fs = require('fs');

const app = express();

//* ===================== Middlewares =====================

// Out of the box express doesn't put body of POST request to req object. Using this middleware we put data into req object
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//* ===================== Routing =====================

// Getting all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Getting a tour by its id
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// Adding a new tour
app.post('/api/v1/tours', (req, res) => {
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
});

// Updating a tour. PUT - the app recieves an entire updated object. PATCH - only some props are updated on an object
app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  const updatedTour = { ...tour, ...req.body };
  const updatedTours = tours.map((t) =>
    t.id === +tour.id ? updatedTour : t
  );

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
});

//* ===================== Starting a server =====================

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
