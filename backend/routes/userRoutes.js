const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(userController.getAllUsers).post(authController.signup);

router.route('/login').post(authController.login);

router.use(authController.protect); // everything below needs the user to be logged in 

router
  .route('/:username')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;
