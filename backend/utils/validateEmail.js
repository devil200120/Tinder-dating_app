// utils/validateEmail.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isDisposableEmail = (email) => {
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email'
  ];
  
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain);
};

export default {
  validateEmail,
  isDisposableEmail
};