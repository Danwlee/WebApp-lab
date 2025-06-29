// middleware/errorHandler.js

// Custom error class kế thừa Error
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Gọi constructor của Error
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Ghi log để debug
  console.error('Error:', err.stack);

  // Mã lỗi trả về (mặc định là 500)
  const statusCode = err.statusCode || 500;

  // Trả về JSON lỗi cho client
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Chỉ hiện stack nếu đang ở chế độ development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 Not Found handler (nếu route không khớp)
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error); // đẩy lỗi qua middleware errorHandler
};

// Xuất các handler
module.exports = {errorHandler,notFoundHandler,AppError};
