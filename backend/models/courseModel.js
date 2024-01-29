const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseTag: {
    // Ex: ACCT 1010
    type: String,
    required: [true, 'A course must have a tag'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'A course must have a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [false],
    trim: true,
  },
  difficulty: {
    type: Number,
    required: [true, 'A course must have a difficulty rating'],
    default: 0,
  },
  quality: {
    type: Number,
    required: [true, 'A course must have a quality rating'],
    default: 0,
  },
  workRequired: {
    type: Number,
    required: [true, 'A course must have a work required rating'],
    default: 0,
  },
  preRequisites: {
    // an array of course tags
    type: [String],
    required: [false],
  },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
