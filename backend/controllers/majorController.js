const Major = require('../models/majorModel');
const requestsHandler = require('../utils/requestsHandler');

exports.getAllMajors = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, Major.find(), next);
};

exports.getAllMajorsNames = async (req, res, next) => {
  requestsHandler.makeGetRequest(res, Major.find({}, 'name'), next);
};

exports.getSpecificMajor = async (req, res, next) => {
  requestsHandler.makeGetRequest(
    res,
    Major.findOne({ name: req.params.name }),
    next
  );
};
