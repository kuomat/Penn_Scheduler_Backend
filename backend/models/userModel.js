const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Course = require('./courseModel');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must have a username.'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Must have an email.'],
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Must have a password.'],
    trim: true,
    minlength: 8,
    select: false,
  },
  updateTest: {
    type: String,
    required: [false],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Must confirm password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Connect to courses
userSchema.pre('save', async function (next) {
  const coursePromises = this.courses.map(
    async (id) => await Course.findById(id)
  );
  this.courses = (await Promise.all(coursePromises)).filter(
    (course) => course !== null
  );
  next();
});

// Checking if the two inputs have the same hashed passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('Users', userSchema);
module.exports = User;
