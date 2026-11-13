const mongoose = require('mongoose');

/**
 * MongoDB Database Connection Manager
 * Connects to MongoDB using Mongoose with resilient connection pooling and error logging.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwise';

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes on startup (useful in development)
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[SpendWise-DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[SpendWise-DB] MongoDB Connection Error: ${error.message}`);
    // Do not crash server in development if MongoDB is offline; allow health check and mock testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
