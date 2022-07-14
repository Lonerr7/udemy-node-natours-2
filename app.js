const express = require('express');

const app = express();

// Routing
app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the server side!',
  });
});

app.post('/', (req, res) => {
  res.send('You can POST to this URL')
})

// Starting a server
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
