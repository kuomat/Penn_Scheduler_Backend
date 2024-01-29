const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// get all the classes
router.route('/').get(courseController.getAllCourses);

// get all the descriptions
router.route('/descriptions').get(courseController.getAllDescriptions);

// get a specfic class obj based on id or courseTag
router.route('/:id').get(courseController.getCourse);
router.route('/courseTag/:courseTag').get(courseController.getCourseByTag);

module.exports = router;
