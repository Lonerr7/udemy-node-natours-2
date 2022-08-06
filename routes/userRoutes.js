const express = require('express');
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateMe,
  deleteMe,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers);

router.route('/:id').delete(deleteUser);

module.exports = router;
