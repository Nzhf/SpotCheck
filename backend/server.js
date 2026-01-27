/**
 * SpotCheck Backend Server
 * 
 * Entry point for the Node.js/Express application.
 * Enhanced with detailed error logging for debugging.
 */

// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

console.log('=== SERVER STARTUP ===');
console.log('1. Environment variables loaded');

// Catch any uncaught errors at the process level
// This prevents the server from crashing silently
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION:', error.message);
    console.error(error.stack);
});

// Catch unhandled promise rejections (e.g., failed API calls)
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION:', reason);
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

console.log(`2. Express app created, will use PORT: ${PORT}`);

// Middleware Configuration
// Enable CORS to allow requests from the frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

console.log('3. Middleware configured (CORS + JSON parser)');

// Root Route - provide a friendly landing page for the root URL
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 2rem; text-align: center;">
            <h1 style="color: #3B82F6;">SpotCheck API</h1>
            <p>The backend server is running successfully.</p>
            <p>Go to <a href="/api/health">/api/health</a> to check system status.</p>
        </div>
    `);
});

// Health Check Route - defined BEFORE other routes
// This ensures health check works even if other routes fail to load
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SpotCheck Backend is running' });
});

console.log('4. Health route defined at /api/health');

// Import Routes with error handling
// Wrapped in try-catch to catch any errors during route file loading
try {
    const searchRoutes = require('./routes/searchRoutes');
    app.use('/api', searchRoutes);
    console.log('5. Search routes loaded successfully');
} catch (error) {
    console.error('❌ FAILED TO LOAD ROUTES:', error.message);
    console.error(error.stack);
}

// Global Error Handler
// Catches any unhandled errors from route handlers
app.use((err, req, res, next) => {
    console.error('❌ REQUEST ERROR:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start the server with error handling for port conflicts
const server = app.listen(PORT, () => {
    console.log('');
    console.log('=== SERVER READY ===');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('Waiting for requests...');
});

// Handle port-in-use errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ PORT ${PORT} IS ALREADY IN USE!`);
        console.error('Another application is using this port.');
        console.error('Try changing PORT in your .env file to 3001 or 5001');
    } else {
        console.error('❌ SERVER ERROR:', error.message);
    }
});
