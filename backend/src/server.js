const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`[SpendWise-Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[SpendWise-Backend] Health Check available at: http://localhost:${PORT}/api/v1/health`);
  console.log(`[SpendWise-Backend] Transactions API: http://localhost:${PORT}/api/v1/transactions`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[SpendWise-Backend] Unhandled Rejection: ${err.message}`);
  // In production, close server gracefully
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
