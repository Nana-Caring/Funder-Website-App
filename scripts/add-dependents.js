#!/usr/bin/env node
import axios from 'axios';

// Script: scripts/add-dependents.js
// Usage (PowerShell):
//  $env:CAREGIVER_EMAIL = 'caregiver@demo.com'; $env:CAREGIVER_PASSWORD = 'Demo123!@#'; node .\scripts\add-dependents.js
// Or: node .\scripts\add-dependents.js caregiver@demo.com Demo123!@#

const AUTH_BASE = 'https://nanacaring-backend.onrender.com/api/auth';
const REGISTER_URL = 'https://nanacaring-backend.onrender.com/api/auth/register-dependent';

const email = process.env.CAREGIVER_EMAIL || process.argv[2];
const password = process.env.CAREGIVER_PASSWORD || process.argv[3];

if (!email || !password) {
  console.error('Missing caregiver credentials. Provide via CAREGIVER_EMAIL and CAREGIVER_PASSWORD env vars or pass email and password as args.');
  console.error('Example (PowerShell):');
  console.error("$env:CAREGIVER_EMAIL='caregiver@demo.com'; $env:CAREGIVER_PASSWORD='Demo123!@#'; node .\\scripts\\add-dependents.js");
  process.exit(2);
}

// Generate South African ID number from age (simplified for demo purposes)
function generateIdFromAge(age, gender = 'M') {
  if (age > 20) {
    throw new Error(`Age ${age} exceeds the limit of 20 years`);
  }
  
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  
  // Use last 2 digits of birth year
  const yearSuffix = birthYear.toString().slice(-2);
  
  // Generate a random month (01-12) and day (01-28 to avoid leap year issues)
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  // Generate random sequence number (0000-9999)
  const sequence = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  // Gender digit: 0-4 for female, 5-9 for male
  const genderDigit = gender.toUpperCase() === 'F' ? 
    Math.floor(Math.random() * 5) : 
    Math.floor(Math.random() * 5) + 5;
  
  // Citizenship digit: 0 for SA citizen
  const citizenship = '0';
  
  // Race digit (obsolete but still part of format): 8 is commonly used
  const race = '8';
  
  // Combine first 12 digits
  const firstTwelve = `${yearSuffix}${month}${day}${sequence}${genderDigit}${citizenship}${race}`;
  
  // Calculate Luhn check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(firstTwelve[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return `${firstTwelve}${checkDigit}`;
}

// Generate unique email from name and age
function generateEmail(firstName, surname, age) {
  const normalizedFirst = firstName.toLowerCase().replace(/\s+/g, '');
  const normalizedLast = surname.toLowerCase().replace(/\s+/g, '');
  return `${normalizedFirst}.${normalizedLast}.${age}@demo.dependent.com`;
}

// Create dependent data for different age groups
const dependentsToAdd = [
  {
    firstName: 'Baby',
    surname: 'Johnson',
    age: 2,
    gender: 'F',
    relation: 'Daughter',
    password: 'BabyPass123'
  },
  {
    firstName: 'Teen',
    surname: 'Smith',
    age: 15,
    gender: 'M',
    relation: 'Son',
    password: 'TeenPass123'
  },
  {
    firstName: 'Youth',
    surname: 'Williams',
    age: 19,
    gender: 'F',
    relation: 'Daughter',
    password: 'YouthPass123'
  }
];

(async () => {
  try {
    console.log('Logging in as caregiver:', email);
    const loginRes = await axios.post(`${AUTH_BASE}/login`, { email, password });
    const { token, user } = loginRes.data || {};
    
    if (!token) {
      console.error('Login failed or no token returned:', loginRes.data);
      process.exit(1);
    }
    
    console.log('✅ Login successful as:', user?.email || email);
    console.log('User role:', user?.role || 'unknown');
    
    if (user?.role !== 'caregiver') {
      console.warn('⚠️ User role is not "caregiver" - registration may fail');
    }
    
    console.log(`\\n🚀 Adding ${dependentsToAdd.length} dependents...\\n`);
    
    const results = [];
    
    for (let i = 0; i < dependentsToAdd.length; i++) {
      const dependent = dependentsToAdd[i];
      
      try {
        console.log(`📝 ${i + 1}/${dependentsToAdd.length} - Registering ${dependent.firstName} ${dependent.surname} (Age: ${dependent.age})...`);
        
        // Generate ID number based on age
        const idNumber = generateIdFromAge(dependent.age, dependent.gender);
        
        // Generate unique email
        const email = generateEmail(dependent.firstName, dependent.surname, dependent.age);
        
        const requestData = {
          firstName: dependent.firstName,
          surname: dependent.surname,
          email: email,
          password: dependent.password,
          Idnumber: idNumber,
          relation: dependent.relation
        };
        
        console.log(`   - Email: ${email}`);
        console.log(`   - ID Number: ${idNumber}`);
        console.log(`   - Relation: ${dependent.relation}`);
        
        const response = await axios.post(REGISTER_URL, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          console.log(`   ✅ Success! Dependent ID: ${response.data.dependent?.id || 'N/A'}`);
          console.log(`   📊 Accounts created: ${response.data.dependent?.accounts?.length || 0}`);
          results.push({
            success: true,
            dependent: response.data.dependent,
            requestData: { ...requestData, password: '[HIDDEN]' }
          });
        } else {
          console.log(`   ❌ Failed: ${response.data.message || 'Unknown error'}`);
          results.push({
            success: false,
            error: response.data.message || 'Registration failed',
            requestData: { ...requestData, password: '[HIDDEN]' }
          });
        }
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.response?.data?.message || error.message}`);
        if (error.response?.status) {
          console.log(`   📊 HTTP Status: ${error.response.status}`);
        }
        
        results.push({
          success: false,
          error: error.response?.data?.message || error.message,
          statusCode: error.response?.status,
          requestData: { 
            ...dependent, 
            password: '[HIDDEN]',
            idNumber: generateIdFromAge(dependent.age, dependent.gender),
            email: generateEmail(dependent.firstName, dependent.surname, dependent.age)
          }
        });
      }
      
      console.log(''); // Add spacing
      
      // Add a small delay to avoid overwhelming the server
      if (i < dependentsToAdd.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Summary
    console.log('\\n📊 REGISTRATION SUMMARY\\n' + '='.repeat(50));
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
      console.log('\\n✅ Successfully registered:');
      successful.forEach((result, index) => {
        const dep = result.dependent;
        console.log(`  ${index + 1}. ${dep.firstName} ${dep.surname} (ID: ${dep.id})`);
        console.log(`     - Email: ${dep.email}`);
        console.log(`     - ID Number: ${dep.idNumber || dep.Idnumber}`);
        console.log(`     - Accounts: ${dep.accounts?.length || 0}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\\n❌ Failed registrations:');
      failed.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.requestData.firstName} ${result.requestData.surname}`);
        console.log(`     - Error: ${result.error}`);
        if (result.statusCode) {
          console.log(`     - Status: ${result.statusCode}`);
        }
      });
    }
    
    console.log('\\n🎉 Registration process completed!');
    process.exit(failed.length > 0 ? 1 : 0);
    
  } catch (err) {
    console.error('\\n💥 Fatal error during caregiver login or setup:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  }
})();
