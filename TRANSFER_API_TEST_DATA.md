# 💸 MONEY TRANSFER API - COMPLETE TESTING GUIDE

## 🎯 Overview
This guide covers testing the money transfer functionality that allows funders to send money to their beneficiaries using their added payment cards.

## 🔧 API Endpoints for Money Transfers

### 1. Transfer Operations
```
POST   /api/transfers/send-to-beneficiary    # Send money from card to beneficiary
GET    /api/transfers/beneficiaries          # Get linked beneficiaries
GET    /api/transfers/history               # View transfer history
GET    /api/transfers/info                  # Get transfer limits and fees
```

### 2. Supporting Endpoints (Already documented)
```
POST   /api/auth/login                      # Authentication
GET    /api/payment-cards/my-cards          # Get user's payment cards
POST   /api/payment-cards/add-test          # Add test payment cards
```

## 💰 Transfer Limits and Rules

### **Amount Limits:**
- **Minimum**: R10.00 per transfer
- **Maximum**: R5,000.00 per transfer
- **Daily Limit**: R20,000.00 per day
- **Currency**: South African Rand (ZAR)

### **Security Rules:**
- Must use authenticated JWT token
- Can only transfer to linked beneficiaries
- Card must be active and belong to the funder
- All transfers processed through Stripe

## 🧪 Postman Test Data for Transfers

### Step 1: Setup (Prerequisites)
Ensure you have completed the payment cards setup from the main guide:
1. ✅ Login to get JWT token
2. ✅ Add payment cards using test data
3. ✅ Have at least one active beneficiary

### Step 2: Get Beneficiaries List
**Request:** `GET {{BASE_URL}}/api/transfers/beneficiaries`

**Headers:**
```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**
```json
{
  "message": "Beneficiaries retrieved successfully",
  "beneficiaries": [
    {
      "id": 12,
      "firstName": "John",
      "middleName": "William",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "accountNumber": "1234567890",
      "accountType": "Main Account",
      "balance": 1000.00,
      "isActive": true,
      "linkedDate": "2025-01-15T08:30:00.000Z"
    },
    {
      "id": 13,
      "firstName": "Sarah",
      "middleName": null,
      "lastName": "Smith",
      "email": "sarah.smith@example.com",
      "accountNumber": "0987654321",
      "accountType": "Main Account",
      "balance": 500.00,
      "isActive": true,
      "linkedDate": "2025-02-01T14:20:00.000Z"
    }
  ],
  "totalBeneficiaries": 2
}
```

**Test Script (Save beneficiary ID):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.beneficiaries && response.beneficiaries.length > 0) {
        pm.environment.set("BENEFICIARY_ID", response.beneficiaries[0].id);
        console.log("Beneficiary ID saved:", response.beneficiaries[0].id);
    }
}
```

### Step 3: Get Transfer Information
**Request:** `GET {{BASE_URL}}/api/transfers/info`

**Headers:**
```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**
```json
{
  "message": "Transfer information retrieved successfully",
  "limits": {
    "minimum": 10.00,
    "maximum": 5000.00,
    "dailyLimit": 20000.00,
    "currency": "ZAR"
  },
  "fees": {
    "transferFee": 0.00,
    "stripeProcessingFee": "2.9% + R2.00",
    "description": "Standard Stripe processing fees apply",
    "currency": "ZAR"
  },
  "processingTime": {
    "standard": "Instant",
    "description": "Transfers are processed immediately upon successful card payment"
  },
  "supportedCards": [
    "Visa",
    "Mastercard",
    "American Express"
  ]
}
```

### Step 4: Send Money Tests

#### Test 4A: Small Amount Transfer (R50)
**Request:** `POST {{BASE_URL}}/api/transfers/send-to-beneficiary`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{AUTH_TOKEN}}
```

**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 50.00,
  "accountType": "Main Account",
  "description": "Test transfer - small amount"
}
```

#### Test 4B: Medium Amount Transfer (R500)
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 500.00,
  "accountType": "Main Account",
  "description": "Monthly allowance"
}
```

#### Test 4C: Large Amount Transfer (R2000)
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 2000.00,
  "accountType": "Main Account",
  "description": "Emergency funds"
}
```

#### Test 4D: Education Category Transfer
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 750.00,
  "accountType": "Education",
  "description": "School fees and supplies"
}
```

#### Test 4E: Healthcare Category Transfer
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 300.00,
  "accountType": "Healthcare",
  "description": "Medical expenses"
}
```

**Expected Success Response (201):**
```json
{
  "message": "Money sent successfully",
  "transfer": {
    "id": 456,
    "transactionRef": "TXN20250709ABC123",
    "amount": 50.00,
    "currency": "ZAR",
    "accountType": "Main Account",
    "fromCard": {
      "id": "card-uuid-123",
      "bankName": "Standard Bank",
      "cardNumber": "****-****-****-1111",
      "nickname": "My Standard Bank Visa",
      "cardType": "Visa"
    },
    "toBeneficiary": {
      "id": 12,
      "name": "John William Doe",
      "accountNumber": "1234567890",
      "email": "john.doe@example.com"
    },
    "status": "completed",
    "timestamp": "2025-07-09T10:30:00.000Z",
    "description": "Test transfer - small amount",
    "stripePaymentId": "pi_1234567890"
  },
  "balanceUpdate": {
    "beneficiaryPreviousBalance": 1000.00,
    "beneficiaryNewBalance": 1050.00,
    "transferAmount": 50.00
  },
  "fees": {
    "transferFee": 0.00,
    "stripeProcessingFee": 3.45,
    "totalFees": 3.45
  }
}
```

### Step 5: Get Transfer History
**Request:** `GET {{BASE_URL}}/api/transfers/history`

**Headers:**
```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Parameters (optional):**
```
?page=1&limit=10                    # Pagination
?beneficiaryId={{BENEFICIARY_ID}}   # Filter by beneficiary
?accountType=Main Account           # Filter by account type
?startDate=2025-07-01               # Date range start
?endDate=2025-07-31                 # Date range end
```

**Examples:**
```
GET {{BASE_URL}}/api/transfers/history
GET {{BASE_URL}}/api/transfers/history?page=1&limit=5
GET {{BASE_URL}}/api/transfers/history?beneficiaryId={{BENEFICIARY_ID}}
GET {{BASE_URL}}/api/transfers/history?accountType=Education
GET {{BASE_URL}}/api/transfers/history?startDate=2025-07-01&endDate=2025-07-31
```

**Expected Response (200):**
```json
{
  "message": "Transfer history retrieved successfully",
  "transfers": [
    {
      "id": 456,
      "transactionRef": "TXN20250709ABC123",
      "amount": 50.00,
      "currency": "ZAR",
      "accountType": "Main Account",
      "beneficiary": {
        "id": 12,
        "name": "John William Doe",
        "accountNumber": "1234567890"
      },
      "card": {
        "bankName": "Standard Bank",
        "cardNumber": "****-****-****-1111",
        "cardType": "Visa"
      },
      "status": "completed",
      "timestamp": "2025-07-09T10:30:00.000Z",
      "description": "Test transfer - small amount"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTransfers": 1,
    "limit": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "summary": {
    "totalAmountSent": 50.00,
    "totalTransfers": 1,
    "dateRange": {
      "from": "2025-07-09T00:00:00.000Z",
      "to": "2025-07-09T23:59:59.999Z"
    }
  }
}
```

## ❌ Error Response Testing

### Test Invalid Amount (Below Minimum)
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 5.00,
  "accountType": "Main Account",
  "description": "Below minimum test"
}
```

**Expected Error (400):**
```json
{
  "message": "Amount must be at least R10.00",
  "error": "AMOUNT_TOO_LOW",
  "limits": {
    "minimum": 10.00,
    "maximum": 5000.00,
    "currency": "ZAR"
  }
}
```

### Test Invalid Amount (Above Maximum)
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 10000.00,
  "accountType": "Main Account",
  "description": "Above maximum test"
}
```

**Expected Error (400):**
```json
{
  "message": "Amount exceeds maximum limit of R5,000.00 per transaction",
  "error": "AMOUNT_TOO_HIGH",
  "limits": {
    "minimum": 10.00,
    "maximum": 5000.00,
    "currency": "ZAR"
  }
}
```

### Test Invalid Card ID
**Body:**
```json
{
  "cardId": "invalid-card-id",
  "beneficiaryId": "{{BENEFICIARY_ID}}",
  "amount": 100.00,
  "accountType": "Main Account",
  "description": "Invalid card test"
}
```

**Expected Error (404):**
```json
{
  "message": "Payment card not found or inactive",
  "error": "CARD_NOT_FOUND"
}
```

### Test Invalid Beneficiary ID
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "invalid-beneficiary-id",
  "amount": 100.00,
  "accountType": "Main Account",
  "description": "Invalid beneficiary test"
}
```

**Expected Error (404):**
```json
{
  "message": "Beneficiary not found",
  "error": "BENEFICIARY_NOT_FOUND"
}
```

### Test Unauthorized Beneficiary
**Body:**
```json
{
  "cardId": "{{CARD_ID}}",
  "beneficiaryId": "999999",
  "amount": 100.00,
  "accountType": "Main Account",
  "description": "Unauthorized beneficiary test"
}
```

**Expected Error (403):**
```json
{
  "message": "You are not authorized to send money to this beneficiary",
  "error": "UNAUTHORIZED_BENEFICIARY"
}
```

### Test Missing Required Fields
**Body:**
```json
{
  "amount": 100.00,
  "description": "Missing fields test"
}
```

**Expected Error (400):**
```json
{
  "message": "Missing required fields",
  "error": "VALIDATION_ERROR",
  "required": {
    "cardId": "Payment card ID is required",
    "beneficiaryId": "Beneficiary ID is required",
    "accountType": "Account type is required"
  }
}
```

## 🔧 Complete Postman Collection for Transfers

```json
{
  "info": {
    "name": "Money Transfer API - Complete Collection",
    "description": "Complete testing suite for money transfer functionality"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:5000"
    },
    {
      "key": "PRODUCTION_URL",
      "value": "https://nanacaring-backend.onrender.com"
    }
  ],
  "item": [
    {
      "name": "Prerequisites",
      "item": [
        {
          "name": "1. Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set(\"AUTH_TOKEN\", response.token);",
                  "    console.log(\"Auth token saved\");",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"funder@example.com\",\n  \"password\": \"your_password_here\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/auth/login",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "2. Get My Cards",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    if (response.cards && response.cards.length > 0) {",
                  "        pm.environment.set(\"CARD_ID\", response.cards[0].id);",
                  "        console.log(\"Card ID saved:\", response.cards[0].id);",
                  "    }",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/payment-cards/my-cards",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "payment-cards", "my-cards"]
            }
          }
        }
      ]
    },
    {
      "name": "Transfer Operations",
      "item": [
        {
          "name": "3. Get Beneficiaries",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    if (response.beneficiaries && response.beneficiaries.length > 0) {",
                  "        pm.environment.set(\"BENEFICIARY_ID\", response.beneficiaries[0].id);",
                  "        console.log(\"Beneficiary ID saved:\", response.beneficiaries[0].id);",
                  "    }",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/beneficiaries",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "beneficiaries"]
            }
          }
        },
        {
          "name": "4. Get Transfer Info",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/info",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "info"]
            }
          }
        },
        {
          "name": "5. Send Money (Small Amount)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"{{CARD_ID}}\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 50.00,\n  \"accountType\": \"Main Account\",\n  \"description\": \"Test transfer - small amount\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        },
        {
          "name": "6. Send Money (Medium Amount)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"{{CARD_ID}}\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 500.00,\n  \"accountType\": \"Main Account\",\n  \"description\": \"Monthly allowance\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        },
        {
          "name": "7. Send Money (Education)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"{{CARD_ID}}\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 750.00,\n  \"accountType\": \"Education\",\n  \"description\": \"School fees and supplies\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        },
        {
          "name": "8. Get Transfer History",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/history",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "history"]
            }
          }
        }
      ]
    },
    {
      "name": "Error Testing",
      "item": [
        {
          "name": "9. Invalid Amount (Too Low)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"{{CARD_ID}}\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 5.00,\n  \"accountType\": \"Main Account\",\n  \"description\": \"Below minimum test\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        },
        {
          "name": "10. Invalid Amount (Too High)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"{{CARD_ID}}\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 10000.00,\n  \"accountType\": \"Main Account\",\n  \"description\": \"Above maximum test\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        },
        {
          "name": "11. Invalid Card ID",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{AUTH_TOKEN}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cardId\": \"invalid-card-id\",\n  \"beneficiaryId\": \"{{BENEFICIARY_ID}}\",\n  \"amount\": 100.00,\n  \"accountType\": \"Main Account\",\n  \"description\": \"Invalid card test\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/transfers/send-to-beneficiary",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "transfers", "send-to-beneficiary"]
            }
          }
        }
      ]
    }
  ]
}
```

## 🧪 Testing Workflow Summary

### Phase 1: Setup (Do Once)
1. ✅ Login to get JWT token
2. ✅ Add payment cards using test endpoint
3. ✅ Verify cards are available

### Phase 2: Transfer Testing (Repeat as needed)
1. ✅ Get beneficiaries list
2. ✅ Check transfer limits and info
3. ✅ Send various amounts and categories
4. ✅ Verify transfer history
5. ✅ Test error scenarios

### Phase 3: Production Testing
1. ✅ Switch to production URL
2. ✅ Use real payment cards (with Stripe)
3. ✅ Test with actual beneficiaries
4. ✅ Monitor real transfer processing

## 🎯 Success Criteria

A successful implementation should:
- ✅ Allow card selection from user's added cards
- ✅ Validate transfer amounts within limits
- ✅ Process payments through Stripe
- ✅ Update beneficiary balances
- ✅ Generate transaction references
- ✅ Maintain transfer history
- ✅ Handle all error scenarios gracefully
- ✅ Show clear user feedback

The transfer system is now ready for comprehensive testing! 🚀
