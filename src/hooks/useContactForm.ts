import { useState } from 'react';

interface ContactFormData {
  name: string;
  company: string;
  contact: string;
  message: string;
}

interface FormSubmissionResult {
  success: boolean;
  message?: string;
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (formData: ContactFormData): Promise<FormSubmissionResult> => {
    setIsSubmitting(true);
    
    try {
      // Get FormEasy URL from environment variable
      const formEasyUrl = import.meta.env.VITE_FORMEASY_URL;
      
      if (!formEasyUrl) {
        throw new Error('FormEasy URL not configured. Please set VITE_FORMEASY_URL in your environment variables.');
      }
      
      const response = await fetch(formEasyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: result.success || response.ok,
        message: result.message || 'Form submitted successfully'
      };
      
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting
  };
};
