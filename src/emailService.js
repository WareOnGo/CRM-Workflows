const emailjs = require('@emailjs/nodejs');

/**
 * Initializes EmailJS with credentials from environment variables
 * This should be called once at application startup
 */
function initializeEmailJS() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  // Validate that all required credentials are present
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error('Missing required EmailJS credentials in environment variables');
  }

  return {
    serviceId,
    templateId,
    publicKey,
    privateKey
  };
}

/**
 * Sends an email using EmailJS service
 * @param {string|Array<string>} recipients - Single email or array of email addresses
 * @param {string} subject - Email subject line
 * @param {string} message - Email body content
 * @param {string} fromName - Optional reply-to email address (defaults to 'noreply@example.com')
 * @returns {Promise<Object>} - Resolves with EmailJS response on success
 * @throws {Error} - Throws error if EmailJS API fails
 */
async function sendEmail(recipients, subject, message, fromName = '') {
  try {
    // Initialize EmailJS credentials
    const config = initializeEmailJS();

    // Normalize recipients to array format
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];

    // Handle single and multiple recipients
    // For multiple recipients, we'll send to each one
    // EmailJS typically handles this through the template
    const templateParams = {
      to_email: recipientArray.join(', '), // Join multiple emails with comma
      subject: subject,
      message: message,
      email: fromName || 'noreply@example.com' // Used as reply-to in template
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams,
      {
        publicKey: config.publicKey,
        privateKey: config.privateKey
      }
    );

    return response;
  } catch (error) {
    // Handle EmailJS API failures
    const errorMessage = error.text || error.message || 'Unknown EmailJS error';
    throw new Error(`EmailJS API error: ${errorMessage}`);
  }
}

module.exports = {
  sendEmail,
  initializeEmailJS
};
