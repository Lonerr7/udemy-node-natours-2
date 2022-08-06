const express = require('express');
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getUser,
  getMe,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//* PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
// Its a middleware in a stack, which will run after or (if) one the four top middlewares were called. If not called, it will be the first middleware in a stack. All bottom functions will automatically be protected by this protect function.
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

//* RESTRICTING ACCESS TO ADMIN AFTER THIS MIDDLEWARE
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
