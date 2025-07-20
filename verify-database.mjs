// Script to verify data was stored in database
import { db } from './lib/db.js';
import { consultations } from './lib/schema.js';

const verifySubmission = async () => {
  try {
    console.log('Checking latest consultation submissions...');
    
    const results = await db.select().from(consultations).orderBy(consultations.created_at).limit(5);
    
    console.log(`Found ${results.length} consultation(s):`);
    
    results.forEach((consultation, index) => {
      console.log(`\n📋 Consultation ${index + 1}:`);
      console.log(`   ID: ${consultation.id}`);
      console.log(`   Name: ${consultation.name}`);
      console.log(`   Phone: ${consultation.phone}`);
      console.log(`   Country Code: ${consultation.country_code}`);
      console.log(`   Email: ${consultation.email}`);
      console.log(`   City: ${consultation.city}`);
      console.log(`   Occupation: ${consultation.occupation}`);
      console.log(`   Created: ${consultation.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Error querying database:', error.message);
  }
};

verifySubmission();
