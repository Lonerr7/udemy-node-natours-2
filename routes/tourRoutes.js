const express = require('express');
const { protect } = require('../controllers/authController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
} = require('../controllers/tourController');

const router = express.Router();

// Before /:id, because Express now thinks "top-5-cheap" is the value of ":id" parameter if I place it below the "/:id" route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// Aggregation pipeline routes
router.route('/tour-stats').get(getTourStats);

router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
