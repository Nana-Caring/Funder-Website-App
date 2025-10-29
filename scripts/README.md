# Nana Caring Scripts

This folder contains utility scripts for testing and managing the Nana Caring application.

## Scripts

### 1. Check Emma Accounts (`check-emma-accounts.js`)

Logs in as Emma (or any dependent user) and displays their account information.

#### Usage Options

**Option A: Using Environment Variables (Recommended)**
```powershell
$env:EMMA_EMAIL = 'dependent@demo.com'
$env:EMMA_PASSWORD = 'Demo123!@#'
node .\scripts\check-emma-accounts.js
```

**Option B: Using Command Line Arguments**
```powershell
node .\scripts\check-emma-accounts.js dependent@demo.com Demo123!@#
```

#### Expected Output
```
Logging in as dependent@demo.com
Login successful. Fetching dependent accounts...
Found 7 accounts for dependent@demo.com:
1. Main — balance: 2117.87
2. Entertainment — balance: 75.60
3. Baby Care — balance: 75.60
4. Pregnancy — balance: 146.21
5. Education — balance: 327.38
6. Healthcare — balance: 477.98
7. Clothing — balance: 75.60
```

---

### 2. Add Dependents (`add-dependents.js`)

Logs in as a caregiver and registers three new dependents with different age groups (baby, teen, youth). The script automatically generates South African ID numbers based on age (with age limit of 20 years) and creates unique email addresses.

#### Dependent Profiles Created
- **Baby Johnson** (Age: 2, Female, Daughter)
- **Teen Smith** (Age: 15, Male, Son)  
- **Youth Williams** (Age: 19, Female, Daughter)

#### Usage Options

**Option A: Using Environment Variables (Recommended)**
```powershell
$env:CAREGIVER_EMAIL = 'caregiver@demo.com'
$env:CAREGIVER_PASSWORD = 'Demo123!@#'
node .\scripts\add-dependents.js
```

**Option B: Using Command Line Arguments**
```powershell
node .\scripts\add-dependents.js caregiver@demo.com Demo123!@#
```

#### Features
- **Age Validation**: Enforces 20-year age limit
- **ID Generation**: Generates valid 13-digit South African ID numbers using the Luhn algorithm
- **Unique Emails**: Creates unique email addresses like `baby.johnson.2@demo.dependent.com`
- **Progress Tracking**: Shows detailed progress for each registration
- **Error Handling**: Continues processing even if some registrations fail
- **Summary Report**: Provides a complete summary of successful and failed registrations

#### Expected Output
```
Logging in as caregiver: caregiver@demo.com
✅ Login successful as: caregiver@demo.com
User role: caregiver

🚀 Adding 3 dependents...

📝 1/3 - Registering Baby Johnson (Age: 2)...
   - Email: baby.johnson.2@demo.dependent.com
   - ID Number: 2208154578089
   - Relation: Daughter
   ✅ Success! Dependent ID: 15
   📊 Accounts created: 8

📝 2/3 - Registering Teen Smith (Age: 15)...
   - Email: teen.smith.15@demo.dependent.com
   - ID Number: 0903256789085
   - Relation: Son
   ✅ Success! Dependent ID: 16
   📊 Accounts created: 8

📝 3/3 - Registering Youth Williams (Age: 19)...
   - Email: youth.williams.19@demo.dependent.com
   - ID Number: 0512023456081
   - Relation: Daughter
   ✅ Success! Dependent ID: 17
   📊 Accounts created: 8

📊 REGISTRATION SUMMARY
==================================================
✅ Successful: 3/3
❌ Failed: 0/3

✅ Successfully registered:
  1. Baby Johnson (ID: 15)
     - Email: baby.johnson.2@demo.dependent.com
     - ID Number: 2208154578089
     - Accounts: 8
  2. Teen Smith (ID: 16)
     - Email: teen.smith.15@demo.dependent.com
     - ID Number: 0903256789085
     - Accounts: 8
  3. Youth Williams (ID: 17)
     - Email: youth.williams.19@demo.dependent.com
     - ID Number: 0512023456081
     - Accounts: 8

🎉 Registration process completed!
```

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed
2. **Dependencies**: The scripts use `axios` which should be available from the main project
3. **Network Access**: Scripts need access to `https://nanacaring-backend.onrender.com`

## Test Credentials

### Caregiver Account
- **Email**: `caregiver@demo.com`
- **Password**: `Demo123!@#`
- **Role**: `caregiver`

### Dependent Account (Emma)
- **Email**: `dependent@demo.com`
- **Password**: `Demo123!@#` 
- **Role**: `dependent`

## Common Issues & Solutions

### Authentication Errors
- Verify credentials are correct
- Check if the backend server is running
- Ensure the user has the correct role (caregiver for registration, dependent for account checking)

### Network Errors
- Check internet connection
- Verify the backend URL is accessible
- Try running the script again (temporary network issues)

### Registration Failures
- ID number conflicts (very rare due to random generation)
- Email already exists (rare due to age-based unique generation)
- Validation errors (check password strength, email format, etc.)

### PowerShell Environment Variables
If environment variables don't persist, set them in the same command:
```powershell
$env:CAREGIVER_EMAIL='caregiver@demo.com'; $env:CAREGIVER_PASSWORD='Demo123!@#'; node .\scripts\add-dependents.js
```

## Development Notes

- The ID number generation uses a simplified algorithm for demo purposes
- Email addresses are generated to avoid conflicts in the demo environment
- The scripts include proper error handling and detailed logging
- Age limit of 20 years is enforced as requested
- All generated data is suitable for testing and development only