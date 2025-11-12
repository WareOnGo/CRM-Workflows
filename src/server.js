require('dotenv').config();
const express = require('express');
const { validateEmailRequest } = require('./validation');
const { sendEmail } = require('./emailService');

const app = express();

// Configure Express middleware for JSON body parsing
app.use(express.json());

// Set up port configuration from environment variables with fallback to 3000
const PORT = process.env.PORT || 3000;

// Implement POST /api/send-email route
app.post('/api/send-email', async (req, res) => {
  try {
    // Add request validation using validation utilities
    const validation = validateEmailRequest(req.body);
    
    // Implement error handling for validation errors (400)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }
    
    // Call email service to send email with request data
    await sendEmail(
      validation.recipients,
      req.body.subject,
      req.body.message,
      req.body.from_name
    );
    
    // Return appropriate success response (200) with success message
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    // Implement error handling for service errors (500)
    // Return descriptive error messages in all error responses
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});
