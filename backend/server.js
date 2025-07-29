const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000', // React default port
    'http://localhost:3001', // Alternative React port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Accept'],
  credentials: true
};

// Enable CORS with options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Add headers manually as backup (in case cors middleware has issues)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Common HTTP error messages
const errorMessages = {
  400: 'Bad Request',
  401: 'Unauthorized', 
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

// Route to generate errors based on status code parameter
app.get('/error/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  
  console.log(`Received request for error code: ${statusCode}`);
  
  // Validate status code
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).json({
      error: 'Invalid status code',
      message: 'Status code must be a number between 400-599'
    });
  }
  
  // Get error message or use default
  const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  console.log(`Sending ${statusCode} response: ${message}`);
  
  // Send the error response
  res.status(statusCode).json({
    error: message,
    code: statusCode,
    timestamp: new Date().toISOString()
  });
});

// Route with query parameter alternative
app.get('/error', (req, res) => {
  const statusCode = parseInt(req.query.code);
  
  if (!req.query.code) {
    return res.status(400).json({
      error: 'Missing status code',
      message: 'Please provide a status code as query parameter: /error?code=404'
    });
  }
  
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).json({
      error: 'Invalid status code',
      message: 'Status code must be a number between 400-599'
    });
  }
  
  const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  res.status(statusCode).json({
    error: message,
    code: statusCode,
    timestamp: new Date().toISOString()
  });
});

// POST route for custom error messages
app.post('/error/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  const customMessage = req.body.message;
  
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).json({
      error: 'Invalid status code',
      message: 'Status code must be a number between 400-599'
    });
  }
  
  const message = customMessage || errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  res.status(statusCode).json({
    error: message,
    code: statusCode,
    timestamp: new Date().toISOString(),
    custom: !!customMessage
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Error generator server is running',
    timestamp: new Date().toISOString()
  });
});

// List available error codes
app.get('/codes', (req, res) => {
  res.status(200).json({
    message: 'Available error codes',
    codes: errorMessages
  });
});

// Root endpoint with usage instructions
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HTTP Error Generator Server',
    usage: {
      'GET /error/:code': 'Generate error with specific code (e.g., /error/404)',
      'GET /error?code=XXX': 'Generate error with query parameter',
      'POST /error/:code': 'Generate error with custom message in request body',
      'GET /health': 'Health check endpoint',
      'GET /codes': 'List all available error codes'
    },
    examples: [
      'GET /error/404',
      'GET /error?code=500',
      'POST /error/422 with body: {"message": "Custom validation error"}'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`HTTP Error Generator Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for usage instructions`);
  console.log('CORS enabled for frontend development');
});

module.exports = app;