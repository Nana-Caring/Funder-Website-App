#!/usr/bin/env node
import axios from 'axios';

// Script: scripts/check-emma-accounts.js
// Usage (PowerShell):
//  $env:EMMA_EMAIL = 'emma@example.com'; $env:EMMA_PASSWORD = 'secret'; node .\scripts\check-emma-accounts.js
// Or: node .\scripts\check-emma-accounts.js emma@example.com secret

const AUTH_BASE = 'https://nanacaring-backend.onrender.com/api/auth';
const DEPENDENT_ACCOUNTS_URL = 'https://nanacaring-backend.onrender.com/api/dependent/my-accounts';

const email = process.env.EMMA_EMAIL || process.argv[2];
const password = process.env.EMMA_PASSWORD || process.argv[3];

if (!email || !password) {
  console.error('Missing credentials. Provide via EMMA_EMAIL and EMMA_PASSWORD env vars or pass email and password as args.');
  console.error('Example (PowerShell):');
  console.error("$env:EMMA_EMAIL='emma@example.com'; $env:EMMA_PASSWORD='secret'; node .\\scripts\\check-emma-accounts.js");
  process.exit(2);
}

(async () => {
  try {
    console.log('Logging in as', email);
    const loginRes = await axios.post(`${AUTH_BASE}/login`, { email, password });
    const { token, user } = loginRes.data || {};
    if (!token) {
      console.error('Login succeeded but no token was returned:', loginRes.data);
      process.exit(1);
    }

    console.log('Login successful. Fetching dependent accounts...');
    const accountsRes = await axios.get(DEPENDENT_ACCOUNTS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = accountsRes.data;

    // Normalize accounts into a flat array
    let accounts = [];
    if (Array.isArray(data)) {
      accounts = data;
    } else if (data && typeof data === 'object') {
      // Common shapes: { accounts: [...] } or { main: [...], sub: [...] }
      if (Array.isArray(data.accounts)) accounts = data.accounts;
      else {
        // collect array-valued properties
        for (const val of Object.values(data)) {
          if (Array.isArray(val)) accounts = accounts.concat(val);
        }
      }
    }

    // Fallback: if nothing found, print raw response
    if (!accounts || accounts.length === 0) {
      console.log('No accounts array detected in response. Raw response:');
      console.log(JSON.stringify(data, null, 2));
      process.exit(0);
    }

    // Deduplicate by common id fields
    const seen = new Set();
    const unique = [];
    for (const a of accounts) {
      const id = a.id || a._id || a.accountId || a.accountNumber || JSON.stringify(a);
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(a);
      }
    }

    console.log(`Found ${unique.length} account(s) for ${email}:`);
    unique.forEach((acct, i) => {
      const name = acct.accountName || acct.accountType || acct.type || acct.name || 'Unknown';
      const balance = acct.balance ?? acct.currentBalance ?? acct.amount ?? 'N/A';
      console.log(`${i + 1}. ${name} — balance: ${balance}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error during login or fetch:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  }
})();