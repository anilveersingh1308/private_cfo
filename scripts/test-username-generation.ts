// Simple test for username generation
import { generateUsername, generateUniqueUsername } from '../lib/username-utils';

console.log('Testing username generation...\n');

// Test basic username generation
const name1 = 'John Smith';
const username1 = generateUsername(name1);
console.log(`Name: "${name1}" → Username: "${username1}"`);

const name2 = 'Dr. Sarah Johnson';
const username2 = generateUsername(name2);
console.log(`Name: "${name2}" → Username: "${username2}"`);

const name3 = 'System Administrator';
const username3 = generateUsername(name3);
console.log(`Name: "${name3}" → Username: "${username3}"`);

// Test unique username generation with existing usernames
console.log('\nTesting unique username generation...\n');

const existingUsernames = [
  'john&21072025&163928',
  'john&21072025&163929',
  'systemadministrator&21072025&163930'
];

const uniqueUsername1 = generateUniqueUsername('John', existingUsernames);
console.log(`Name: "John" with existing similar usernames → Username: "${uniqueUsername1}"`);

const uniqueUsername2 = generateUniqueUsername('System Administrator', existingUsernames);
console.log(`Name: "System Administrator" with existing similar usernames → Username: "${uniqueUsername2}"`);

console.log('\n✅ Username generation test completed!');
