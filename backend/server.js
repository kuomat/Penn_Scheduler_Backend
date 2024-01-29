const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.log('Starting server.js');

// Configure environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Listen to the port
const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
