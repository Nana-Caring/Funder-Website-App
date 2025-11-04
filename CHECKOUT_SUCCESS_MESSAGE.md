# Checkout Success Message Format

## What the User Sees After Successful Order

After a dependent successfully completes checkout, they will see an alert with the following formatted message:

```
✅ Checkout successful
📋 Order Number: ORD1762240466684451
🏪 Store Code: DM9QL5MF
📝 Instructions: "Present this code at checkout"
```

## Data Sources

The success message pulls data from the checkout response:

| Field | Source | Fallback |
|-------|--------|----------|
| **Order Number** | `resp?.data?.order?.id` | `resp?.data?.id` or `resp?.data?.orderId` or `'N/A'` |
| **Store Code** | `resp?.data?.order?.storeCode` | `resp?.data?.storeCode` or `''` |
| **Instructions** | `resp?.data?.collection?.pickupHint` | `resp?.data?.instructions` or `'Present this code at checkout'` |

## User Actions After Success

1. Alert is displayed with the checkout confirmation and important details
2. User clicks "OK" on the alert
3. Cart is automatically cleared
4. User is redirected to `/dependent-orders` (Order History page)
5. The new order appears in their order list

## Implementation Details

**File:** `src/components/Cart/Cart.jsx`
**Function:** `handleCheckout()`
**Location:** Lines 777-793

The message is built dynamically from the backend response:

```javascript
const storeCode = resp?.data?.order?.storeCode || resp?.data?.storeCode || '';
const orderId = resp?.data?.order?.id || resp?.data?.id || resp?.data?.orderId || 'N/A';
const pickupInstructions = resp?.data?.collection?.pickupHint || resp?.data?.instructions || 'Present this code at checkout';

const successMessage = [
  '✅ Checkout successful',
  `📋 Order Number: ${orderId}`,
  `🏪 Store Code: ${storeCode}`,
  `📝 Instructions: "${pickupInstructions}"`
].join('\n');

alert(successMessage);
```

## Emojis Used

- ✅ = Success indicator
- 📋 = Order documentation/record
- 🏪 = Store location
- 📝 = Instructions/information

## Why This Format?

✅ **Clear Confirmation** - User immediately knows the order succeeded
✅ **Essential Information** - Order number and store code for in-store pickup
✅ **Visual Clarity** - Emojis make each line easy to scan
✅ **Professional** - Clean, organized message format
✅ **User-Friendly** - Instructions are clear for in-store collection
✅ **Multiple Fallbacks** - Handles different backend response structures

## Example Backend Response Structure

The code handles these response structures:

```javascript
// Structure 1: Nested order object
{
  success: true,
  message: "Order placed successfully",
  data: {
    order: {
      id: "ORD1762240466684451",
      storeCode: "DM9QL5MF"
    },
    collection: {
      pickupHint: "Present this code at checkout"
    }
  }
}

// Structure 2: Flat structure
{
  success: true,
  data: {
    id: "ORD1762240466684451",
    storeCode: "DM9QL5MF",
    instructions: "Present this code at checkout"
  }
}
```

The code uses optional chaining (`?.`) to safely access these values with fallback defaults.
