const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourController');

const router = express.Router();

// Before /:id, because Express now thinks "top-5-cheap" is the value of ":id" parameter if I place it below the "/:id" route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
