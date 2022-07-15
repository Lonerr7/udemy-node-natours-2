// dotenv is used by Node.js to identify our config.env file
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

// We need to require app after we have configured our config.env by dotenv package
const app = require('./app');

// STARTING A SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
