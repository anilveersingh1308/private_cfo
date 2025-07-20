export const countries = [
  { code: '+91', name: 'India', flag: '🇮🇳', pattern: /^\+91\s\d{5}\s\d{5}$/, placeholder: '+91 98765 43210', maxLength: 17 },
];

export const formatPhoneNumber = (value: string, countryCode: string): string => {
  // Remove all non-digits except + at the beginning
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // If it doesn't start with the country code, add it
  if (!cleaned.startsWith(countryCode.replace(/\D/g, ''))) {
    const digitsOnly = cleaned.replace(/^\+/, '');
    const fullNumber = countryCode + digitsOnly;
    return formatByCountry(fullNumber, countryCode);
  }
  
  return formatByCountry(cleaned, countryCode);
};

const formatByCountry = (number: string, countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return number;
  
  const digits = number.replace(/\D/g, '');
  const countryDigits = countryCode.replace(/\D/g, '');
  
  if (!digits.startsWith(countryDigits)) {
    return countryCode;
  }
  
  const localDigits = digits.substring(countryDigits.length);
  
  // India formatting: +91 XXXXX XXXXX
  if (localDigits.length >= 5) {
    return `+91 ${localDigits.substring(0, 5)} ${localDigits.substring(5, 10)}`;
  }
  return `+91 ${localDigits}`;
};

export const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return false;
  
  return country.pattern.test(phone);
};
