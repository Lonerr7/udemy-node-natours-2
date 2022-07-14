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

app.get('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((el) => +req.params.id === el.id);

  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
});

//* ===================== Starting a server =====================
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
