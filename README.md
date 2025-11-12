# Email Webhook Automation

A Node.js webhook server that provides email automation capabilities for CRM systems. The server exposes a REST API endpoint that accepts email parameters and sends emails to one or multiple recipients using EmailJS.

## Features

- Simple REST API endpoint for sending emails
- Support for single or multiple recipients
- Integration with EmailJS for reliable email delivery
- Request validation and error handling
- Configurable via environment variables

## Prerequisites

- Node.js (v14 or higher)
- EmailJS account with configured service and template

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see Configuration section below)

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=3000

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

#### Required Variables:

- `PORT` - The port number the server will listen on (default: 3000)
- `EMAILJS_SERVICE_ID` - Your EmailJS service ID
- `EMAILJS_TEMPLATE_ID` - Your EmailJS template ID
- `EMAILJS_PUBLIC_KEY` - Your EmailJS public key
- `EMAILJS_PRIVATE_KEY` - Your EmailJS private key

You can copy `.env.example` to `.env` and fill in your EmailJS credentials:

```bash
cp .env.example .env
```

### EmailJS Template Setup

Your EmailJS template should include the following variables:

**Content Tab:**
- Subject: `{{subject}}`
- Content (Body): `{{message}}`

**Settings Tab:**
- To Email: `{{to_email}}`
- From Name: WareOnGo Notifications (or your preferred name)
- From Email: Use Default Email Address ✓
- Reply To: `{{email}}`

## Usage

### Starting the Server

```bash
npm start
```

The server will start and listen on the configured port (default: 3000).

### API Endpoint

**POST** `/api/send-email`

Send an email to one or multiple recipients.

#### Request Body

```json
{
  "to": "email@example.com",
  "subject": "Email Subject",
  "message": "Email body content",
  "from_name": "reply@example.com (optional)"
}
```

**Field Descriptions:**
- `to` (required): Single email address or array of email addresses
- `subject` (required): Email subject line
- `message` (required): Email body content
- `from_name` (optional): Reply-to email address. If not provided, defaults to "noreply@example.com"

For multiple recipients, use an array:

```json
{
  "to": ["email1@example.com", "email2@example.com"],
  "subject": "Email Subject",
  "message": "Email body content",
  "from_name": "reply@example.com (optional)"
}
```

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Error description"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

### Example cURL Commands

Send email to single recipient:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "message": "This is a test message",
    "from_name": "Test Sender"
  }'
```

Send email to multiple recipients:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient1@example.com", "recipient2@example.com"],
    "subject": "Test Email",
    "message": "This is a test message",
    "from_name": "Test Sender"
  }'
```

## Manual Testing

This section provides comprehensive testing instructions to verify the webhook server functionality.

### Prerequisites for Testing

1. Ensure the server is running:
```bash
npm start
```

2. Verify your `.env` file contains valid EmailJS credentials
3. Have a terminal ready to execute curl commands

### Test Case 1: Single Recipient Email

**Purpose:** Verify that the server can send an email to a single recipient

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Single Recipient Test",
    "message": "This is a test email sent to a single recipient.",
    "from_name": "Test Sender"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Status Code:** 200

**Requirements Tested:** 1.1, 2.1, 4.1

---

### Test Case 2: Multiple Recipients Email

**Purpose:** Verify that the server can send an email to multiple recipients in a single request

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient1@example.com", "recipient2@example.com", "recipient3@example.com"],
    "subject": "Multiple Recipients Test",
    "message": "This email is being sent to multiple recipients simultaneously.",
    "from_name": "Test Sender"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Status Code:** 200

**Requirements Tested:** 1.1, 2.2, 4.1

---

### Test Case 3: Missing 'to' Field

**Purpose:** Verify that the server returns a validation error when the recipient field is missing

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Subject",
    "message": "Test message without recipient"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required field: to"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 4: Missing 'subject' Field

**Purpose:** Verify that the server returns a validation error when the subject field is missing

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "message": "Test message without subject"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required field: subject"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 5: Missing 'message' Field

**Purpose:** Verify that the server returns a validation error when the message field is missing

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Subject"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required field: message"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 6: Invalid Email Format (Single)

**Purpose:** Verify that the server validates email address format and rejects invalid emails

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "invalid-email-format",
    "subject": "Test Subject",
    "message": "Test message with invalid email"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid email format: invalid-email-format"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 7: Invalid Email Format (Multiple Recipients)

**Purpose:** Verify that the server validates all email addresses when multiple recipients are provided

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["valid@example.com", "invalid-email", "another@example.com"],
    "subject": "Test Subject",
    "message": "Test message with one invalid email in array"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid email format: invalid-email"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 8: Empty Recipients Array

**Purpose:** Verify that the server rejects requests with an empty recipients array

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": [],
    "subject": "Test Subject",
    "message": "Test message with empty recipients"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "At least one recipient email address is required"
}
```

**Status Code:** 400

**Requirements Tested:** 4.2

---

### Test Case 9: Email Without Optional 'from_name'

**Purpose:** Verify that the server can send emails without the optional from_name field

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Without From Name",
    "message": "This email does not include a from_name field."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Status Code:** 200

**Requirements Tested:** 1.1, 4.1

---

### Test Case 10: EmailJS Service Error Simulation

**Purpose:** Verify that the server handles EmailJS service errors appropriately

**Note:** This test requires temporarily using invalid EmailJS credentials in your `.env` file

**Steps:**
1. Backup your current `.env` file
2. Modify `.env` to use invalid credentials (e.g., set `EMAILJS_SERVICE_ID=invalid_service`)
3. Restart the server
4. Run the command below
5. Restore your original `.env` file

**Command:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Service Error Test",
    "message": "This should trigger a service error."
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "EmailJS API error: [error message from EmailJS]"
}
```

**Status Code:** 500

**Requirements Tested:** 4.3

---

### Testing Checklist

Use this checklist to track your testing progress:

- [ ] Test Case 1: Single recipient email sends successfully
- [ ] Test Case 2: Multiple recipients email sends successfully
- [ ] Test Case 3: Missing 'to' field returns 400 error
- [ ] Test Case 4: Missing 'subject' field returns 400 error
- [ ] Test Case 5: Missing 'message' field returns 400 error
- [ ] Test Case 6: Invalid single email format returns 400 error
- [ ] Test Case 7: Invalid email in array returns 400 error
- [ ] Test Case 8: Empty recipients array returns 400 error
- [ ] Test Case 9: Email without from_name sends successfully
- [ ] Test Case 10: EmailJS service error returns 500 error

### Tips for Testing

1. **Use a tool like Postman or Insomnia** if you prefer a GUI over curl commands
2. **Check your email inbox** after successful tests to verify emails were actually delivered
3. **Monitor server logs** in the terminal where the server is running to see detailed error messages
4. **Test with real email addresses** you control to verify end-to-end functionality
5. **Use jq for pretty JSON output** by piping curl commands: `curl ... | jq`

Example with jq:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test",
    "message": "Test message"
  }' | jq
```

## License

ISC
