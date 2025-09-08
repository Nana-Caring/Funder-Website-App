const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nanacaring-backend.onrender.com';

class AccountService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/accounts`;
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
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Get all user accounts
  async getMyAccounts() {
    try {
      const response = await fetch(`${this.baseURL}/my-accounts`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      throw error;
    }
  }

  // Get specific account balance
  async getAccountBalance(accountId) {
    try {
      const response = await fetch(`${this.baseURL}/balance/${accountId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  }

  // Get account balance by account number
  async getAccountBalanceByNumber(accountNumber) {
    try {
      const response = await fetch(`${this.baseURL}/balance/number/${accountNumber}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching account balance by number:', error);
      throw error;
    }
  }

  // Get accounts by type
  async getAccountsByType(accountType) {
    try {
      const response = await fetch(`${this.baseURL}/type/${accountType}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching accounts by type:', error);
      throw error;
    }
  }

  // Get account summary with recent transactions
  async getAccountSummary(accountId) {
    try {
      const response = await fetch(`${this.baseURL}/summary/${accountId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching account summary:', error);
      throw error;
    }
  }

  // Get dependent's own accounts (for dependent users)
  async getDependentMyAccounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dependent/my-accounts`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching dependent accounts:', error);
      throw error;
    }
  }

  // Get dependent accounts (for caregivers)
  async getDependentAccounts(dependentId) {
    try {
      const response = await fetch(`${this.baseURL}/dependent/${dependentId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching dependent accounts:', error);
      throw error;
    }
  }

  // Admin: Get all accounts
  async getAllAccounts(page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      
      const response = await fetch(`${this.baseURL}/admin/all?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching all accounts:', error);
      throw error;
    }
  }

  // Admin: Get account statistics
  async getAccountStats() {
    try {
      const response = await fetch(`${this.baseURL}/admin/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching account stats:', error);
      throw error;
    }
  }

  // Helper method to format currency
  formatCurrency(amount, currency = 'ZAR') {
    const numAmount = parseFloat(amount) || 0;
    if (currency === 'ZAR') {
      return `R${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
    }
    return `${currency} ${numAmount.toFixed(2)}`;
  }

  // Helper method to calculate total balance from accounts
  calculateTotalBalance(accounts) {
    if (!accounts || !Array.isArray(accounts)) return 0;
    return accounts.reduce((total, account) => {
      return total + (parseFloat(account.balance) || 0);
    }, 0);
  }

  // Helper method to get account type color
  getAccountTypeColor(accountType) {
    const colors = {
      'Main': '#185c37',
      'Education': '#4caf50',
      'Healthcare': '#ff9800',
      'Baby Care': '#9c27b0',
      'Entertainment': '#2196f3',
      'Clothing': '#e91e63',
      'Pregnancy': '#ff5722',
      'Savings': '#607d8b'
    };
    return colors[accountType] || '#666';
  }

  // Helper method to get account type percentage from total
  getAccountTypePercentage(accountBalance, totalBalance) {
    if (!totalBalance || totalBalance === 0) return 0;
    return Math.round((parseFloat(accountBalance) / parseFloat(totalBalance)) * 100);
  }
}

export const accountService = new AccountService();
export default accountService;
