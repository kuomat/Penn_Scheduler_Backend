const Course = require('./../models/courseModel');
const requestsHandler = require('../utils/requestsHandler');

exports.getAllCourses = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, Course.find(), next);
};

exports.getAllDescriptions = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, Course.find({}, 'description'), next);
};

exports.getCourse = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, Course.findById(req.params.id), next);
};

exports.getCourseByTag = async (req, res, next) => {
  requestsHandler.makeGetRequest(
    res,
    Course.findOne({ courseTag: req.params.courseTag }),
    next
  );
};
