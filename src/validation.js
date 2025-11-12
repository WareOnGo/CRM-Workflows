/**
 * Validates email address format using a standard regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Normalizes recipient input to always return an array of email addresses
 * Handles both single string and array formats
 * @param {string|Array<string>} to - Single email or array of emails
 * @returns {Array<string>} - Array of email addresses
 */
function normalizeRecipients(to) {
  if (Array.isArray(to)) {
    return to.map(email => email.trim());
  }
  
  if (typeof to === 'string') {
    return [to.trim()];
  }
  
  return [];
}

/**
 * Validates the request body for required fields and email format
 * @param {Object} requestBody - The request body to validate
 * @returns {Object} - { valid: boolean, error: string|null, recipients: Array<string>|null }
 */
function validateEmailRequest(requestBody) {
  // Check for required fields
  if (!requestBody.to) {
    return {
      valid: false,
      error: 'Missing required field: to',
      recipients: null
    };
  }
  
  if (!requestBody.subject) {
    return {
      valid: false,
      error: 'Missing required field: subject',
      recipients: null
    };
  }
  
  if (!requestBody.message) {
    return {
      valid: false,
      error: 'Missing required field: message',
      recipients: null
    };
  }
  
  // Normalize recipients to array format
  const recipients = normalizeRecipients(requestBody.to);
  
  // Validate that at least one recipient is provided
  if (recipients.length === 0) {
    return {
      valid: false,
      error: 'At least one recipient email address is required',
      recipients: null
    };
  }
  
  // Validate email format for all recipients
  for (const email of recipients) {
    if (!isValidEmail(email)) {
      return {
        valid: false,
        error: `Invalid email format: ${email}`,
        recipients: null
      };
    }
  }
  
  return {
    valid: true,
    error: null,
    recipients: recipients
  };
}

module.exports = {
  isValidEmail,
  normalizeRecipients,
  validateEmailRequest
};
