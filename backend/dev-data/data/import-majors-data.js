const Major = require('../../models/majorModel');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// Connect to mongodb
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connected');
});

// Read the majors data
const majors = JSON.parse(
  fs.readFileSync('./../data/all_majors_data.json', 'utf8')
);

// Importing the data into DB
const importData = async () => {
  try {
    await Major.create(majors);
    console.log('Successfully loaded all majors.');
    process.exit();
  } catch (err) {
    console.log('Error importing data', err);
  }
};

// Deleting all the entries in the db
const deleteData = async () => {
  try {
    await Major.deleteMany();
    console.log('Successfully deleted all majors.');
    process.exit();
  } catch (err) {
    console.log('Error deleting data', err);
  }
};

// Command line execution
if (process.argv[2] === '--import') {
  importData();
} else {
  deleteData();
}
