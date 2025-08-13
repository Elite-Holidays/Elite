import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

export default router;