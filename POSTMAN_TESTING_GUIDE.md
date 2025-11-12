# Postman Testing Guide

## Setup Instructions

### 1. Import the Collection

1. Open Postman
2. Click "Import" button (top left)
3. Select the `postman_collection.json` file from this project
4. The collection "Email Webhook Automation API" will appear in your Collections sidebar

### 2. Server Status

✅ **Server is currently running on http://localhost:3000**

If you need to restart it:
```bash
npm start
```

## Test Execution

### Quick Test - Single Request

1. In Postman, expand the collection "Email Webhook Automation API"
2. Navigate to: **Success Cases → Send Email - Single Recipient**
3. **IMPORTANT:** Update the email addresses in the request body to real email addresses you control
4. Click "Send"
5. Expected Response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Running All Tests

You can run all tests in sequence using Postman's Collection Runner:

1. Right-click on "Email Webhook Automation API" collection
2. Select "Run collection"
3. Click "Run Email Webhook Automation API"
4. View results for all test cases

## Test Cases Included

### ✅ Success Cases (Expected: 200 OK)

1. **Send Email - Single Recipient**
   - Tests basic email sending functionality
   - Includes all fields including optional `from_name`

2. **Send Email - Multiple Recipients**
   - Tests sending to multiple recipients in one request
   - Uses array format for `to` field

3. **Send Email - Without Optional from_name**
   - Tests that `from_name` is truly optional
   - Should default to "noreply@example.com"

### ❌ Validation Error Cases (Expected: 400 Bad Request)

4. **Missing 'to' Field**
   - Expected error: "Missing required field: to"

5. **Missing 'subject' Field**
   - Expected error: "Missing required field: subject"

6. **Missing 'message' Field**
   - Expected error: "Missing required field: message"

7. **Invalid Email Format - Single**
   - Expected error: "Invalid email format: invalid-email-format"

8. **Invalid Email Format - In Array**
   - Expected error: "Invalid email format: invalid-email"

9. **Empty Recipients Array**
   - Expected error: "At least one recipient email address is required"

## Important Notes

### Before Testing Success Cases

⚠️ **Update Email Addresses**: Replace `recipient@example.com` with real email addresses you control to verify actual email delivery.

Example:
```json
{
  "to": "your-real-email@gmail.com",
  "subject": "Test Email",
  "message": "Testing the webhook",
  "from_name": "your-reply-email@gmail.com"
}
```

### Checking Results

1. **Success Cases**: Check your email inbox to verify emails were delivered
2. **Error Cases**: Verify the response status code and error message match expectations
3. **Server Logs**: Monitor the terminal where the server is running for detailed logs

### Environment Variables

Make sure your `.env` file has valid EmailJS credentials:
```env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

## Postman Tips

### Save Responses

After running a test, you can save the response as an example:
1. Click "Save Response" 
2. Select "Save as example"
3. This helps document expected responses

### Use Variables

For repeated testing, create environment variables:
1. Click the eye icon (top right)
2. Add variables like `base_url` = `http://localhost:3000`
3. Use `{{base_url}}` in your requests

### Test Scripts

You can add automated assertions to each request. Example:

```javascript
// In the "Tests" tab of a request
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});
```

## Troubleshooting

### Server Not Responding

- Check if server is running: Look for "Webhook server is listening on port 3000"
- Restart server: `npm start`
- Check port conflicts: Make sure port 3000 is not in use

### EmailJS Errors (500)

- Verify `.env` credentials are correct
- Check EmailJS dashboard for service status
- Ensure template variables match: `{{to_email}}`, `{{subject}}`, `{{message}}`, `{{email}}`

### Emails Not Received

- Check spam/junk folder
- Verify EmailJS template is published
- Check EmailJS dashboard for delivery logs
- Ensure email addresses are valid

## Next Steps

After testing with Postman, you can:
1. Integrate the API with your CRM system
2. Set up automated tests using Postman's CLI (Newman)
3. Deploy the server to production
4. Monitor email delivery rates and errors
