const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
connectDB();

// Start HTTP Server
const server = app.listen(PORT, HOST, () => {
  console.log(`[SpendWise-Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[SpendWise-Backend] Local:   http://localhost:${PORT}/api/v1/health`);
  console.log(`[SpendWise-Backend] Network: http://10.165.196.121:${PORT}/api/v1/health`);
  console.log(`[SpendWise-Backend] Mobile App API Base: http://10.165.196.121:${PORT}/api/v1`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[SpendWise-Backend] Unhandled Rejection: ${err.message}`);
  // In production, close server gracefully
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
