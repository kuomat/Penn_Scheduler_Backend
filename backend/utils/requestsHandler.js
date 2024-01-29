const HTTP_STATUS = require('./httpStatus');
const AppError = require('./appError');
const catchAsync = require('./catchAsync')

handleSuccessResponse = (res, data) => {
  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: {
      data,
    },
  });
};

handleErrorResponse = (res, err, statusCode) => {
  res.status(statusCode).json({
    status: 'fail',
    message: err,
  });
};

exports.makeGetRequest = catchAsync(async (res, promise, next) => {
    const data = await promise;
    if (!data) {
      return next(new AppError('No data found', HTTP_STATUS.NOT_FOUND));
    }
    handleSuccessResponse(res, data);
});

