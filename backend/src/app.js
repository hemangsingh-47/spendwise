const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route Handlers
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static receipt uploads (Phase 10)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Root Welcome Route
 * GET /
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SpendWise Personal Expense Tracker REST API',
    version: '1.0.0',
    health: '/api/v1/health',
  });
});

/**
 * Health Check Endpoint
 * GET /api/v1/health
 * Returns production health status without leaking configuration or credentials
 */
app.get('/api/v1/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'SpendWise API is running smoothly',
    version: '1.0.0',
    database: dbState,
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource Routes
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
