const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Error messages
const errorMessages = {
  400: 'You are not allowed to provide feedback for this application!',
  401: 'Authentication failed. Please log in again.',
  403: 'You do not have permission to access this resource.',
  404: 'The requested resource was not found.',
  422: 'Validation failed. Please check your input.',
  500: 'Internal server error. Please try again later.',
  503: 'Service temporarily unavailable.'
};

// Success messages
const successMessages = {
  200: 'Operation completed successfully',
  201: 'Resource created successfully',
  202: 'Request accepted for processing',
  204: 'No content - operation successful'
};

// Main route to generate responses based on status code
app.get('/error/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  
  // Handle success codes (200-299)
  if (statusCode >= 200 && statusCode <= 299) {
    const message = successMessages[statusCode] || `Success ${statusCode}`;
    console.log(`Sending ${statusCode} success response: ${message}`);
    
    return res.status(statusCode).json({
      success: true,
      message: message,
      code: statusCode,
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle error codes (400-599)
  if (statusCode >= 400 && statusCode <= 599) {
    const message = errorMessages[statusCode] || `HTTP Error ${statusCode}`;
    console.log(`Sending ${statusCode} error response: ${message}`);
    
    // Send as plain string to match real API behavior
    return res.status(statusCode).send(message);
  }
  
  // Invalid status code
  return res.status(400).send('Status code must be between 200-599');
});

// Simulate feedback API endpoint (for real-world testing)
app.post('/api/feedback/answer-form-update', (req, res) => {
  console.log('🔥 Feedback endpoint called with:', req.body);
  
  const { requestId } = req.body;
  
  if (!requestId) {
    return res.status(400).send('Request ID is required');
  }
  
  if (requestId === 1090) {
    return res.status(400).send('You are not allowed to provide feedback for this application!');
  }
  
  // Success case
  res.status(200).json({
    success: true,
    message: 'Feedback updated successfully',
    requestId: requestId
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint with usage instructions
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HTTP Test Server',
    usage: {
      'GET /error/:code': 'Generate response with status code (200-599)',
      'POST /api/feedback/answer-form-update': 'Test feedback endpoint',
      'GET /health': 'Health check'
    },
    examples: [
      'GET /error/200 → Success response',
      'GET /error/400 → Error response',
      'POST /api/feedback/answer-form-update with requestId: 1090 → 400 error'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for usage instructions`);
});

module.exports = app;