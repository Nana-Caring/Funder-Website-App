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
  ArrowBack
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
  width: calc(100% - 250px); /* Account for sidebar width */
  height: calc(100vh - 80px); /* Account for header height */
  position: relative;
  margin-left: auto;
  margin-top: 25px; /* Space below header */
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  padding: 24px; /* Add equal padding around content */
  box-sizing: border-box;
`;

const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px; /* Reduced from 1200px for better centering */
  margin: 0 auto; /* Center horizontally */
  box-sizing: border-box;
  gap: 24px; /* Add consistent spacing between elements */
`;

const MainContent = styled.div`
  display: flex;
  gap: 24px; /* Consistent spacing */
  width: 100%;
  justify-content: center; /* Center content horizontally */
  
  > div {
    &:first-child {
      flex: 1.5;
      max-width: 600px; /* Reduced from 700px */
    }
    &:last-child {
      flex: 1;
      max-width: 350px; /* Reduced from 400px */
    }
  }
`;

const BalanceCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: 16px;

  .balance-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .balance-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;

    p {
      font-size: 16px;
      margin: 0;
      font-weight: 400;
      font-family: Inter;
      color: #666;
    }
  }

  .card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 8px 0;
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
  padding: 20px;
  border-radius: 12px;
  margin-top:25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  display: flex;
  gap: 16px;

  .action-card {
    flex: 1;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    &:first-child {
      flex: 0.7;
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
      max-height: 200px; /* Fixed height for scrolling */
      overflow-y: auto; /* Enable vertical scrolling */
      padding-right: 4px; /* Add space for scrollbar */

      /* Custom scrollbar styling */
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }

      .request-item {
        display: flex;
        align-items: center;
        padding: 6px 8px; /* Slightly reduced padding */
        background: #e0e0e0;
        border-radius: 8px;
        margin-bottom: 6px; /* Reduced spacing between items */
        transition: background-color 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: #d0d0d0;
        }

        .request-details {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px; /* Reduced from 16px */
          font-size: 11px; /* Reduced from 14px */
          font-family: 'Poppins', sans-serif;

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:first-child {
              color: #111;
              font-weight: 500;
            }

            &:last-child {
              color: #666;
              cursor: pointer;
            }
          }
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
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const TrackingSection = styled.div`
  background: white;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 0px;
   font-family: 'Poppins', sans-serif;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    gap: 15px;
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

  .account-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
  }

  .account-item {
   font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &.baby { background: #9c27b0; }
      &.entertainment { background: #2196f3; }
      &.healthcare { background: #ff9800; }
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
    height: 21px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    gap: 4px;

    .fill {
      height: 100%;
      border-radius: 4px;
      &.baby { background: #9c27b0; flex: 0.2; }
      &.entertainment { background: #2196f3; flex: 0.4; }
      &.healthcare { background: #ff9800; flex: 0.2; }
      &.education { background: #4caf50; flex: 0.2; }
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
  margin-top: 0;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  h3 {
    position: sticky;
    top: 0;
    background: white;
    padding: 8px 0;
    margin: 0;
    z-index: 1;
  }

  .transactions-container {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  }

  .transaction {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px;
    background: #e0e0e0;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    gap: 16px; /* Reduced from 30px */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      background: #d0d0d0;
    }

    .avatar {
      width: 28px; /* Reduced from 32px */
      height: 28px; /* Reduced from 32px */
      flex-shrink: 0;
    }

    .details {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px; /* Reduced from 20px */
      font-size: 11px; /* Reduced font size */
      color: #666;
      
      span {
        white-space: nowrap; /* Keep text in one line */
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .amount {
        color: rgb(5, 1, 3);
        font-weight: 500;
        margin-left: auto;
      }
    }
  }

  @media (max-width: 480px) {
    .transaction {
      gap: 8px;
      
      .details {
        font-size: 10px;
        gap: 8px;
      }
    }
  }
`;

const ResponsiveStyles = styled.div`
  @media (max-width: 1200px) {
    ${Container} {
      padding: 16px; /* Smaller padding on smaller screens */
    }
    ${MainContent} {
      flex-direction: column;
      align-items: center; /* Center items when stacked */
      
      > div {
        &:first-child, &:last-child {
          max-width: 600px;
          width: 100%;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    ${MainContent} {
      flex-direction: column;
      gap: 24px;
      align-items: flex-start; /* Changed from center */
    }
    ${RightPanel} {
      margin-right: 0;
      margin-top: 24px;
    }
    ${DashboardContainer} {
      padding: 12px;
      align-items: flex-start; /* Changed from center */
    }
  }

  @media (max-width: 768px) {
    ${Container} {
      width: calc(100% - 200px);
    }
    
    ${DashboardContainer} {
      padding: 12px;
    }
    ${MainContent} {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start; /* Changed from center */
      > div {
        min-width: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Changed from center */
      }
    }
    ${BalanceCard}, ${QuickActions}, ${TrackingSection}, ${TransactionHistory} {
      padding: 10px;
      border-radius: 10px;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
    ${NanaCardWrapper} {
      max-width: 98vw;
    }
    ${NanaCard} {
      height: 120px;
      max-width: 98vw;
      padding: 10px;
      font-size: 14px;
    }
    ${QuickActions} {
      flex-direction: column;
      gap: 12px;
      .action-card {
        margin-bottom: 8px;
      }
    }
    ${SendMoneyModal} {
      width: 95vw;
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    ${DashboardContainer} {
      padding: 4px;
      align-items: center;
    }
    ${BalanceCard}, ${QuickActions}, ${TrackingSection}, ${TransactionHistory} {
      padding: 6px;
      border-radius: 8px;
      width: 100%;
      max-width: 98vw;
      margin: 0 auto;
    }
    ${NanaCard} {
      height: 90px;
      font-size: 12px;
      padding: 6px;
    }
    ${QuickActions} {
      gap: 8px;
      .action-card {
        padding: 6px;
      }
    }
    ${SendMoneyModal} {
      width: 99vw;
      padding: 6px;
    }
    .modal-header h2 {
      font-size: 16px;
    }
    .form-group label, .form-group select, .form-group input {
      font-size: 12px;
    }
    ${TransactionHistory} .transaction {
      gap: 10px;
      font-size: 12px;
      .avatar {
        width: 24px;
        height: 24px;
      }
    }
  }
`;


const LetterAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color || '#FD3E6E'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const mockRequests = [
  { name: 'Charity Matlapo', category: 'Healthcare', amount: 'R10 000' },
  { name: 'John Smith', category: 'Education', amount: 'R5 000' },
  { name: 'Sarah Johnson', category: 'Baby Care', amount: 'R3 500' },
  { name: 'Michael Brown', category: 'Entertainment', amount: 'R2 000' },
  { name: 'Emma Davis', category: 'Healthcare', amount: 'R8 000' },
];

const mockTransactions = [
  { id: 1, type: 'School fees', date: '11-feb-25 11:00 AM', amount: '-R10 000' },
  { id: 2, type: 'Healthcare', date: '10-feb-25 02:30 PM', amount: '-R2 500' },
  { id: 3, type: 'Entertainment', date: '09-feb-25 09:15 AM', amount: '-R1 500' },
  { id: 4, type: 'Baby Care', date: '08-feb-25 03:45 PM', amount: '-R3 000' },
  { id: 5, type: 'Education', date: '07-feb-25 10:20 AM', amount: '-R5 000' },
  { id: 6, type: 'Healthcare', date: '06-feb-25 01:00 PM', amount: '-R800' },
  { id: 7, type: 'Entertainment', date: '05-feb-25 04:30 PM', amount: '-R2 000' },
  { id: 8, type: 'Baby Care', date: '04-feb-25 11:45 AM', amount: '-R1 200' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  
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
    
    return '';
  };

  useEffect(() => {
    // Load account data from localStorage immediately
    const loadInitialAccountData = () => {
      try {
        // Check if this is a funder login by checking userRole
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'funder') {
          // For funders, try to load from the complete login response first
          const loginResponseStr = localStorage.getItem('loginResponse');
          if (loginResponseStr) {
            try {
              const loginResponse = JSON.parse(loginResponseStr);
              
              // Transform to match expected API structure
              const transformedData = {
                totalBalance: loginResponse.balance?.toString() || "0",
                currency: "ZAR",
                accounts: {
                  main: Array.isArray(loginResponse.accounts) ? 
                    loginResponse.accounts.slice(0, 1) : [], // First account as main
                  sub: Array.isArray(loginResponse.accounts) ? 
                    loginResponse.accounts.slice(1) : [] // Rest as sub-accounts
                }
              };
              setAccountData(transformedData);
              console.log('Loaded funder account data from login response:', transformedData);
              
              // Load transactions if available
              if (Array.isArray(loginResponse.transactions)) {
                setRecentTransactions(loginResponse.transactions);
              }
              
              // If data loaded successfully from login response, return early
              return;
            } catch (err) {
              console.warn('Error parsing funder login response:', err);
            }
          }
        }
        
        // Standard account loading for all user types
        const userAccounts = localStorage.getItem('userAccounts');
        if (userAccounts) {
          const accounts = JSON.parse(userAccounts);
          if (Array.isArray(accounts)) {
            // Transform to match expected API structure
            const transformedData = {
              totalBalance: accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0).toString(),
              currency: accounts[0]?.currency || "ZAR",
              accounts: {
                main: accounts.filter(acc => acc.accountType?.toLowerCase() === 'main'),
                sub: accounts.filter(acc => acc.accountType?.toLowerCase() !== 'main')
              }
            };
            setAccountData(transformedData);
            console.log('Loaded account data from userAccounts:', transformedData);
          }
        }
      } catch (error) {
        console.warn('Error loading initial account data from localStorage:', error);
      }
    };

    // Load initial data immediately
    loadInitialAccountData();

    // Skip API call for funder role - use stored data
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'funder') {
      // Funders use cached data only
      return;
    }
    
    // Fetch fresh account data from API for non-funder roles
    const fetchAccountData = async () => {
      try {
        const accountsData = await accountService.getMyAccounts();
        setAccountData(accountsData);
        console.log('Fresh account data received:', accountsData);
        
        // Fetch recent transactions from main account if available
        if (accountsData.accounts?.main?.[0]?.id) {
          const summaryData = await accountService.getAccountSummary(accountsData.accounts.main[0].id);
          setRecentTransactions(summaryData.account?.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error);
        setError('Failed to load account information');
        
        // If API fails and we don't have localStorage data, use empty state
        if (!accountData) {
          setAccountData({
            totalBalance: "0.00",
            currency: "ZAR",
            accounts: { main: [], sub: [] }
          });
        }
      }
    };

    fetchAccountData();
  }, []);

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
    const timer = setTimeout(() => {
      const shouldShow = checkShowPopup();
      if (shouldShow) {
        setShowProfilePopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCompleteProfile = () => {
    setShowProfilePopup(false);
    // Navigate to profile page (all roles use /profile route)
    navigate('/profile');
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  // Calculate account statistics
  const getAccountStats = () => {
    const userRole = localStorage.getItem('userRole');
    
    // Special handling for funder role
    if (userRole === 'funder') {
      // Try to get balance from various sources
      let mainBalance = '0';
      let mainAccount = null;
      
      // Try funder-specific stored balance first
      const funderMainBalance = localStorage.getItem('funderMainBalance');
      if (funderMainBalance) {
        mainBalance = funderMainBalance;
      }
      
      // Try to get from the raw login response next
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        if (loginResponse.balance) {
          mainBalance = loginResponse.balance.toString();
        } else if (loginResponse.accounts?.length > 0) {
          mainBalance = loginResponse.accounts[0].balance?.toString() || '0';
          mainAccount = loginResponse.accounts[0];
        }
        
        // Use transactions from login response if available
        if (!recentTransactions.length && Array.isArray(loginResponse.transactions)) {
          setRecentTransactions(loginResponse.transactions);
        }
      } catch (e) {
        console.warn('Error parsing funder login response for stats', e);
      }
      
      // Calculate spent amount from transactions
      const totalSpent = recentTransactions.reduce((sum, transaction) => {
        if (transaction.type === 'Debit') {
          return sum + parseFloat(transaction.amount || 0);
        }
        return sum;
      }, 0);
      
      return {
        totalBalance: accountService.formatCurrency(mainBalance),
        totalSpent: accountService.formatCurrency(totalSpent),
        accountTypeStats: [], // Funders don't have sub-accounts in the same way
        mainAccount
      };
    }
    
    // Standard handling for non-funder roles
    let currentAccountData = accountData;
    
    // If no account data from API, try to get from localStorage
    if (!currentAccountData || !currentAccountData.accounts) {
      try {
        const userAccounts = localStorage.getItem('userAccounts');
        if (userAccounts) {
          const accounts = JSON.parse(userAccounts);
          if (Array.isArray(accounts)) {
            // Transform to match expected API structure
            currentAccountData = {
              totalBalance: accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0).toString(),
              currency: accounts[0]?.currency || "ZAR",
              accounts: {
                main: accounts.filter(acc => acc.accountType?.toLowerCase() === 'main'),
                sub: accounts.filter(acc => acc.accountType?.toLowerCase() !== 'main')
              }
            };
          }
        }
      } catch (error) {
        console.warn('Error parsing userAccounts from localStorage:', error);
      }
    }

    if (!currentAccountData || !currentAccountData.accounts) {
      return {
        totalBalance: '0.00',
        totalSpent: '0.00',
        accountTypeStats: [],
        mainAccount: null
      };
    }

    const allAccounts = [
      ...(currentAccountData.accounts.main || []),
      ...(currentAccountData.accounts.sub || [])
    ];

    const mainAccount = currentAccountData.accounts.main?.[0] || null;
    const totalBalance = parseFloat(currentAccountData.totalBalance || 0);
    
    // Calculate spent amount (this could come from transactions or be calculated differently)
    const totalSpent = recentTransactions.reduce((sum, transaction) => {
      if (transaction.type === 'Debit') {
        return sum + parseFloat(transaction.amount || 0);
      }
      return sum;
    }, 0);

    // Calculate account type statistics
    const accountTypeStats = currentAccountData.accounts.sub?.map(account => ({
      type: account.accountType,
      balance: parseFloat(account.balance || 0),
      percentage: accountService.getAccountTypePercentage(account.balance, totalBalance),
      color: accountService.getAccountTypeColor(account.accountType)
    })) || [];

    return {
      totalBalance: accountService.formatCurrency(totalBalance),
      totalSpent: accountService.formatCurrency(totalSpent),
      accountTypeStats,
      mainAccount
    };
  };

  const stats = getAccountStats();

  return (
    <ResponsiveStyles>
      <Container>
      <DashboardContainer>
        
        <MainContent>
          <div>
           <BalanceCard>
              <div className="balance-row">
                <div className="balance-item" style={{ justifyContent: 'center', width: '100%' }}>
                  <p>Main Account Balance:</p>
                  <p style={{ color: '#185c37', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {(() => {
                      // For funder role, display only one balance from localStorage
                      const userRole = localStorage.getItem('userRole');
                      if (userRole === 'funder') {
                        // Try to get the funder main balance first
                        const funderMainBalance = localStorage.getItem('funderMainBalance');
                        if (funderMainBalance) {
                          return accountService.formatCurrency(funderMainBalance);
                        }
                        
                        // Try to get from the raw login response
                        try {
                          const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
                          if (loginResponse.balance) {
                            return accountService.formatCurrency(loginResponse.balance);
                          } else if (loginResponse.accounts?.length > 0) {
                            return accountService.formatCurrency(loginResponse.accounts[0].balance);
                          }
                        } catch (e) {
                          console.warn('Error parsing login response', e);
                        }
                      }
                      
                      // Fall back to the stats value for non-funders or if no specific funder balance found
                      return stats.totalBalance;
                    })()}
                  </p>
                </div>
              </div>
              {error && (
                <div style={{ 
                  padding: '8px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  color: '#856404',
                  marginTop: '8px'
                }}>
                  {error}
                </div>
              )}
            </BalanceCard>

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
                <h3>Quick Transfer</h3>
                <div className="users">
                  <div className="user-container">
                    <LetterAvatar color="#185c37">S</LetterAvatar>
                    <span className="user-name">Son</span>
                  </div>
                  <div className="user-container">
                    <LetterAvatar color="#c1126b">D</LetterAvatar>
                    <span className="user-name">Daughter</span>
                  </div>
                  <div className="user-container">
                    <LetterAvatar color="#3b82f6">C</LetterAvatar>
                    <span className="user-name">Chris</span>
                  </div>
                  <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
                </div>
                <select className="transfer-select">
                  <option>Select Account</option>
                  {(() => {
                    // Get all available accounts from current data or localStorage
                    let allAccounts = [];
                    
                    if (accountData?.accounts) {
                      allAccounts = [
                        ...(accountData.accounts.main || []),
                        ...(accountData.accounts.sub || [])
                      ];
                    } else {
                      // Fallback to localStorage userAccounts
                      try {
                        const userAccounts = localStorage.getItem('userAccounts');
                        if (userAccounts) {
                          const accounts = JSON.parse(userAccounts);
                          if (Array.isArray(accounts)) {
                            allAccounts = accounts;
                          }
                        }
                      } catch (error) {
                        console.warn('Error parsing userAccounts from localStorage:', error);
                      }
                    }
                    
                    return allAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.accountType} - {accountService.formatCurrency(account.balance)}
                      </option>
                    ));
                  })()}
                </select>
                <button onClick={() => setIsModalOpen(true)}>Send Money</button>
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
                        {(() => {
                          // Get all available accounts
                          let allAccounts = [];
                          
                          if (accountData?.accounts) {
                            allAccounts = [
                              ...(accountData.accounts.main || []),
                              ...(accountData.accounts.sub || [])
                            ];
                          } else {
                            try {
                              const userAccounts = localStorage.getItem('userAccounts');
                              if (userAccounts) {
                                const accounts = JSON.parse(userAccounts);
                                if (Array.isArray(accounts)) {
                                  allAccounts = accounts;
                                }
                              }
                            } catch (error) {
                              console.warn('Error parsing userAccounts:', error);
                            }
                          }
                          
                          return allAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountType} - {accountService.formatCurrency(account.balance)}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>To</label>
                      <select>
                        <option value="">Select Destination Account</option>
                        {(() => {
                          // Get all available accounts
                          let allAccounts = [];
                          
                          if (accountData?.accounts) {
                            allAccounts = [
                              ...(accountData.accounts.main || []),
                              ...(accountData.accounts.sub || [])
                            ];
                          } else {
                            try {
                              const userAccounts = localStorage.getItem('userAccounts');
                              if (userAccounts) {
                                const accounts = JSON.parse(userAccounts);
                                if (Array.isArray(accounts)) {
                                  allAccounts = accounts;
                                }
                              }
                            } catch (error) {
                              console.warn('Error parsing userAccounts:', error);
                            }
                          }
                          
                          return allAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountType} - {accountService.formatCurrency(account.balance)}
                            </option>
                          ));
                        })()}
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
                  {mockRequests.map((request, index) => (
                    <div className="request-item" key={index}>
                      <div className="request-details">
                        <span>{request.name}</span>
                        <span>{request.category}</span>
                        <span>{request.amount}</span>
                        <span>...</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <button>See All</button> */}
              </div>
            </QuickActions>
          </div>

          {/* RIGHT COLUMN */}
          <RightPanel>
            <TrackingSection>
              <div className="icons-container">
                <LetterAvatar color="#185c37">P</LetterAvatar>
                <LetterAvatar color="#c1126b">C</LetterAvatar>
                <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
                <div className="dots">
                  <div className="dot"></div>
                  <div className="dot inactive"></div>
                  <div className="dot inactive"></div>
                </div>
              </div>
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
                  {stats.accountTypeStats.map((account, index) => (
                    <div 
                      key={index}
                      className="fill" 
                      style={{ 
                        backgroundColor: account.color,
                        flex: account.percentage / 100 || 0.1
                      }}
                    />
                  ))}
                </div>
              </AccountProgress>
              <div className="account-list">
                {stats.accountTypeStats.map((account, index) => (
                  <div className="account-item" key={index}>
                    <div className="dot" style={{ backgroundColor: account.color }}></div>
                    <span>{account.type} Account</span>
                    <span style={{ marginLeft: 'auto' }}>
                      {account.percentage}% ({accountService.formatCurrency(account.balance)})
                    </span>
                  </div>
                ))}
              </div>
            </TrackingSection>

            <TransactionHistory>
              <h3>Latest Transactions</h3>
              <div className="transactions-container">
                {recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 8).map((transaction) => (
                    <div className="transaction" key={transaction.id}>
                      <LetterAvatar color={transaction.type === 'Credit' ? '#185c37' : '#e74c3c'}>
                        {transaction.type === 'Credit' ? '+' : '-'}
                      </LetterAvatar>
                      <div className="details">
                        <span>{transaction.type}</span>
                        <span>{new Date(transaction.createdAt).toLocaleDateString()} {new Date(transaction.createdAt).toLocaleTimeString()}</span>
                        <span className="amount" style={{ 
                          color: transaction.type === 'Credit' ? '#185c37' : '#e74c3c' 
                        }}>
                          {transaction.type === 'Credit' ? '+' : '-'}{accountService.formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  mockTransactions.map((transaction) => (
                    <div className="transaction" key={transaction.id}>
                      <LetterAvatar>
                        {transaction.type.charAt(0)}
                      </LetterAvatar>
                      <div className="details">
                        <span>{transaction.type}</span>
                        <span>{transaction.date}</span>
                        <span className="amount">{transaction.amount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TransactionHistory>
          </RightPanel>
        </MainContent>
      </DashboardContainer>
      
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup
          onClose={handleClosePopup}
          onCompleteProfile={handleCompleteProfile}
        />
      )}
    </Container>
    </ResponsiveStyles>
  );
};

export default Dashboard;
