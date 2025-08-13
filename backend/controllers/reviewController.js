import Review from '../models/Review.js';
import catchAsync from '../utils/catchAsync.js';

// Get all reviews
export const getReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

// Get a single review
export const getReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: review
  });
});

// Create a new review
export const createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: newReview
  });
});

// Update a review
export const updateReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: review
  });
});

// Delete a review
export const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found'
    });
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});