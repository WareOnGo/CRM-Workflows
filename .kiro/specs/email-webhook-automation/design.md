# Design Document

## Overview

The Email Webhook Automation system is a lightweight Node.js server that provides a REST API endpoint for sending emails via EmailJS. The server accepts POST requests containing recipient email addresses and email content, then forwards these to EmailJS for delivery. This enables CRM systems and other applications to trigger automated email notifications through a simple webhook interface.

## Architecture

### Technology Stack
- **Runtime**: Node.js (v14 or higher)
- **Web Framework**: Express.js for HTTP server and routing
- **Email Service**: EmailJS SDK (@emailjs/nodejs)
- **Environment Management**: dotenv for configuration

### High-Level Architecture

```
CRM System → HTTP POST → Webhook Server → EmailJS API → Email Recipients
```

The system follows a simple request-response pattern:
1. Client sends POST request with email data
2. Server validates the request
3. Server calls EmailJS API
4. Server returns response to client

## Components and Interfaces

### 1. HTTP Server (Express.js)

**Responsibilities:**
- Listen for incoming HTTP requests
- Route requests to appropriate handlers
- Parse JSON request bodies
- Handle CORS if needed

**Configuration:**
- Port: Configurable via environment variable (default: 3000)
- Body parser: JSON middleware enabled

### 2. Email Webhook Endpoint

**Route:** `POST /api/send-email`

**Request Format:**
```json
{
  "to": "email@example.com" | ["email1@example.com", "email2@example.com"],
  "subject": "Email Subject",
  "message": "Email body content",
  "from_name": "Sender Name (optional)"
}
```

**Response Format (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response Format (Error):**
```json
{
  "success": false,
  "error": "Error description"
}
```

**Status Codes:**
- 200: Email sent successfully
- 400: Invalid request (missing parameters)
- 500: Server or EmailJS error

### 3. Email Service Module

**Responsibilities:**
- Initialize EmailJS with credentials
- Format email data for EmailJS API
- Handle single and multiple recipients
- Process EmailJS responses

**Interface:**
```javascript
async function sendEmail(recipients, subject, message, fromName)
```

**Parameters:**
- `recipients`: String or Array of email addresses
- `subject`: String - email subject line
- `message`: String - email body content
- `fromName`: String (optional) - sender display name

**Returns:**
- Promise that resolves on success or rejects with error

### 4. Validation Module

**Responsibilities:**
- Validate required fields are present
- Validate email address format
- Sanitize input data

**Functions:**
```javascript
function validateEmailRequest(requestBody)
function isValidEmail(email)
function normalizeRecipients(to)
```

## Data Models

### Email Request Model
```javascript
{
  to: String | Array<String>,      // Required: recipient email(s)
  subject: String,                  // Required: email subject
  message: String,                  // Required: email body
  from_name: String                 // Optional: sender name
}
```

### EmailJS Configuration Model
```javascript
{
  serviceId: String,     // EmailJS service ID
  templateId: String,    // EmailJS template ID
  publicKey: String,     // EmailJS public key
  privateKey: String     // EmailJS private key
}
```

## Error Handling

### Validation Errors (400)
- Missing `to` field
- Missing `subject` field
- Missing `message` field
- Invalid email format

### Server Errors (500)
- EmailJS authentication failure
- EmailJS API errors
- Network errors
- Server configuration errors

### Error Response Strategy
All errors return a consistent JSON structure with:
- `success: false`
- `error: <descriptive message>`
- Appropriate HTTP status code

## Configuration

### Environment Variables
```
PORT=3000
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

### EmailJS Template Setup
The EmailJS template should include variables for:
- `{{to_email}}` - recipient email
- `{{subject}}` - email subject
- `{{message}}` - email body content
- `{{from_name}}` - sender name (optional)

## Testing Strategy

### Manual Testing
- Test single recipient email
- Test multiple recipients email
- Test missing required fields
- Test invalid email formats
- Test EmailJS integration with real account

### Integration Points to Verify
- Express server starts and listens on correct port
- Request body parsing works correctly
- EmailJS SDK initializes with credentials
- Emails are delivered to recipients
- Error responses return correct status codes
