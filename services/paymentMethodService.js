const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nanacaring-backend.onrender.com';

class PaymentMethodService {
  constructor() {
    this.bankAccountsURL = `${API_BASE_URL}/api/payment-cards`;
    this.paymentCardsURL = `${API_BASE_URL}/api/payment-cards`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Mock data for development testing (matches Postman test data)
  getMockCards() {
    return {
      message: "Payment cards retrieved successfully (MOCK DATA)",
      cards: [
        {
          id: "mock-card-1",
          bankName: "Standard Bank",
          cardNumber: "****-****-****-1111",
          expiryDate: "12/25",
          nickname: "My Standard Bank Visa",
          isDefault: true,
          isActive: true,
          createdAt: "2025-07-09T10:30:00.000Z"
        },
        {
          id: "mock-card-2", 
          bankName: "FNB",
          cardNumber: "****-****-****-4444",
          expiryDate: "08/26",
          nickname: "FNB Business Card",
          isDefault: false,
          isActive: true,
          createdAt: "2025-07-09T10:31:00.000Z"
        },
        {
          id: "mock-card-3",
          bankName: "Capitec Bank", 
          cardNumber: "****-****-****-0002",
          expiryDate: "03/27",
          nickname: "Capitec Debit Card",
          isDefault: false,
          isActive: true,
          createdAt: "2025-07-09T10:32:00.000Z"
        }
      ],
      totalCards: 3,
      note: "This is mock data for development. Connect to backend for real data."
    };
  }

  // Get all payment methods for the user (now using payment cards endpoint)
  async getPaymentMethods() {
    try {
      const response = await fetch(`${this.paymentCardsURL}/my-cards`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment cards:', error);
      
      // For development - return mock data if backend is not available
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_NAME_NOT_RESOLVED') ||
          error.message.includes('404') || 
          error.message.includes('Not Found')) {
        console.log('Backend not available, using mock data for development');
        return this.getMockCards();
      }
      
      throw error;
    }
  }

  // Add a new bank account
  async addBankAccount(accountData) {
    try {
      const payload = {
        accountName: accountData.accountName,
        bankName: accountData.bankName,
        accountNumber: accountData.accountNumber,
        accountType: accountData.accountType || 'checking',
        routingNumber: accountData.routingNumber || ''
      };

      const response = await fetch(`${this.bankAccountsURL}/add`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw error;
    }
  }

  // Add a new card (updated to match your API specification)
  async addCard(cardData) {
    try {
      // First try the test endpoint for development
      return await this.addCardTest(cardData);
    } catch (error) {
      console.log('Test endpoint failed, trying production endpoint:', error.message);
      
      try {
        // Fallback to production endpoint
        const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
        const payload = {
          bankName: cardData.bankName,
          cardNumber: cleanCardNumber,
          expiryDate: cardData.expiryDate,
          ccv: cardData.ccv,
          nickname: cardData.nickname || null,
          isDefault: cardData.isDefault || false
        };

        const response = await fetch(`${this.paymentCardsURL}/add`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        return await this.handleResponse(response);
      } catch (prodError) {
        console.error('Production endpoint also failed:', prodError);
        
        // For development - return mock success response
        if (prodError.message.includes('Failed to fetch') || 
            prodError.message.includes('ERR_NAME_NOT_RESOLVED')) {
          console.log('Backend not available, simulating successful card addition');
          return {
            message: "Payment card added successfully (MOCK RESPONSE)",
            card: {
              id: `mock-card-${Date.now()}`,
              bankName: cardData.bankName,
              cardNumber: this.formatCardNumber(cardData.cardNumber),
              expiryDate: cardData.expiryDate,
              nickname: cardData.nickname || 'My Card',
              isDefault: cardData.isDefault || false,
              isActive: true,
              createdAt: new Date().toISOString()
            },
            note: "This is a mock response for development. Backend integration required for production."
          };
        }
        
        throw prodError;
      }
    }
  }

  // Add a new card using TEST endpoint (bypasses Stripe validation for development)
  async addCardTest(cardData) {
    try {
      // Clean and format the data
      const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
      const payload = {
        bankName: cardData.bankName,
        cardNumber: cleanCardNumber,
        expiryDate: cardData.expiryDate,
        ccv: cardData.ccv,
        nickname: cardData.nickname || null,
        isDefault: cardData.isDefault || false
      };

      console.log('Sending TEST card payload:', {
        ...payload,
        cardNumber: '****' + cleanCardNumber.slice(-4), // Hide card number in logs
        ccv: '***' // Hide CCV in logs
      });

      const response = await fetch(`${this.paymentCardsURL}/add-test`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error adding payment card (TEST):', error);
      
      // Handle network errors more gracefully
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        throw new Error('Backend server is not available. Please check if the backend is running or try again later.');
      }
      
      throw error;
    }
  }

  // Update a payment method
  async updatePaymentMethod(id, updateData) {
    try {
      const response = await fetch(`${this.paymentCardsURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating payment card:', error);
      throw error;
    }
  }

  // Delete a payment method (updated for payment cards API)
  async deletePaymentMethod(id) {
    try {
      const response = await fetch(`${this.paymentCardsURL}/remove/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting payment card:', error);
      throw error;
    }
  }

  // Set default payment method (updated for payment cards API)
  async setDefaultPaymentMethod(id) {
    try {
      const response = await fetch(`${this.paymentCardsURL}/set-default/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error setting default payment card:', error);
      throw error;
    }
  }

  // Create payment intent with card
  async createPaymentIntent(paymentData) {
    try {
      const payload = {
        amount: paymentData.amount,
        cardId: paymentData.cardId,
        description: paymentData.description || 'Payment for account funding'
      };

      const response = await fetch(`${this.paymentCardsURL}/create-payment-intent`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Get card type from card number with better detection
  getCardType(cardNumber) {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    
    // More comprehensive card type detection
    if (/^4/.test(cleanCardNumber)) {
      return 'Visa';
    } else if (/^5[1-5]/.test(cleanCardNumber) || /^2[2-7]/.test(cleanCardNumber)) {
      return 'Mastercard';
    } else if (/^3[47]/.test(cleanCardNumber)) {
      return 'American Express';
    } else if (/^6/.test(cleanCardNumber)) {
      return 'Discover';
    } else if (/^35/.test(cleanCardNumber)) {
      return 'JCB';
    } else if (/^30[0-5]/.test(cleanCardNumber) || /^36/.test(cleanCardNumber) || /^38/.test(cleanCardNumber)) {
      return 'Diners Club';
    } else if (/^62/.test(cleanCardNumber)) {
      return 'UnionPay';
    }
    
    return 'Card';
  }

  // Get card brand color for UI
  getCardBrandColor(cardType) {
    const colors = {
      'Visa': '#1A1F71',
      'Mastercard': '#EB001B',
      'American Express': '#006FCF',
      'Discover': '#FF6000',
      'JCB': '#006C00',
      'Diners Club': '#0079BE',
      'UnionPay': '#E21836',
      'Card': '#6B7280'
    };
    return colors[cardType] || colors['Card'];
  }

  // Enhanced card number validation with specific card type rules
  validateCardNumber(cardNumber) {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    
    if (!/^\d+$/.test(cleanCardNumber)) {
      return { isValid: false, message: 'Card number can only contain digits' };
    }

    // Check length based on card type
    const cardType = this.getCardType(cleanCardNumber);
    const validLengths = {
      'Visa': [13, 16, 19],
      'Mastercard': [16],
      'American Express': [15],
      'Discover': [16],
      'JCB': [16],
      'Diners Club': [14],
      'UnionPay': [16, 17, 18, 19]
    };

    const expectedLengths = validLengths[cardType] || [13, 14, 15, 16, 17, 18, 19];
    if (!expectedLengths.includes(cleanCardNumber.length)) {
      return { isValid: false, message: `Invalid ${cardType} card number length` };
    }

    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;

    for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCardNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    const isValid = sum % 10 === 0;
    return { 
      isValid, 
      message: isValid ? 'Valid card number' : 'Invalid card number',
      cardType 
    };
  }

  // Enhanced expiry date validation
  validateExpiryDate(expiryDate) {
    const expiryRegex = /^\d{2}\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      return { isValid: false, message: 'Use MM/YY format' };
    }

    const [month, year] = expiryDate.split('/').map(num => parseInt(num, 10));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      return { isValid: false, message: 'Invalid month (01-12)' };
    }

    // Check if card is expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { isValid: false, message: 'Card has expired' };
    }

    // Check if expiry is too far in the future (more than 20 years)
    const futureYear = currentYear + 20;
    if (year > futureYear) {
      return { isValid: false, message: 'Invalid expiry date' };
    }

    return { isValid: true, message: 'Valid expiry date' };
  }

  // Validate CCV based on card type
  validateCCV(ccv, cardType) {
    const cleanCcv = ccv.replace(/\D/g, '');
    
    if (!cleanCcv) {
      return { isValid: false, message: 'CCV is required' };
    }

    // American Express uses 4-digit CCV, others use 3-digit
    const expectedLength = cardType === 'American Express' ? 4 : 3;
    
    if (cleanCcv.length !== expectedLength) {
      return { 
        isValid: false, 
        message: `${cardType} CCV must be ${expectedLength} digits` 
      };
    }

    return { isValid: true, message: 'Valid CCV' };
  }

  // Format card number for display (mask all but last 4 digits)
  formatCardNumber(cardNumber) {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    return `****${cleanCardNumber.slice(-4)}`;
  }

  // Format account number for display (mask all but last 4 digits)
  formatAccountNumber(accountNumber) {
    return `****${accountNumber.slice(-4)}`;
  }

  // Format card number with spaces for input
  formatCardNumberInput(cardNumber) {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    const formatted = cleanCardNumber.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  }

  // Format expiry date input
  formatExpiryDateInput(value) {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  }

  // Legacy methods for backward compatibility
  validateCardNumberLegacy(cardNumber) {
    const result = this.validateCardNumber(cardNumber);
    return result.isValid;
  }

  validateExpiryDateLegacy(expiryDate) {
    const result = this.validateExpiryDate(expiryDate);
    return result.isValid;
  }
}

export const paymentMethodService = new PaymentMethodService();
export default paymentMethodService;
