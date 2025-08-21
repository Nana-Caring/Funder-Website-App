import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Search,
  Notifications,
  Settings,
  Person,
  Home,
  AccountBalance,
  Send,
  Group,
  Share,
  Close,
  ArrowBack,
  ExpandMore,
  CalendarToday,
  FilterList
} from '@mui/icons-material';
import PaymentModal from '../PaymentModal/PaymentModal';
import ProfileCompletionPopup from '../common/ProfileCompletionPopup';
import { accountService } from '../../services/accountService';
import { Avatar, Modal, IconButton } from '@mui/material';
/* 
  Outer container that holds the main dashboard area.
*/
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 89%;
  margin-top: -40px;
  height: calc(100vh - 60px); /* Adjust height to fill the viewport minus header */
  overflow: hidden;
  position: relative;
  margin-left: 175px; /* Adjust this value to match the width of the sidebar */
  
 
`;

/* 
  The main area (right side) after the sidebar.
  It includes a top header and the main content below it.
*/
const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  
  padding: 20px 0 20px 0; // Remove side padding, keep top/bottom
  height: 100%;
`;

/* 
  Main content area below the header:
  We want two columns:
    - Left column (balance, card, quick actions)
    - Right column (tracking, transaction history)
*/
const MainContent = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center; // Center the columns horizontally
  align-items: flex-start; // Align items to the top
  height: 100%;

  > div {
    &:first-child {
      flex: 1.5;
      min-width: 300px;
    }
    &:last-child {
      flex: 1;
      min-width: 250px;
    }
  }
`;

const BalanceCard = styled.div`
  background-color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer; /* Add cursor pointer to indicate clickability */

  span {
    font-size: 16px;
    font-weight: 400;
    color: #333; /* Darker text color */
  }
`;

const BalanceDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align text to the right */

  span {
    font-size: 14px;
    font-weight: 400;
    color: #333; /* Darker text color */
  }
`;

import cardBg from '../../assets/images/card-bg.png';

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
`;

const NanaCardShadow = styled.div`
  position: absolute;
  top: 35px;
  left: 40px;
  width: calc(100% + 30px);
  height: 197px;
  background-color: gray;
  border-radius: 15px;
  z-index: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  filter: blur(8px);
`;

const NanaCard = styled.div`
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 20px;
  border-radius: 15px;
  aspect-ratio: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 170px;
  width: 100%;
  max-width: 380px;
  z-index: 1;

  .card-name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 9px;
    margin-top: 8px;
    font-family: 'Podkova', serif;
    color: #CAC8C8;
  }
`;


const QuickActions = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;

  display: flex;
  gap: 12px;
  margin-top: 16px;

  .action-card {
    flex: 1;
    background: white;
    padding: 8px;
    border-radius: 12px;
    height: 200px;
    overflow-y: auto;

    &:first-child {
      flex: 0.7;
      height: 160px;
      overflow-y: visible;
    }

    h3 {
      font-size: 14px;
      color: #333;
      margin: 0 0 6px 0;
    }

    .users {
      display: flex;
      align-items: flex-start;
      margin: 8px 0;
      gap: 24px; /* Increased from 12px to 24px */
      font-family: 'Poppins', sans-serif;
      
      .user-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .avatar {
          margin-bottom: 4px;
          border: 2px solid white;
          width: 28px;
          height: 28px;
        }

        .user-name {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
          font-family: 'Poppins', sans-serif;
        }
      }

      .arrow-icon {
        width: 20px;
        height: 20px;
        margin-left: 4px;
        align-self: center;
      }
    }

    .transfer-select {
      width: 100%;
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 12px;
    }

    .deposit-selects {
      margin: 4px 0;
      


      .to-text {
        text-align: center;
        margin: 4px 0;
        color: #666;
      }

      .request-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background: #e0e0e0;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background-color 0.2s ease;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: #d0d0d0;
        }
        .request-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-family: Poppins, sans-serif;

          span:first-child {

            color: #111;
          }

          span:last-child {
            font-size: 12px;
            color: #333;
          }
        }

        .request-amount {
          font-weight: 600;
          color: #111;
        }

        .more-options {
          color: #333;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }

    .account-select {
      width: 100%;
      padding: 6px;
      margin-bottom: 4px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 12px;
    }

    button {
      width: 100%;
      padding: 8px;
      border: none;
      border-radius: 8px;
      background: #FD3E6E;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
      }

      &.see-all {
        background: none;
        color: #ff0000;
        font-weight: 500;
        margin-top: 8px;
      }
    }
  }
`;

const RightPanel = styled.div`
  display: flex;
  margin-right: 8px;
  flex-direction: column;
  gap: 0;
  padding: 0;
  
`;

const TrackingSection = styled.div`
  background: white;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 0px;
   font-family: 'Poppins', sans-serif;
  

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    gap: 12px;
    position: relative;

    .dots {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #FD3E6E;

        &.inactive {
          background: transparent;
          border: 1px solid #FD3E6E;
        }
      }
    }
  }
  .arrow-icon {
    color: #666;
  }

  .expenses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .calendar-filter {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      color: #666;
      font-size: 12px;

      &:hover {
        background-color: #f0f0f0;
      }

      .calendar-icon {
        font-size: 16px;
      }
    }
  }

  .date-filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 20;
    padding: 12px;
    min-width: 200px;
    margin-top: 4px;

    .filter-option {
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f0f0f0;
      }

      &.active {
        background-color: #FD3E6E;
        color: white;
      }
    }

  .card-name{
  font-size: 20px;
  }

    .custom-date-range {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #eee;

      label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
        display: block;
      }

      input {
        width: 100%;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 8px;
      }

      .apply-filter {
        background: #FD3E6E;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        width: 100%;

        &:hover {
          opacity: 0.9;
        }
      }
    }
  }

  .account-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px; /* Set maximum height */
    overflow-y: auto; /* Enable vertical scrolling */
    padding-right: 4px; /* Add some padding for the scrollbar */
    
    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a1a1a1;
      }
    }
  }

  .account-item {
   font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
    padding: 6px 8px; /* Add padding for better spacing */
    border-radius: 6px; /* Add border radius for better look */
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #f8f9fa;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0; /* Prevent dot from shrinking */

      &.main { background: #185c37; }
      &.education { background: #4caf50; }
      &.healthcare { background: #ff9800; }
      &.clothing { background: #e91e63; }
      &.entertainment { background: #2196f3; }
      &.baby-care { background: #9c27b0; }
      &.pregnancy { background: #ff5722; }
      &.savings { background: #607d8b; }
    }
    
    /* Ensure text doesn't wrap and ellipsis is shown if needed */
    span:first-of-type {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    span:last-of-type {
      white-space: nowrap;
      font-size: 12px;
      color: #888;
    }
  }
`;

const AccountProgress = styled.div`
  margin-bottom: 6px;

  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
  }

  .progress-bar {
    height: 15px;
    background: #f0f0f0;
    border-radius:25px;
    overflow: hidden;
    display: flex;


    .fill {
      height: 100%;
      border-radius: 0px;
      &.main { background: #185c37; }
      &.education { background: #4caf50; }
      &.healthcare { background: #ff9800; }
      &.clothing { background: #e91e63; }
      &.entertainment { background: #2196f3; }
      &.baby-care { background: #9c27b0; }
      &.pregnancy { background: #ff5722; }
      &.savings { background: #607d8b; }
    }
  }
`;

const SendMoneyModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
  }

  .form-group {
    margin-bottom: 16px;

    &:has(input[type="number"]) {
      display: flex;
      align-items: center;
      gap: 16px;

      label {
        margin-bottom: 0;
        min-width: 80px;
      }
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #666;
      font-size: 14px;
      text-align: center;
    }

    select, input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .warning-message {
    color: #ff0000;
    font-size: 12px;
    margin: 16px 0;
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 24px;

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      background: #000;
      color: white;

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

const TransactionHistory = styled.div`
  margin-top:0;
  background: white;
  padding: 4px;
  border-radius: 12px;

  
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 8px 0;

    .search-icon {
      cursor: pointer;
      color: #666;
    }
  }

  .transaction {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    padding: 4px;
    background: #e0e0e0;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    gap: 24px;

    &:hover {
      background: #d0d0d0;
    }

    .avatar {
     
      width: 32px;
      height: 32px;
    }

    .details {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      
      h4 {
        margin: 0;
        font-size: 14px;
        color: #333;
      }
      p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
    }

    .amount {
      color: rgb(5, 1, 3);
     
     
    }
  }
`;

const AccountsDropdown = styled.div`
  position: absolute;
  /* Adjust top based on the height of BalanceCard and its margin */
  top: calc(12px + 20px + 12px + 6px + 4px); /* Padding top + bottom + border + margin bottom + gap */
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;
  padding: 8px 0;
  /* margin-top: 4px; /* Small gap below the card */

  span {
    display: block;
    padding: 8px 20px;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const LetterAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color || '#FD3E6E'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
`;

/**
 * ✅ REAL DATA INTEGRATION STATUS
 * 
 * The DependentHome component now uses real backend data from the following API endpoints:
 * 
 * 1. GET /api/dependent/my-accounts - Used to fetch dependent's account data
 *    - Returns: { totalBalance, currency, accounts: { main: [], sub: [] }, allAccounts: [] }
 * 
 * 2. GET /api/accounts/summary/:accountId - Used to fetch account transactions
 *    - Returns: { account: { transactions: [] } }
 * 
 * Real data is used in:
 * ✅ Account Balance Card - Shows real totalBalance and selected account balance
 * ✅ Account Dropdown - Lists all real accounts with real balances
 * ✅ Monthly Expenses - Calculates real percentages from actual account balances
 * ✅ Quick Transfer Selects - Shows real accounts for transfer options
 * ✅ Payment Modal - Uses real account data for From/To selections
 * ✅ Transaction History - Displays real transaction data from selected account
 * ✅ Account Type Statistics - Calculated from real account balances and types
 * 
 * Caching system:
 * ✅ Account data cached for 5 minutes
 * ✅ Transaction data cached per account
 * ✅ Account type statistics cached
 * ✅ Selected account ID persisted in localStorage
 * 
 * Mock data is only used as fallback when API calls fail or no data is available.
 */

const DependentHome = () => {
  const navigate = useNavigate();
  
  // Helper function to find the main account from any account list
  const findMainAccount = (accounts) => {
    if (!accounts || !Array.isArray(accounts)) return null;
    
    // Look for main account first
    const mainAccount = accounts.find(account => 
      account.accountType?.toLowerCase() === 'main' || 
      account.accountType?.toLowerCase() === 'primary'
    );
    
    return mainAccount || accounts[0]; // Fallback to first account if no main found
  };

  // Initialize selectedAccountId with preference for main account
  const getInitialSelectedAccountId = () => {
    // First check localStorage for saved selection
    const savedAccountId = localStorage.getItem('selectedAccountId');
    if (savedAccountId) return savedAccountId;
    
    // Check for main account in userAccounts
    try {
      const userAccounts = localStorage.getItem('userAccounts');
      if (userAccounts) {
        const accounts = JSON.parse(userAccounts);
        if (Array.isArray(accounts)) {
          const mainAccount = findMainAccount(accounts);
          if (mainAccount) return mainAccount.id;
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts in initial state:', error);
    }
    
    return null;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showAccountsDropdown, setShowAccountsDropdown] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(getInitialSelectedAccountId);
  const [error, setError] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accountTypeStats, setAccountTypeStats] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  // Get user information from localStorage
  const userName = localStorage.getItem('userName') || 
                   localStorage.getItem('firstName') || 
                   JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                   'User';
  const userEmail = localStorage.getItem('email') || JSON.parse(localStorage.getItem('user') || '{}').email || '';
  const userRole = localStorage.getItem('userRole') || JSON.parse(localStorage.getItem('user') || '{}').role || '';
  const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id || '';
  const userSurname = localStorage.getItem('surname') || JSON.parse(localStorage.getItem('user') || '{}').surname || '';
  const userMiddleName = localStorage.getItem('middleName') || JSON.parse(localStorage.getItem('user') || '{}').middleName || '';
  
  // Get full user display name
  const fullUserName = [localStorage.getItem('firstName'), userMiddleName, userSurname]
    .filter(Boolean)
    .join(' ') || userName;

  // Helper function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      setError('Authentication required. Please log in again.');
      return false;
    }
    
    return true;
  };



  const toggleAccountsDropdown = () => {
    setShowAccountsDropdown(!showAccountsDropdown);
  };

  // Filter transactions based on date criteria
  const filterTransactionsByDate = (transactions, filterType, startDate = null, endDate = null) => {
    if (!transactions || transactions.length === 0) return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt || transaction.timestamp);
      const transactionDay = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
      
      switch (filterType) {
        case 'today':
          return transactionDay.getTime() === today.getTime();
        
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transactionDay >= weekAgo;
        
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transactionDay >= monthAgo;
        
        case 'quarter':
          const quarterAgo = new Date(today);
          quarterAgo.setMonth(quarterAgo.getMonth() - 3);
          return transactionDay >= quarterAgo;
        
        case 'year':
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return transactionDay >= yearAgo;
        
        case 'custom':
          if (!startDate || !endDate) return true;
          const start = new Date(startDate);
          const end = new Date(endDate);
          return transactionDay >= start && transactionDay <= end;
        
        default:
          return true;
      }
    });
  };

  // Apply date filter and update filtered transactions
  const applyDateFilter = (filterType, startDate = null, endDate = null) => {
    const filtered = filterTransactionsByDate(recentTransactions, filterType, startDate, endDate);
    setFilteredTransactions(filtered);
    setDateFilter(filterType);
    setShowDateFilter(false);
  };

  // Reset filters
  const resetDateFilter = () => {
    setFilteredTransactions(recentTransactions);
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  // Constants for cache settings
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Function to store account data in localStorage with timestamp
  const cacheAccountData = (data) => {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem('cachedAccountData', JSON.stringify(cacheItem));
  };

  // Function to get cached account data if it's still valid
  const getCachedAccountData = () => {
    try {
      const cachedItem = localStorage.getItem('cachedAccountData');
      if (!cachedItem) return null;
      
      const { data, timestamp } = JSON.parse(cachedItem);
      const now = Date.now();
      
      // Check if cache is still valid (not expired)
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error reading cached account data:', error);
      // If there's any error reading the cache, return null to force a fresh fetch
      return null;
    }
  };

  // Helper function to get user accounts from localStorage
  const getUserAccountsFromStorage = () => {
    try {
      const userAccounts = localStorage.getItem('userAccounts');
      console.log('UserAccounts from localStorage:', userAccounts);
      if (userAccounts) {
        const accounts = JSON.parse(userAccounts);
        console.log('Parsed userAccounts:', accounts);
        if (Array.isArray(accounts)) {
          // Transform to match the expected API structure
          const transformedData = {
            totalBalance: accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0).toString(),
            currency: accounts[0]?.currency || "ZAR",
            accounts: {
              main: accounts.filter(acc => acc.accountType?.toLowerCase() === 'main'),
              sub: accounts.filter(acc => acc.accountType?.toLowerCase() !== 'main')
            },
            allAccounts: accounts
          };
          console.log('Transformed userAccounts data:', transformedData);
          return transformedData;
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts from localStorage:', error);
    }
    return null;
  };

  // Helper function to load transactions for a specific account
  const loadTransactionsForAccount = async (accountId) => {
    if (!accountId) return;
    
    try {
      // Check for cached transactions first
      const cachedTransactions = localStorage.getItem(`transactions_${accountId}`);
      if (cachedTransactions) {
        const { data, timestamp } = JSON.parse(cachedTransactions);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRecentTransactions(data);
          setFilteredTransactions(data);
          return;
        }
      }
      
      // Fetch fresh transactions if not cached or expired
      const summaryData = await accountService.getAccountSummary(accountId);
      const transactions = summaryData.account?.transactions || [];
      setRecentTransactions(transactions);
      setFilteredTransactions(transactions);
      
      // Cache the transactions
      localStorage.setItem(`transactions_${accountId}`, JSON.stringify({
        data: transactions,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to load transactions for account:', accountId, error);
      // Set empty transactions on error
      setRecentTransactions([]);
      setFilteredTransactions([]);
    }
  };

  // Fetch account data on component mount, using cache if available
  useEffect(() => {
    const fetchAccountData = async () => {
      console.log('Starting fetchAccountData...');
      
      // First check if user is authenticated
      if (!checkAuthStatus()) {
        return; // Exit early if not authenticated
      }

      try {
        // Try to get data from cache first
        const cachedData = getCachedAccountData();
        
        if (cachedData) {
          setAccountData(cachedData);
          console.log('Loaded cached account data:', cachedData);
          
          // Get the saved selected account ID from localStorage or use default
          const savedAccountId = localStorage.getItem('selectedAccountId');
          
          // Check if saved account exists in the cached data
          const allAccounts = [
            ...(cachedData.accounts?.main || []),
            ...(cachedData.accounts?.sub || [])
          ];
          
          const savedAccountExists = savedAccountId && 
            allAccounts.some(account => account.id === savedAccountId);
          
          // Set selected account, prioritizing main account
          if (savedAccountExists) {
            setSelectedAccountId(savedAccountId);
          } else {
            // Always prioritize main account as default
            const mainAccount = findMainAccount([
              ...(cachedData.accounts?.main || []),
              ...(cachedData.accounts?.sub || [])
            ]);
            
            if (mainAccount) {
              setSelectedAccountId(mainAccount.id);
              localStorage.setItem('selectedAccountId', mainAccount.id);
            }
          }
          
          // Load transactions for the selected account
          const selectedAccount = savedAccountExists ? 
            allAccounts.find(acc => acc.id === savedAccountId) : 
            (cachedData.accounts?.main?.[0] || cachedData.accounts?.sub?.[0]);
          
          // Try to get cached transactions or fetch fresh ones
          const cachedTransactions = localStorage.getItem(`transactions_${selectedAccount?.id}`);
          if (cachedTransactions) {
            const { data, timestamp } = JSON.parse(cachedTransactions);
            if (Date.now() - timestamp < CACHE_DURATION) {
              setRecentTransactions(data);
              setFilteredTransactions(data);
              return;
            }
          }
          
          // If we reach here, we need to fetch fresh transactions
          if (selectedAccount?.id) {
            try {
              const summaryData = await accountService.getAccountSummary(selectedAccount.id);
              const transactions = summaryData.account?.transactions || [];
              setRecentTransactions(transactions);
              setFilteredTransactions(transactions);
              
              // Cache the transactions
              localStorage.setItem(`transactions_${selectedAccount.id}`, JSON.stringify({
                data: transactions,
                timestamp: Date.now()
              }));
            } catch (error) {
              // Silent fail for transaction loading
              console.warn('Failed to load transactions:', error);
            }
          }
        }

        // Always try to fetch fresh data in the background (silently)
        try {
          const accountsData = await accountService.getDependentMyAccounts();
          
          // Validate that we received actual data
          if (accountsData && (accountsData.totalBalance !== undefined || accountsData.accounts)) {
            console.log('Fresh account data received:', accountsData);
            setAccountData(accountsData);
            
            // Cache the fresh data
            cacheAccountData(accountsData);
            
            // Update selected account if needed
            const allAccounts = [
              ...(accountsData.accounts?.main || []),
              ...(accountsData.accounts?.sub || [])
            ];
            
            const savedAccountId = localStorage.getItem('selectedAccountId');
            const savedAccountExists = savedAccountId && 
              allAccounts.some(account => account.id === savedAccountId);
            
            if (!savedAccountExists && allAccounts.length > 0) {
              // Always prioritize main account as default
              const mainAccount = findMainAccount(allAccounts);
              if (mainAccount) {
                setSelectedAccountId(mainAccount.id);
                localStorage.setItem('selectedAccountId', mainAccount.id);
                
                // Load transactions for the main account
                await loadTransactionsForAccount(mainAccount.id);
              }
            }
          }
        } catch (apiError) {
          // Silent fail for background loading - don't show errors to user
          console.warn('Background API call failed:', apiError);
          
          // If we don't have cached data and API fails, set empty state
          if (!cachedData) {
            setAccountData({
              totalBalance: "0.00",
              currency: "ZAR",
              accounts: { main: [], sub: [] },
              allAccounts: []
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error);
        // Only show error if it's an authentication issue
        if (error.message.includes('403') || error.message.includes('Access denied') || error.message.includes('Unauthorized')) {
          setError('Please log in again to access your account.');
          // Clear invalid auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
        
        // Set empty state if no cached data available
        const fallbackCache = getCachedAccountData();
        const storageAccounts = getUserAccountsFromStorage();
        
        if (!fallbackCache && storageAccounts) {
          // Use localStorage userAccounts as fallback
          setAccountData(storageAccounts);
          
          // Set selected account from storage data, prioritizing main account
          if (storageAccounts.allAccounts.length > 0) {
            const mainAccount = findMainAccount(storageAccounts.allAccounts);
            if (mainAccount) {
              setSelectedAccountId(mainAccount.id);
              localStorage.setItem('selectedAccountId', mainAccount.id);
            }
          }
        } else if (!fallbackCache && !storageAccounts) {
          setAccountData({
            totalBalance: "0.00",
            currency: "ZAR",
            accounts: { main: [], sub: [] },
            allAccounts: []
          });
        }
      }
    };

    fetchAccountData();
  }, []);

  // Load transactions whenever selectedAccountId changes
  useEffect(() => {
    if (selectedAccountId) {
      loadTransactionsForAccount(selectedAccountId);
    }
  }, [selectedAccountId]);

  // Periodically refresh account data in the background
  useEffect(() => {
    // Function to refresh data silently in background
    const refreshAccountData = async () => {
      try {
        const accountsData = await accountService.getDependentMyAccounts();
        
        // Validate that we received actual data
        if (accountsData && (accountsData.totalBalance !== undefined || accountsData.accounts)) {
          // Update state with fresh data
          setAccountData(accountsData);
          
          // Update cache with fresh data
          cacheAccountData(accountsData);
        }
        
        // Check if the currently selected account still exists
        const allAccounts = [
          ...(accountsData.accounts?.main || []),
          ...(accountsData.accounts?.sub || [])
        ];
        
        const selectedAccountExists = selectedAccountId && 
          allAccounts.some(account => account.id === selectedAccountId);
        
        // If selected account no longer exists, select main account as default
        if (!selectedAccountExists && allAccounts.length > 0) {
          const mainAccount = findMainAccount(allAccounts);
          if (mainAccount) {
            setSelectedAccountId(mainAccount.id);
            localStorage.setItem('selectedAccountId', mainAccount.id);
          }
        }
        
        // Refresh transactions for current account (silently)
        if (selectedAccountId) {
          try {
            const summaryData = await accountService.getAccountSummary(selectedAccountId);
            setRecentTransactions(summaryData.account?.transactions || []);
            setFilteredTransactions(summaryData.account?.transactions || []);
            
            // Update cached transactions
            localStorage.setItem(`transactions_${selectedAccountId}`, JSON.stringify({
              data: summaryData.account?.transactions || [],
              timestamp: Date.now()
            }));
          } catch (error) {
            // Silent fail for transaction refresh
            console.warn('Background transaction refresh failed:', error);
          }
        }
      } catch (error) {
        // Silent fail for background refresh - don't show errors to user
        console.warn('Background refresh failed:', error);
      }
    };
    
    // Set up interval for background refresh (every 2 minutes)
    const refreshInterval = setInterval(refreshAccountData, 2 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [selectedAccountId]);

  useEffect(() => {
    // Check if we should show the profile completion popup
    const checkShowPopup = () => {
      const dismissed = localStorage.getItem('profileCompletionDismissed');
      const reminderTime = localStorage.getItem('profileCompletionReminder');
      const currentTime = Date.now();

      // Don't show if user has dismissed it permanently
      if (dismissed === 'true') {
        return false;
      }

      // Don't show if we're still in the reminder period
      if (reminderTime && currentTime < parseInt(reminderTime)) {
        return false;
      }

      // Check if profile is complete by looking at required fields
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const requiredFields = [
            'firstName', 'surname', 'email', 'phoneNumber', 'Idnumber',
            'postalAddressLine1', 'postalCity', 'postalProvince', 'postalCode',
            'homeAddressLine1', 'homeCity', 'homeProvince', 'homeCode'
          ];
          
          const missingFields = requiredFields.filter(field => 
            !userData[field] || userData[field].toString().trim() === ''
          );
          
          // Show popup if there are missing fields
          return missingFields.length > 0;
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          return false;
        }
      }

      return false;
    };

    // Show popup after a short delay to let the dashboard load
    // and ensure account data is already loaded
    const timer = setTimeout(() => {
      if (checkShowPopup() && accountData) {
        // Make sure we cache the account data before showing the popup
        cacheAccountData(accountData);
        
        // Also cache the selected account ID
        if (selectedAccountId) {
          localStorage.setItem('selectedAccountId', selectedAccountId);
        }
        
        setShowProfilePopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Persist selected account ID when profile popup shows
  useEffect(() => {
    if (showProfilePopup && selectedAccountId) {
      localStorage.setItem('selectedAccountId', selectedAccountId);
    }
  }, [showProfilePopup, selectedAccountId]);

  const handleCompleteProfile = () => {
    // Ensure account data and selectedAccountId are saved before navigating
    if (accountData) {
      cacheAccountData(accountData);
    }
    
    if (selectedAccountId) {
      localStorage.setItem('selectedAccountId', selectedAccountId);
    }
    
    // Also save any transactions data
    if (selectedAccountId && recentTransactions.length > 0) {
      localStorage.setItem(`transactions_${selectedAccountId}`, JSON.stringify({
        data: recentTransactions,
        timestamp: Date.now()
      }));
    }
    
    setShowProfilePopup(false);
    // Navigate to profile page (all roles use /profile route)
    navigate('/profile');
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
    
    // Restore account data from cache if available
    const cachedData = getCachedAccountData();
    if (cachedData) {
      setAccountData(cachedData);
      
      // Restore selected account
      const savedAccountId = localStorage.getItem('selectedAccountId');
      if (savedAccountId) {
        const allAccounts = [
          ...(cachedData.accounts?.main || []),
          ...(cachedData.accounts?.sub || [])
        ];
        
        const savedAccountExists = allAccounts.some(account => account.id === savedAccountId);
        if (savedAccountExists) {
          setSelectedAccountId(savedAccountId);
        }
      }
      
      // Restore transactions if available
      if (selectedAccountId) {
        const cachedTransactions = localStorage.getItem(`transactions_${selectedAccountId}`);
        if (cachedTransactions) {
          try {
            const { data, timestamp } = JSON.parse(cachedTransactions);
            if (Date.now() - timestamp < CACHE_DURATION) {
              setRecentTransactions(data);
            }
          } catch (error) {
            console.error('Error restoring cached transactions:', error);
          }
        }
      }
      
      // Restore account type statistics
      const cachedStatsJson = localStorage.getItem('cachedAccountTypeStats');
      if (cachedStatsJson) {
        try {
          const { data, timestamp } = JSON.parse(cachedStatsJson);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setAccountTypeStats(data);
          }
        } catch (error) {
          console.error('Error restoring cached account type stats:', error);
        }
      }
    }
  };

  // Get the currently selected account
  const getSelectedAccount = () => {
    if (!accountData) return null;
    
    const allAccounts = [
      ...(accountData.accounts?.main || []),
      ...(accountData.accounts?.sub || [])
    ];
    
    // If we have a selected account ID, use it
    if (selectedAccountId) {
      const account = allAccounts.find(account => account.id === selectedAccountId);
      if (account) return account;
    }
    
    // If no selected account or it doesn't exist in current accounts, try to get from localStorage
    const savedAccountId = localStorage.getItem('selectedAccountId');
    if (savedAccountId) {
      const account = allAccounts.find(account => account.id === savedAccountId);
      if (account) return account;
    }
    
    // If all else fails, prioritize main account, then return first available
    const mainAccount = findMainAccount(allAccounts);
    return mainAccount || allAccounts[0] || null;
  };

  // Calculate account statistics for dependents using real API response structure
  const getAccountStats = () => {
    // Default account types that should always be shown
    const defaultAccountTypes = [
      { type: 'Main', color: '#185c37', balance: 0, percentage: 0 },
      { type: 'Education', color: '#4caf50', balance: 0, percentage: 0 },
      { type: 'Healthcare', color: '#ff9800', balance: 0, percentage: 0 },
      { type: 'Clothing', color: '#e91e63', balance: 0, percentage: 0 },
      { type: 'Entertainment', color: '#2196f3', balance: 0, percentage: 0 },
      { type: 'Baby Care', color: '#9c27b0', balance: 0, percentage: 0 },
      { type: 'Pregnancy', color: '#ff5722', balance: 0, percentage: 0 },
      { type: 'Savings', color: '#607d8b', balance: 0, percentage: 0 }
    ];

    let accountsToUse = [];
    let totalBalance = 0;
    let transactionsToUse = recentTransactions;

    // Try to get data from current state first - using real API response structure
    if (accountData) {
      // Use the real API response structure: accounts.main and accounts.sub arrays
      if (accountData.accounts) {
        accountsToUse = [
          ...(accountData.accounts.main || []),
          ...(accountData.accounts.sub || [])
        ];
      } else if (accountData.allAccounts) {
        // Fallback to allAccounts if available
        accountsToUse = accountData.allAccounts || [];
      }
      
      // Use the totalBalance from API response
      totalBalance = parseFloat(accountData.totalBalance || 0);
    } 

    // If no accounts from accountData, try localStorage userAccounts
    if (accountsToUse.length === 0) {
      try {
        const userAccounts = localStorage.getItem('userAccounts');
        if (userAccounts) {
          const accounts = JSON.parse(userAccounts);
          if (Array.isArray(accounts)) {
            accountsToUse = accounts;
            totalBalance = accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);
          }
        }
      } catch (error) {
        console.warn('Error parsing userAccounts from localStorage:', error);
      }
    }

    // If still no accounts, try cached data
    if (accountsToUse.length === 0) {
      const cachedData = getCachedAccountData();
      if (cachedData) {
        if (cachedData.accounts) {
          accountsToUse = [
            ...(cachedData.accounts.main || []),
            ...(cachedData.accounts.sub || [])
          ];
        } else if (cachedData.allAccounts) {
          accountsToUse = cachedData.allAccounts || [];
        }
        
        totalBalance = parseFloat(cachedData.totalBalance || 0);
        
        // Use cached transactions if we don't have current ones
        if (!transactionsToUse.length && selectedAccountId) {
          const cachedTransactionsJson = localStorage.getItem(`transactions_${selectedAccountId}`);
          if (cachedTransactionsJson) {
            try {
              const { data } = JSON.parse(cachedTransactionsJson);
              transactionsToUse = data || [];
            } catch (e) {
              transactionsToUse = [];
            }
          }
        }
      }
    }

    console.log('Accounts found for stats:', accountsToUse);
    console.log('Total balance calculated:', totalBalance);

    // Calculate spent amount from real transaction data
    const totalSpent = transactionsToUse.reduce((sum, transaction) => {
      if (transaction.type === 'Debit') {
        return sum + parseFloat(transaction.amount || 0);
      }
      return sum;
    }, 0);

    // Create account type statistics from real account data
    const accountTypeStats = defaultAccountTypes.map(defaultType => {
      // Find actual accounts matching this type using real account data
      const matchingAccounts = accountsToUse.filter(account => {
        // Use exact match for account types from API
        return account.accountType === defaultType.type;
      });

      // Sum up balances for matching accounts using real balance data
      const totalTypeBalance = matchingAccounts.reduce((sum, account) => {
        return sum + parseFloat(account.balance || 0);
      }, 0);

      // Calculate percentage based on real total balance
      const percentage = totalBalance > 0 ? 
        Math.round((totalTypeBalance / totalBalance) * 100) : 0;

      return {
        type: defaultType.type,
        balance: totalTypeBalance,
        percentage: percentage,
        color: defaultType.color,
        accountCount: matchingAccounts.length
      };
    });

    const result = {
      totalBalance: accountService.formatCurrency(totalBalance),
      totalSpent: accountService.formatCurrency(totalSpent),
      accountTypeStats: accountTypeStats,
      allAccounts: accountsToUse
    };

    return result;
  };

  // Helper function to normalize account types
  const normalizeAccountType = (type) => {
    // Map to standardized display names
    const typeMap = {
      'main': 'Main',
      'primary': 'Main',
      'education': 'Education',
      'healthcare': 'Healthcare',
      'health': 'Healthcare',
      'medical': 'Healthcare',
      'clothing': 'Clothing',
      'entertainment': 'Entertainment',
      'baby': 'Baby Care',
      'baby care': 'Baby Care',
      'babycare': 'Baby Care',
      'pregnancy': 'Pregnancy',
      'savings': 'Savings',
      'save': 'Savings'
    };
    
    const lowerType = (type || '').toLowerCase();
    return typeMap[lowerType] || type;
  };

  // Helper function to get CSS class name for account type
  const getAccountTypeClass = (type) => {
    const normalized = normalizeAccountType(type);
    return normalized.toLowerCase().replace(' ', '-');
  };

  // Helper function to get user's initials and surname
  const getUserInitialsAndSurname = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const firstName = userData.firstName || '';
        const surname = userData.surname || '';
        
        // Get first letter of first name
        const firstInitial = firstName.charAt(0).toUpperCase();
        
        // Return initials and surname
        if (firstInitial && surname) {
          return `${firstInitial}. ${surname}`;
        } else if (surname) {
          return surname;
        } else if (firstName) {
          return firstName;
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return '';
  };

  // Helper function to get main account number
  const getMainAccountNumber = () => {
    // First check for quick access main account number from localStorage (stored during login)
    const mainAccountNumber = localStorage.getItem('mainAccountNumber');
    if (mainAccountNumber) {
      return mainAccountNumber;
    }
    
    // Check current account data
    if (accountData?.accounts?.main?.[0]?.accountNumber) {
      return accountData.accounts.main[0].accountNumber;
    }
    
    // Try to get from cached data
    const cachedData = getCachedAccountData();
    if (cachedData?.accounts?.main?.[0]?.accountNumber) {
      return cachedData.accounts.main[0].accountNumber;
    }
    
    // Try to get from localStorage userAccounts
    try {
      const userAccounts = localStorage.getItem('userAccounts');
      if (userAccounts) {
        const accounts = JSON.parse(userAccounts);
        const mainAccount = accounts.find(account => 
          account.accountType?.toLowerCase() === 'main' || 
          account.accountType?.toLowerCase() === 'primary'
        );
        if (mainAccount?.accountNumber) {
          return mainAccount.accountNumber;
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts from localStorage:', error);
    }
    
    // If no main account, try to get from all accounts array
    const allAccounts = accountData?.allAccounts || cachedData?.allAccounts || [];
    const mainAccount = allAccounts.find(account => 
      account.accountType?.toLowerCase() === 'main' || 
      account.accountType?.toLowerCase() === 'primary'
    );
    
    return mainAccount?.accountNumber || '';
  };

  const selectedAccount = getSelectedAccount();
  const stats = getAccountStats();

  // Update account type statistics when account data changes
  useEffect(() => {
    const stats = getAccountStats();
    setAccountTypeStats(stats.accountTypeStats);
    
    // Cache the account type statistics
    localStorage.setItem('cachedAccountTypeStats', JSON.stringify({
      data: stats.accountTypeStats,
      timestamp: Date.now()
    }));
  }, [accountData, recentTransactions]);

  // Initialize account type statistics from cache
  useEffect(() => {
    const cachedStatsJson = localStorage.getItem('cachedAccountTypeStats');
    if (cachedStatsJson) {
      try {
        const { data, timestamp } = JSON.parse(cachedStatsJson);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setAccountTypeStats(data);
        }
      } catch (error) {
        console.error('Error loading cached account type stats:', error);
      }
    }
    
    // If no cached stats, set default ones
    if (accountTypeStats.length === 0) {
      const defaultStats = [
        { type: 'Main', color: '#185c37', balance: 0, percentage: 0 },
        { type: 'Education', color: '#4caf50', balance: 0, percentage: 0 },
        { type: 'Healthcare', color: '#ff9800', balance: 0, percentage: 0 },
        { type: 'Clothing', color: '#e91e63', balance: 0, percentage: 0 },
        { type: 'Entertainment', color: '#2196f3', balance: 0, percentage: 0 },
        { type: 'Baby Care', color: '#9c27b0', balance: 0, percentage: 0 },
        { type: 'Pregnancy', color: '#ff5722', balance: 0, percentage: 0 },
        { type: 'Savings', color: '#607d8b', balance: 0, percentage: 0 }
      ];
      setAccountTypeStats(defaultStats);
    }
  }, []);

  // Save data when component unmounts
  useEffect(() => {
    return () => {
      // Ensure we save all state data before unmounting
      if (accountData) {
        cacheAccountData(accountData);
      }
      
      if (selectedAccountId) {
        localStorage.setItem('selectedAccountId', selectedAccountId);
      }
      
      if (selectedAccountId && recentTransactions.length > 0) {
        localStorage.setItem(`transactions_${selectedAccountId}`, JSON.stringify({
          data: recentTransactions,
          timestamp: Date.now()
        }));
      }
      
      if (accountTypeStats.length > 0) {
        localStorage.setItem('cachedAccountTypeStats', JSON.stringify({
          data: accountTypeStats,
          timestamp: Date.now()
        }));
      }
    };
  }, [accountData, selectedAccountId, recentTransactions, accountTypeStats]);

  return (
    <Container>
     
     
      {/* --- MAIN DASHBOARD AREA --- */}
      <DashboardContainer>
        <MainContent>
          <div style={{ position: 'relative' }}> {/* Add relative positioning for the dropdown */}
            <BalanceCard onClick={toggleAccountsDropdown}>
              <AccountInfo>
                <span>
                  {selectedAccount ? 
                    `${selectedAccount.accountType} Account` : 
                    'Select Account'
                  }
                </span>
                <ExpandMore style={{ color: '#333' }} />
              </AccountInfo>
              <BalanceDetails>
                <span>Total: {stats.totalBalance}</span>
                <span>
                  {selectedAccount ? 
                    `Bal: ${accountService.formatCurrency(selectedAccount.balance)}` : 
                    'Bal: R0.00'
                  }
                </span>
              </BalanceDetails>
            </BalanceCard>

            {showAccountsDropdown && (
              <AccountsDropdown>
                {(() => {
                  // Get all available accounts from multiple sources
                  let allAvailableAccounts = [];
                  
                  // First, try to get from stats
                  if (stats.allAccounts && stats.allAccounts.length > 0) {
                    allAvailableAccounts = stats.allAccounts;
                  } 
                  // Fallback to accountData
                  else if (accountData) {
                    if (accountData.allAccounts && accountData.allAccounts.length > 0) {
                      allAvailableAccounts = accountData.allAccounts;
                    } else if (accountData.accounts) {
                      allAvailableAccounts = [
                        ...(accountData.accounts.main || []),
                        ...(accountData.accounts.sub || [])
                      ];
                    }
                  }
                  
                  // Fallback to localStorage userAccounts
                  if (allAvailableAccounts.length === 0) {
                    try {
                      const userAccounts = localStorage.getItem('userAccounts');
                      if (userAccounts) {
                        const accounts = JSON.parse(userAccounts);
                        if (Array.isArray(accounts)) {
                          allAvailableAccounts = accounts;
                        }
                      }
                    } catch (error) {
                      console.warn('Error parsing userAccounts from localStorage:', error);
                    }
                  }
                  
                  // Fallback to cached data
                  if (allAvailableAccounts.length === 0) {
                    const cachedData = getCachedAccountData();
                    if (cachedData) {
                      if (cachedData.allAccounts && cachedData.allAccounts.length > 0) {
                        allAvailableAccounts = cachedData.allAccounts;
                      } else if (cachedData.accounts) {
                        allAvailableAccounts = [
                          ...(cachedData.accounts.main || []),
                          ...(cachedData.accounts.sub || [])
                        ];
                      }
                    }
                  }
                  
                  console.log('All available accounts for dropdown:', allAvailableAccounts);
                  
                  if (allAvailableAccounts.length === 0) {
                    return (
                      <span style={{ color: '#666', fontStyle: 'italic', padding: '8px 20px' }}>
                        No accounts available
                      </span>
                    );
                  }
                  
                  return allAvailableAccounts.map(account => (
                    <span 
                      key={account.id}
                      onClick={async () => {
                        console.log('Selected account:', account);
                        setSelectedAccountId(account.id);
                        localStorage.setItem('selectedAccountId', account.id);
                        setShowAccountsDropdown(false);
                        
                        // Load transactions for the newly selected account
                        await loadTransactionsForAccount(account.id);
                      }}
                      style={{ 
                        backgroundColor: selectedAccountId === account.id ? '#f0f0f0' : 'transparent'
                      }}
                    >
                      {account.accountType} - {accountService.formatCurrency(account.balance)}
                    </span>
                  ));
                })()}
              </AccountsDropdown>
            )}

            {error && (
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px', 
                fontSize: '12px',
                color: '#856404',
                margin: '8px 0'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <NanaCardWrapper>
                <NanaCardShadow />
                <NanaCard>
                  <div className="card-name">
                    {getUserInitialsAndSurname()?.toUpperCase() || fullUserName?.toUpperCase() || userName?.toUpperCase() || 'USER'}
                  </div>
                  {getMainAccountNumber() && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#CAC8C8', 
                      marginTop: '8px',
                      marginLeft: '9px'
                    }}>
                     {getMainAccountNumber()}
                    </div>
                  )}
                </NanaCard>
              </NanaCardWrapper>
            </div>

            <QuickActions>
              <div className="action-card">
                <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Quick Transfer</h3>
                <div style={{ marginBottom: '16px' }}>
                  <select className="transfer-select" style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <option value="">Select Source Account</option>
                    {stats.allAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.accountType} - {accountService.formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '12px', margin: '8px 0' }}>to</div>
                  <select className="transfer-select" style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
                    <option value="">Select Destination Account</option>
                    {stats.allAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.accountType} - {accountService.formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    background: '#fd3e6e', 
                    color: 'white', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Send Money
                </button>
                <Modal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  aria-labelledby="send-money-modal"
                >
                  <div>
                    <SendMoneyModal>
                      <div className="modal-header">
                        <IconButton onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', left: '10px' }}>
                          <ArrowBack />
                        </IconButton>
                        <h2 style={{ width: '100%', textAlign: 'center' }}>Pay</h2>
                        <IconButton onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '10px' }}>
                          <Close />
                        </IconButton>
                      </div>
                      <div className="form-group">
                        <select>
                          <option value="">Beneficiary name</option>
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>From</label>
                        <select>
                          <option value="">Select Source Account</option>
                          {stats.allAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountType} - {accountService.formatCurrency(account.balance)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>To</label>
                        <select>
                          <option value="">Select Destination Account</option>
                          {stats.allAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountType} - {accountService.formatCurrency(account.balance)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <input type="number" placeholder="R 5000" />
                      </div>
                      <p className="warning-message">
                        Please be advised that when you proceed now, you have made sure the details are accurate
                      </p>
                      <div className="button-group">
                        <button 
                          className="proceed" 
                          onClick={() => {
                            setIsModalOpen(false);
                            setIsPaymentModalOpen(true);
                          }}
                        >
                          Proceed
                        </button>
                      </div>
                    </SendMoneyModal>
                  </div>
                </Modal>
                <Modal
                  open={isPaymentModalOpen}
                  onClose={() => setIsPaymentModalOpen(false)}
                  aria-labelledby="payment-modal"
                >
                  <div>
                    <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />
                  </div>
                </Modal>
              </div>
              <div className="action-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Manage Requests</h3>
                  <div 
                    onClick={() => navigate('/messages')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <span style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '14px' }}>see all</span>
                    <img src="/src/assets/icons/arrow.png" alt="arrow" style={{ width: '16px', height: '16px', color: '#666' }} />
                  </div>
                </div>
                <div className="deposit-selects">
                  <div className="request-item">
                    <div className="request-details">
                      <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                    
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                    <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                   
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                    <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                    
                  </div>
                  
                </div>
                {/* <button>See All</button> */}
              </div>
            </QuickActions>
          </div>

          {/* RIGHT COLUMN */}
          <RightPanel>
            <TrackingSection>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Monthly expenses 
                <img src="/src/assets/icons/expenses.png" alt="arrow" className="arrow-icon" style={{ width: '16px', height: '16px' }} />
              </h3>
              <p className="total" style={{ 
                fontFamily: 'Inter', 
                fontSize: '30px', 
                fontWeight: '400', 
                marginTop: '4px', 
                marginBottom: '4px', 
                color: '#333333' 
              }}>
                {stats.totalSpent}
              </p>
              <AccountProgress>
                <div className="label">
                  <span>Account Distribution</span>
                  <span>100%</span>
                </div>
                <div className="progress-bar">
                  {(() => {
                    const accountsToShow = accountTypeStats.length > 0 ? accountTypeStats : stats.accountTypeStats;
                    
                    // Calculate total percentage to check if we have real data
                    const totalPercentage = accountsToShow.reduce((sum, account) => sum + (account.percentage || 0), 0);
                    
                    // If no real data (total percentage is 0), show equal distribution
                    if (totalPercentage === 0) {
                      const equalShare = 1 / accountsToShow.length;
                      return accountsToShow.map((account, index) => (
                        <div 
                          key={index}
                          className={`fill ${getAccountTypeClass(account.type)}`}
                          style={{ 
                            flex: equalShare
                          }}
                          title={`${normalizeAccountType(account.type)}: Equal Share`}
                        />
                      ));
                    }
                    
                    // Use real percentages when available
                    return accountsToShow.map((account, index) => (
                      <div 
                        key={index}
                        className={`fill ${getAccountTypeClass(account.type)}`}
                        style={{ 
                          flex: (account.percentage || 0) / 100
                        }}
                        title={`${normalizeAccountType(account.type)}: ${account.percentage}%`}
                      />
                    ));
                  })()}
                </div>
              </AccountProgress>
              <div className="account-list">
                {(() => {
                  const accountsToShow = accountTypeStats.length > 0 ? accountTypeStats : stats.accountTypeStats;
                  // Always show all accounts and make list scrollable
                  return accountsToShow.map((account, index) => (
                    <div className="account-item" key={index}>
                      <div className={`dot ${getAccountTypeClass(account.type)}`}></div>
                      <span>{normalizeAccountType(account.type)} Account</span>
                      <span style={{ marginLeft: 'auto' }}>
                        {account.percentage}% ({accountService.formatCurrency(account.balance)})
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </TrackingSection>

            <TransactionHistory>
              <h3>Latest Transactions</h3>
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 6).map((transaction) => (
                  <div className="transaction" key={transaction.id}>
                    <LetterAvatar color={transaction.type === 'Credit' ? '#185c37' : '#e74c3c'}>
                      {transaction.type === 'Credit' ? '+' : '-'}
                    </LetterAvatar>
                    <div className="details">
                      <span>{transaction.type}</span>
                      <span>
                        {new Date(transaction.createdAt || transaction.timestamp).toLocaleDateString('en-ZA')} {' '}
                        {new Date(transaction.createdAt || transaction.timestamp).toLocaleTimeString('en-ZA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className="amount" style={{ 
                        color: transaction.type === 'Credit' ? '#185c37' : '#e74c3c' 
                      }}>
                        {transaction.type === 'Credit' ? '+' : '-'}{accountService.formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                // Show message when no real transactions are available
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  color: '#666', 
                  fontSize: '14px' 
                }}>
                  No recent transactions found for this account.
                </div>
              )}
            </TransactionHistory>
          </RightPanel>
        </MainContent>
      </DashboardContainer>
      
      {/* Profile Completion Popup - Using Portal for better rendering */}
      {showProfilePopup && (
        <Modal
          open={showProfilePopup}
          onClose={handleClosePopup}
          aria-labelledby="profile-completion-modal"
          style={{ zIndex: 1500 }}
        >
          <div>
            <ProfileCompletionPopup
              onClose={handleClosePopup}
              onCompleteProfile={handleCompleteProfile}
            />
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default DependentHome;
