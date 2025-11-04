# Payment Method & Error Handling Updates

## Changes Made

### 1. ❌ Removed Account Type Selector
**Location:** `src/components/Cart/Cart.jsx` (Checkout Modal)

**What was removed:**
- Account Type dropdown selector that allowed users to choose which account to pay from
- The selection field with options like "Main", "Healthcare", "Education", etc.

**Why:** 
- Payment is always from account balance
- Simplifies the checkout UI
- Removes confusion about payment sources

### 2. ✅ Insufficient Balance Error Message (Already Correct)
**Location:** `src/components/Cart/Cart.jsx` (Line 804)

**Current Implementation:**
```javascript
if (err?.status === 400 && String(err?.message || '').toLowerCase().includes('insufficient')) {
  setOrderError(`Insufficient balance. ${err?.data ? `Shortfall: R${Number(err.data.shortfall || 0).toFixed(2)}` : ''}`);
}
```

**Error Message Format:**
```
Insufficient balance. Shortfall: R15.99
```

**Features:**
- ✅ Uses `R` for South African Rands (not Ghanaian currency)
- ✅ Shows exact shortfall amount with 2 decimal places
- ✅ Extracts shortfall from backend response (`err?.data?.shortfall`)
- ✅ Provides clear feedback to user about how much more they need

---

## Updated Checkout Modal Flow

### Before
1. Account Type selector (dropdown)
2. Fulfillment Type 
3. Payment Method
4. Order Summary

### After
1. 💳 Payment Method (Read-only display: "Account Balance")
   - Clear text explaining balance will be deducted
2. 📍 Fulfillment Type (Read-only display: "In-Store Pickup")
   - Clear pickup instructions
3. ℹ️ Pickup Instructions banner
4. Order Summary with total in Rands
5. Cancel/Pay buttons

---

## Error Handling Examples

### Insufficient Balance Error
**User sees:**
```
Insufficient balance. Shortfall: R15.99
```

**Expected User Action:**
- User needs to add at least R15.99 more to their account
- User should cancel checkout
- User should top up their account
- User can retry checkout

### Other Error Scenarios
| Error | Message |
|-------|---------|
| Only dependents can order | "Only active dependents can place orders" |
| Endpoint not found | "Order endpoint not found. Please check your connection." |
| General error | "Failed to process order: [error details]" |
| Unknown error | "Failed to place order. Please try again." |

---

## Checkout Modal UI Updates

### Payment Section (New)
```
💳 Payment Method
┌─────────────────────────────────────┐
│ Account Balance                      │
│ Payment will be deducted from your   │
│ account balance                      │
└─────────────────────────────────────┘
```

### Fulfillment Section (Updated)
```
📍 Fulfillment
┌─────────────────────────────────────┐
│ In-Store Pickup                     │
│ Your order will be ready for pickup  │
│ at the store                         │
└─────────────────────────────────────┘
```

### Pickup Instructions (Informational)
```
ℹ️ Pickup Instructions:
You'll receive a unique store code after placing the order. 
Use this code to collect your items at the store.
```

### Order Summary
```
Order Summary
Items (3):           R45.99
Total:               R45.99
```

---

## Technical Details

### Removed Code
- Account Type state: `const [selectedAccountType, setSelectedAccountType] = useState('Main');`
- Account Type selector UI: Form dropdown with 6 account options
- Account Type logic: No longer sent to backend

### Unchanged
- `paymentMethod: 'account_balance'` always sent in checkout payload
- ZAR currency formatting (R) throughout
- All price displays in Rands

### Error Response Handling
The code handles backend responses with optional chaining:
```javascript
err?.data?.shortfall    // Safely accesses shortfall from error response
Number(value || 0)      // Defaults to 0 if missing
.toFixed(2)             // Always shows 2 decimal places
```

---

## User Experience Flow

1. **User clicks "Proceed to Checkout"**
   - Modal opens showing:
     - Payment method: Account Balance (fixed)
     - Fulfillment: In-Store Pickup (fixed)
     - Order summary with total in Rands

2. **User reviews order**
   - Sees exact total to be charged
   - Sees pickup instructions

3. **User clicks "Pay R[amount]"**
   - Checkout attempts to process

4. **Success Path**
   - Shows success alert with Order Number & Store Code
   - Clears cart
   - Redirects to order history

5. **Error Path - Insufficient Balance**
   - Shows error: "Insufficient balance. Shortfall: R15.99"
   - User stays in modal
   - User can cancel and top up account
   - User can retry checkout

---

## Summary

✅ **Simplified Payment** - No account selection, always uses account balance
✅ **Clear Error Messages** - Users know exactly how much more they need
✅ **ZAR Currency** - All amounts in South African Rands (R)
✅ **Better UX** - Fewer fields to confuse users
✅ **In-Store Focus** - Only pickup method available
✅ **Professional Presentation** - Clean, organized checkout modal with emojis for clarity
