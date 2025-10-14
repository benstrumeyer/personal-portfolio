# FormEasy Setup Guide

This guide will help you set up FormEasy to handle your contact form submissions.

## Step 1: Create Google Apps Script

1. **Create a new Google Sheets file** (this is where your form data will be stored)
2. **Open Apps Script**: From the menu bar, click `Extensions > Apps Script`
3. **Add FormEasy Library**:
   - In the left sidebar, click the `+` button beside `Libraries`
   - Add this Script ID: `1CAyzGbXdwMlko81SbJAjRp7ewxhyGKhDipDK4v8ZvlpYqrMAAzbFNccL`
   - Click `Look up` and select the latest version
   - Note the identifier (you'll use this to invoke FormEasy functions)
   - Click `Add`

## Step 2: Configure the Apps Script

Replace the default function in your Apps Script file with this code:

```javascript
function doPost(req) {
  // Set your email to receive notifications (optional)
  FormEasy.setEmail('ben.strumeyer@gmail.com');
  
  // Set custom fields to match your form
  FormEasy.setFields('name', 'company', 'contact', 'message');
  
  // Set email subject (optional)
  FormEasy.setSubject('New Contact Form Submission');
  
  // Set form heading for email (optional)
  FormEasy.setFormHeading('New Contact Form Submission');
  
  // This is mandatory - must be at the end
  return FormEasy.action(req);
}
```

## Step 3: Deploy the Web App

1. **Click Deploy**: Click the `Deploy` button in the top right corner
2. **Select New deployment**: Choose `New deployment`
3. **Select Web app**: Click the gear icon and select `Web app`
4. **Configure deployment**:
   - Description: "Contact Form Handler" (optional)
   - Execute as: `Me (your email)`
   - Who has access: `Anyone`
5. **Deploy**: Click `Deploy` and authorize the script if prompted
6. **Copy the URL**: Copy the URL under `Web app` - this is your endpoint

## Step 4: Set Up Environment Variable

1. **Create .env file**: Copy `env.example` to `.env` in your project root
2. **Add your URL**: Replace `YOUR_DEPLOYMENT_ID` with your actual deployment ID from the URL
3. **Example**: `VITE_FORMEASY_URL=https://script.google.com/macros/s/AKfycbytxyr3CBwnPpV_mafH2QyKs42y0-bpm8SihCohpcu-lJfARn9qdc9LtILJ6xm2L7w/exec`
4. **Test the form**: Submit a test message to make sure it works

## Step 5: Custom Hook

The contact form now uses a custom hook (`useContactForm`) that:
- Handles form submission logic
- Provides loading state
- Manages error handling
- Uses environment variables for configuration

## Step 5: Optional - Add reCAPTCHA (Recommended)

To prevent spam, you can add Google reCAPTCHA:

### For reCAPTCHA V2:

1. **Get reCAPTCHA keys**: Go to https://www.google.com/recaptcha/admin/create
2. **Update Apps Script**:
   ```javascript
   function doPost(req) {
     FormEasy.setEmail('ben.strumeyer@gmail.com');
     FormEasy.setFields('name', 'company', 'contact', 'message');
     FormEasy.setRecaptcha('YOUR_SECRET_KEY'); // Add this line
     return FormEasy.action(req);
   }
   ```

3. **Add reCAPTCHA to your form**: Add this to your ContactModal.tsx:
   ```jsx
   // Add this div before the submit button
   <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
   ```

4. **Add reCAPTCHA script**: Add this to your `index.html`:
   ```html
   <script src="https://www.google.com/recaptcha/api.js" async defer></script>
   ```

## Form Data Structure

Your form will send this data structure:
```json
{
  "name": "John Doe",
  "company": "Acme Corp",
  "contact": "john@example.com",
  "message": "Hello, I'd like to discuss a project..."
}
```

## Testing

1. Submit a test form to verify it works
2. Check your Google Sheet to see the data
3. Check your email for notifications (if configured)

## Troubleshooting

- **CORS errors**: Make sure your deployment is set to "Anyone" access
- **Form not submitting**: Check the browser console for errors
- **No data in sheet**: Verify the field names match between your form and Apps Script
- **No email notifications**: Check your spam folder and verify the email address

## Security Notes

- FormEasy is safe to use - it doesn't interact with remote servers
- The "unsafe" warning from Google is normal for unverified scripts
- You can review the FormEasy source code using its Script ID

## Next Steps

Once set up, you'll receive all contact form submissions in your Google Sheet and optionally via email. You can customize the email notifications and add additional fields as needed.
