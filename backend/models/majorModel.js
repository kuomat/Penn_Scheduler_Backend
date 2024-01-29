const mongoose = require('mongoose');

const majorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have a name.'],
  },
  normal: {
    type: [String],
    required: [true, 'A major must have normal requirements'],
  },
  choices: {
    type: [String],
    required: [false],
  },
  cis_electives: {
    type: Number,
    required: [false],
  },
  math_electives: {
    type: Number,
    required: [false],
  },
  technical_electives: {
    type: Number,
    required: [false],
  },
  general_electives: {
    type: Number,
    required: [false],
  },
  free_electives: {
    type: Number,
    required: [false],
  },
  ssh: {
    type: Number,
    required: [false],
  },
  professional_electives: {
    type: Number,
    required: [false],
  },
  meam_upper_level: {
    type: Number,
    required: [false],
  },
  concentration: {
    type: Number,
    required: [false],
  },
});

const Major = mongoose.model('Majors', majorsSchema);
module.exports = Major;
