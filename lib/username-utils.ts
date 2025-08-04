/**
 * Username generation utilities for the CFO application
 */

/**
 * Generates a username in the format: name&date&time
 * @param name - The user's name (will be sanitized)
 * @returns A unique username string
 */
export function generateUsername(name: string): string {
  // Sanitize the name: remove spaces, special characters, convert to lowercase
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric characters
    .substring(0, 20); // Limit to 20 characters
  
  // Get current date and time
  const now = new Date();
  
  // Format date as YYYYMMDD
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Format time as HHMMSS
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  
  // Combine in the format: name&date&time
  return `${sanitizedName}&${date}&${time}`;
}

/**
 * Generates a username with additional uniqueness check
 * @param name - The user's name
 * @param existingUsernames - Array of existing usernames to avoid conflicts
 * @returns A unique username string
 */
export function generateUniqueUsername(name: string, existingUsernames: string[] = []): string {
  let username = generateUsername(name);
  let counter = 1;
  
  // If username already exists, add a counter
  while (existingUsernames.includes(username)) {
    const baseName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 18); // Leave space for counter
    
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
    
    username = `${baseName}${counter}&${date}&${time}`;
    counter++;
  }
  
  return username;
}

/**
 * Validates if a username follows the expected format
 * @param username - The username to validate
 * @returns True if username follows the name&date&time format
 */
export function isValidUsernameFormat(username: string): boolean {
  // Pattern: alphanumeric&YYYYMMDD&HHMMSS
  const pattern = /^[a-z0-9]+\d*&\d{8}&\d{6}$/;
  return pattern.test(username);
}

/**
 * Extracts components from a username
 * @param username - The username to parse
 * @returns Object with name, date, and time components
 */
export function parseUsername(username: string): { name: string; date: string; time: string } | null {
  if (!isValidUsernameFormat(username)) {
    return null;
  }
  
  const parts = username.split('&');
  if (parts.length !== 3) {
    return null;
  }
  
  return {
    name: parts[0],
    date: parts[1],
    time: parts[2]
  };
}
