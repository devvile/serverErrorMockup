const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Vite default port
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

// Real-world error messages to match your API
const errorMessages = {
  400: 'You are not allowed to provide feedback for this application!',
  401: 'Authentication failed. Please log in again.',
  403: 'You do not have permission to access this resource.',
  404: 'The requested resource was not found.',
  405: 'Method not allowed for this endpoint.',
  408: 'Request timeout. Please try again.',
  409: 'Conflict: Resource already exists.',
  410: 'This resource is no longer available.',
  422: 'Validation failed. Please check your input.',
  429: 'Too many requests. Please slow down.',
  500: 'Internal server error. Please try again later.',
  501: 'Feature not implemented yet.',
  502: 'Bad gateway. Upstream server error.',
  503: 'Service temporarily unavailable.',
  504: 'Gateway timeout. Please try again.'
};

// Route to generate errors based on status code parameter
app.get('/error/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
    if (statusCode >= 200 && statusCode <= 299) {
    const successMessages = {
      200: 'Operation completed successfully',
      201: 'Resource created successfully',
      202: 'Request accepted for processing',
      204: 'No content - operation successful',
    };
    
    const message = successMessages[statusCode] || `Success ${statusCode}`;
    
    console.log(`Sending ${statusCode} success response: ${message}`);
    
    return res.status(statusCode).json({
      success: true,
      message: message,
      code: statusCode,
      timestamp: new Date().toISOString()
    });
  }
  console.log(`Received request for error code: ${statusCode}`);
  
  // Validate status code
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).send('Status code must be a number between 400-599');
  }
  
  // Get error message or use default
  const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  console.log(`Sending ${statusCode} response: ${message}`);
  
  // 🔥 Send error message as plain string in response body (like your real API)
  res.status(statusCode).send(message);
});

// Alternative route that returns structured error (for different testing scenarios)
app.get('/error-structured/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).json({
      error: 'Invalid status code',
      message: 'Status code must be a number between 400-599'
    });
  }
  
  const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  // Returns structured error like your old format
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
    return res.status(400).send('Please provide a status code as query parameter: /error?code=404');
  }
  
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).send('Status code must be a number between 400-599');
  }
  
  const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  // 🔥 Send as plain string to match real API
  res.status(statusCode).send(message);
});

// POST route for custom error messages
app.post('/error/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  const customMessage = req.body.message;
  
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return res.status(400).send('Status code must be a number between 400-599');
  }
  
  const message = customMessage || errorMessages[statusCode] || `HTTP Error ${statusCode}`;
  
  // 🔥 Send custom message as plain string
  res.status(statusCode).send(message);
});

// Simulate specific API endpoints from your real application
app.post('/api/feedback/answer-form-update', (req, res) => {
  console.log('🔥 Simulating feedback form update endpoint');
  console.log('Request body:', req.body);
  
  // Simulate different scenarios based on request data
  const { requestId, serviceName } = req.body;
  
  if (!requestId) {
    return res.status(400).send('Request ID is required');
  }
  
  if (requestId === 1090) {
    // Simulate the exact error from your example
    return res.status(400).send('You are not allowed to provide feedback for this application!');
  }
  
  if (serviceName && serviceName.includes('Test')) {
    return res.status(403).send('Testing service is not available in production');
  }
  
  // Success case
  res.status(200).json({
    success: true,
    message: 'Feedback updated successfully',
    requestId: requestId
  });
});

// Simulate more API endpoints
app.get('/api/permissions', (req, res) => {
  // Simulate random authorization error
  if (Math.random() > 0.7) {
    return res.status(403).send('You do not have permission to view permissions');
  }
  
  res.status(200).json({
    permissions: ['read', 'write'],
    user: 'test-user'
  });
});

app.post('/api/requests', (req, res) => {
  // Simulate validation error
  if (!req.body.title) {
    return res.status(422).send('Request title is required');
  }
  
  if (!req.body.description) {
    return res.status(422).send('Request description cannot be empty');
  }
  
  res.status(201).json({
    id: Math.floor(Math.random() * 1000),
    title: req.body.title,
    status: 'created'
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
    message: 'Available error codes and messages',
    codes: errorMessages
  });
});

// Root endpoint with usage instructions
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HTTP Error Generator Server - Real API Style',
    endpoints: {
      'GET /error/:code': 'Generate error with specific code (returns plain text like real API)',
      'GET /error-structured/:code': 'Generate structured error (old format)',
      'GET /error?code=XXX': 'Generate error with query parameter',
      'POST /error/:code': 'Generate error with custom message in request body',
      'POST /api/feedback/answer-form-update': 'Simulate feedback API endpoint',
      'GET /api/permissions': 'Simulate permissions API endpoint',
      'POST /api/requests': 'Simulate request creation endpoint',
      'GET /health': 'Health check endpoint',
      'GET /codes': 'List all available error codes'
    },
    examples: [
      'GET /error/400 → "You are not allowed to provide feedback for this application!"',
      'GET /error/401 → "Authentication failed. Please log in again."',
      'POST /api/feedback/answer-form-update with requestId: 1090 → 400 error'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Real API Style Error Generator Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for usage instructions`);
  console.log('✅ CORS enabled for frontend development');
  console.log('✅ Returns plain text errors like real API');
});

module.exports = app;