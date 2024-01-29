const express = require('express');
const majorController = require('../controllers/majorController');

const router = express.Router();

// Get all the majors' objects
router.route('/').get(majorController.getAllMajors);

// Get all the majors' names
router.route('/names').get(majorController.getAllMajorsNames);

// Get the specific major with name
router.route('/:name').get(majorController.getSpecificMajor);

module.exports = router;
