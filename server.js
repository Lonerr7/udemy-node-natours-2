const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv is used by Node.js to identify our config.env file
dotenv.config({
  path: './config.env',
});

// We need to require app after we have configured our config.env by dotenv package
const app = require('./app');

//* ===================== Configuring mongoose =====================

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL'));

//* ===================== Starting a server =====================
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
