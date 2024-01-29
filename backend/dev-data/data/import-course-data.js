const Course = require('../../models/courseModel');
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

// Read the course data
const courses = JSON.parse(
  fs.readFileSync('../data/all_course_data.json', 'utf8')
);

// Importing the data into DB
const importData = async () => {
  try {
    await Course.create(courses);
    console.log('Successfully loaded all courses.');
    process.exit();
  } catch (err) {
    console.log('Error importing data', err);
  }
};

// Deleting all the entries in the db
const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Successfully deleted all courses.');
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
