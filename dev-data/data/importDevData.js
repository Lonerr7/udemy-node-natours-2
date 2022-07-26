const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv is used by Node.js to identify our config.env file
dotenv.config({
  path: './config.env',
});

const Tour = require('../../models/tourModel');

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

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('DATA SUCCESSFULLY UPLOADED');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DATA SUCCESSFULLY DELETED');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
