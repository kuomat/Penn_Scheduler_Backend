const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync');
const HTTP_STATUS = require('../utils/httpStatus');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const { promisify } = require('util');

// Configure environment variables
dotenv.config({ path: './config.env' });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    return next(
      new AppError(
        'username, email, password, and passwordConfirm are required',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser)
    return next(new AppError('User already exists', HTTP_STATUS.CONFLICT));

  const newUser = await User.create(req.body);

  createSendToken(newUser, HTTP_STATUS.CREATED, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('Request needs email and password', HTTP_STATUS.BAD_REQUEST)
    );
  }

  // Get the user and the password asscoiated with the user
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password!', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  createSendToken(user, HTTP_STATUS.SUCCESS, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get the JWT
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // Verify the JWT
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check is user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  // Grant access to the protected route
  req.user = currentUser;
  next();
});
