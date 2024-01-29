const User = require('./../models/userModel');
const requestsHandler = require('../utils/requestsHandler');
const HTTP_STATUS = require('../utils/httpStatus');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (body, ...cannotInclude) => {
  const newObj = {};
  Object.keys(body).forEach((el) => {
    if (!cannotInclude.includes(el)) newObj[el] = body[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, User.find(), next);
};

exports.getUser = async (req, res, next) => {
  const { username } = req.params;

  if (!username)
    return next(
      new AppError('Please enter a username', HTTP_STATUS.BAD_REQUEST)
    );

  const user = await User.findOne({ username: username }).populate({
    path: 'courses',
  }); // populate to get the course objects

  if (!user)
    return next(new AppError('User does not exist', HTTP_STATUS.NOT_FOUND));

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    return next(
      new AppError(
        'username, email, password, and passwordConfirm are required',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser)
    return next(new AppError('User already exists', HTTP_STATUS.CONFLICT));

  const newUser = await User.create(req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json({ message: 'User created successfully', user: newUser });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // Check if trying to update the password
  if (req.body.password)
    return next(
      new AppError('Cannot update password', HTTP_STATUS.BAD_REQUEST)
    );

  const { username, email } = req.body;
  if (!username && !email)
    return next(
      new AppError(
        'Has to provide one of username or email',
        HTTP_STATUS.BAD_REQUEST
      )
    );

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!existingUser)
    return next(new AppError('User does not exist', HTTP_STATUS.NOT_FOUND));

  // Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'username', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    existingUser.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    body: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const currentUser = await User.findOneAndDelete({
    $or: [{ username }, { email }],
  });

  if (!currentUser)
    return next(new AppError('User does not exist', HTTP_STATUS.NOT_FOUND));

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: {
      user: currentUser,
    },
  });
});
