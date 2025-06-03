/**
 * Wrapper function to catch async errors in controllers
 * This eliminates the need for try-catch blocks in each controller function
 * @param {Function} fn - The async controller function
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.error('Error:', err);
      res.status(500).json({
        status: 'error',
        message: err.message || 'Something went wrong'
      });
    });
  };
};

export default catchAsync;
