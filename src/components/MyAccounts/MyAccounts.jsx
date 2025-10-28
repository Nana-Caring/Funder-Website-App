import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Header from '../Header/Header';
import accountService from '../../services/accountService';
import cardBg from '../../assets/images/card-bg.png';
import config from '../../utils/config';

const Container = styled.div`
  position: relative;
  margin-top: 40px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
  flex: 1;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 32px;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #185c37, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
`;



const BalanceCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 6px;
  width: 100%;
  align-self: center;


  display: flex;
  flex-direction: column;
  gap: 16px;

  .balance-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
  }

  .balance-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    flex: 1;
    text-align: center;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.03), rgba(34, 197, 94, 0.03));
    border-radius: 12px;
    border: 1px solid rgba(24, 92, 55, 0.08);

    p {
      font-size: 16px;
      margin: 0;
      font-weight: 400;
      font-family: Inter;
      color: #666;
    }

    .balance-label {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
    }

    .balance-amount {
      font-size: 1.8rem;
      font-weight: 700;
      color: #185c37;
      font-family: 'Inter', sans-serif;
    }
  }

  .card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .balance-section {
    text-align: center;
    padding: 24px;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.05), rgba(34, 197, 94, 0.05));
    border-radius: 16px;
    border: 1px solid rgba(24, 92, 55, 0.1);
  }

  .balance-label {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
  }

  .balance-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #185c37;
    font-family: 'Inter', sans-serif;
  }

  .error-message {
    padding: 16px;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1px solid #f59e0b;
    border-radius: 12px;
    font-size: 14px;
    color: #92400e;
    font-weight: 500;
    text-align: center;
  }

  .deposit-section {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .deposit-button {
    background: linear-gradient(135deg, #185c37, #22c55e);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 120px;

    &:hover {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }

  .deposit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }

  .amount-input {
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }

  .card-element-container {
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }

  .payment-status {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;

    &.success {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &.error {
      background: linear-gradient(135deg, #f8d7da, #f5c6cb);
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    &.loading {
      background: linear-gradient(135deg, #cce7ff, #b3d9ff);
      color: #0c5aa6;
      border: 1px solid #b3d9ff;
    }
  }

  .test-info {
    margin-top: 16px;
    padding: 12px;
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    font-size: 12px;
    color: #856404;

    h4 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
    }

    p {
      margin: 4px 0;
      font-family: 'JetBrains Mono', monospace;
    }
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    width: 95%;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;

  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 24px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }
`;

const DepositForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    font-family: 'Inter', sans-serif;
  }
`;

const AmountInput = styled.input`
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CardElementContainer = styled.div`
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #185c37, #22c55e);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentStatus = styled.div`
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;

  &.success {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  &.error {
    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  &.loading {
    background: linear-gradient(135deg, #cce7ff, #b3d9ff);
    color: #0c5aa6;
    border: 1px solid #b3d9ff;
  }
`;

const TestInfo = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  font-size: 12px;
  color: #856404;

  h4 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
  }

  p {
    margin: 6px 0;
    font-family: 'JetBrains Mono', monospace;
  }
`;

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    margin-bottom: 8px;
  }

  .card-brand-external {
    font-size: 18px;
    font-weight: 700;
    color: #185c37;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.5px;
  }

  .card-type-external {
    background: linear-gradient(135deg, #185c37, #22c55e);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px rgba(24, 92, 55, 0.2);
  }

  .card-details-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    margin-top: 8px;
  }

  .account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .account-number {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .account-holder {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
  }

  .balance-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .balance-label-external {
    font-size: 10px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .balance-amount-external {
    font-size: 20px;
    font-weight: 700;
    color: #185c37;
    font-family: 'Inter', sans-serif;
  }
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
  justify-content: center;
  align-items: center;
  height: 170px;
  width: 100%;
  max-width: 380px;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.1), rgba(34, 197, 94, 0.05));
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  .card-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .card-main-brand {
    font-size: 24px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.95);
    font-family: 'Inter', sans-serif;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .card-tagline {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Inter', sans-serif;
    letter-spacing: 1px;
    text-align: center;
  }

  .card-chip {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 24px;
    height: 18px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .card-pattern {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 20px;
    opacity: 0.3;
    
    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      top: 0;
      left: 0;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      top: 0;
      right: 0;
    }
  }
`;







const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

// Add responsive styles
const ResponsiveWrapper = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    ${Container} {
      width: 100%;
      padding: 16px;
      margin-left: 0;
    }
    
    ${Content} {
      gap: 24px;
    }
    
    ${PageTitle} {
      font-size: 28px;
    }
    
    ${PageSubtitle} {
      font-size: 14px;
    }
    
    ${BalanceCard} {
      padding: 24px;
      margin: 0 8px;
      
      .deposit-button {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
    
    .balance-amount {
      font-size: 2rem !important;
    }
    
    ${NanaCard} {
      height: 180px;
      padding: 24px;
      max-width: 320px;
      min-width: 250px;
      
      .card-name {
        font-size: 14px;
      }
      
      .card-number {
        font-size: 16px;
      }
      
      .card-balance .balance-amount {
        font-size: 14px;
      }
    }
  }
  
  @media (max-width: 480px) {
    ${BalanceCard} {
      padding: 20px;
      gap: 24px;
    }
    
    .balance-amount {
      font-size: 1.8rem !important;
    }
    
    ${NanaCard} {
      height: 160px;
      padding: 20px;
      max-width: 280px;
      min-width: 220px;
    }
  }
`;



const MyCards = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [balanceUpdateTrigger, setBalanceUpdateTrigger] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);
  
  // Ref to track if component has already loaded data
  const hasLoadedData = useRef(false);
  const isInitialized = useRef(false);
  const isFetchingBalance = useRef(false);

  // Validate environment configuration on component mount (run only once)
  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      // This will throw an error if required environment variables are missing
      // validateConfig(); // Commented out to avoid breaking the app, but you can enable it
      console.log('🔧 MyAccounts component initialized - API Base URL:', config.API_URL);
      isInitialized.current = true;
    } catch (error) {
      console.error('Environment configuration error:', error);
      setError('Configuration error. Please check environment variables.');
    }
  }, []);
  
  // Stripe card element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };
  
  // Get user information from localStorage (same as Dashboard)
  const userName = localStorage.getItem('userName') || 
                   localStorage.getItem('firstName') || 
                   JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                   'User';
  const userSurname = localStorage.getItem('surname') || JSON.parse(localStorage.getItem('user') || '{}').surname || '';
  const userMiddleName = localStorage.getItem('middleName') || JSON.parse(localStorage.getItem('user') || '{}').middleName || '';
  
  // Get full user display name
  const fullUserName = [localStorage.getItem('firstName'), userMiddleName, userSurname]
    .filter(Boolean)
    .join(' ') || userName;

  // Helper function to get current balance (reactive to balanceUpdateTrigger)
  const getCurrentBalance = () => {
    // This function will be called whenever balanceUpdateTrigger changes
    const userRole = localStorage.getItem('userRole');
    console.log('🏦 getCurrentBalance called, trigger:', balanceUpdateTrigger, 'role:', userRole);
    
    if (userRole === 'funder') {
      // Always get the latest balance from localStorage
      const funderMainBalance = localStorage.getItem('funderMainBalance');
      console.log('💰 Raw funderMainBalance from localStorage:', funderMainBalance);
      
      if (funderMainBalance && funderMainBalance !== 'null' && funderMainBalance !== 'undefined') {
        // Parse and ensure it's a valid number
        const balanceNum = parseFloat(funderMainBalance);
        if (!isNaN(balanceNum)) {
          const formatted = accountService.formatCurrency(balanceNum);
          console.log('💱 Formatted balance:', formatted);
          return formatted;
        }
      }
      
      // Fallback to login response data
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        if (loginResponse.balance) {
          const formatted = accountService.formatCurrency(loginResponse.balance);
          console.log('💱 Fallback formatted balance:', formatted);
          return formatted;
        } else if (loginResponse.accounts?.length > 0) {
          const formatted = accountService.formatCurrency(loginResponse.accounts[0].balance);
          console.log('💱 Account fallback balance:', formatted);
          return formatted;
        }
      } catch (e) {
        console.warn('Error parsing login response', e);
      }
    }
    
    console.log('💱 Returning default balance: R0.00');
    return 'R0.00';
  };

  // Helper function to get user's initials and surname (same as Dashboard)
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

  // Helper function to get main account number (same as Dashboard)
  const getMainAccountNumber = () => {
    // First check for quick access main account number from localStorage (stored during login)
    const mainAccountNumber = localStorage.getItem('mainAccountNumber');
    if (mainAccountNumber) {
      return mainAccountNumber;
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

  // Fetch real account balance from backend (prevents concurrent calls)
  const fetchAccountBalance = async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingBalance.current) {
      console.log('🔄 Balance fetch already in progress, skipping...');
      return;
    }
    
    try {
      isFetchingBalance.current = true;
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, cannot fetch balance');
        return;
      }

      console.log('🔄 Fetching updated account balance...');
      
      const response = await fetch(`${config.API_URL}/funder/deposit/account`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const balance = data.data.rawBalance;
        
        console.log('💰 Updated balance from server:', balance, 'type:', typeof balance);
        console.log('📊 Full server response:', data);
        
        // Ensure balance is properly converted and validated
        const balanceNum = parseFloat(balance);
        if (!isNaN(balanceNum)) {
          const balanceString = balanceNum.toString();
          localStorage.setItem('funderMainBalance', balanceString);
          
          console.log('💾 Stored in localStorage as:', balanceString);
          
          // Store account number for display
          if (data.data.accountNumber) {
            localStorage.setItem('mainAccountNumber', data.data.accountNumber);
          }
          
          // Trigger component re-render to show updated balance
          const newTrigger = Date.now();
          setBalanceUpdateTrigger(newTrigger);
          
          console.log('✅ Balance updated in localStorage and UI should refresh with trigger:', newTrigger);
          return balanceNum; // Return the balance for use in calling function
        } else {
          console.error('Invalid balance received from server:', balance);
        }
      } else {
        console.error('Failed to fetch balance, status:', response.status);
      }
    } catch (error) {
      console.warn('Could not fetch account balance:', error);
      // Continue with cached balance if API fails
    } finally {
      isFetchingBalance.current = false;
    }
    return null;
  };

  // Load account data on component mount (only once)
  useEffect(() => {
    // Only load data if Stripe is ready and we haven't loaded data yet
    if (stripe && !hasLoadedData.current) {
      console.log('🔄 Loading MyAccounts data for the first time...');
      setLoading(true);
      hasLoadedData.current = true;
      
      const loadAccountData = async () => {
        try {
          await fetchAccountBalance();
          console.log('✅ MyAccounts data loaded successfully');
        } catch (error) {
          console.error('❌ Failed to load MyAccounts data:', error);
          // Reset the flag on error so it can retry if needed
          hasLoadedData.current = false;
        } finally {
          setLoading(false);
        }
      };

      loadAccountData();
    }
  }, [stripe]);

  // Effect to handle balance updates (optimized to prevent unnecessary re-renders)
  useEffect(() => {
    if (balanceUpdateTrigger > 0 && hasLoadedData.current) {
      console.log('🔄 Balance display updating, trigger:', balanceUpdateTrigger);
      const currentBalance = localStorage.getItem('funderMainBalance');
      console.log('💰 Updated balance in localStorage:', currentBalance);
      
      // Only force refresh if we have loaded data before
      setForceRefresh(prev => prev + 1);
    }
  }, [balanceUpdateTrigger]);

  // Effect to handle forced refreshes (optimized)
  useEffect(() => {
    if (forceRefresh > 0) {
      console.log('🔄 Component refreshed, count:', forceRefresh);
    }
  }, [forceRefresh]);

  // Open deposit modal
  const openDepositModal = () => {
    setShowDepositModal(true);
    setError('');
    setPaymentStatus('');
  };

  // Close deposit modal
  const closeDepositModal = () => {
    setShowDepositModal(false);
    setAmount('');
    setError('');
    setPaymentStatus('');
    setLoading(false);
  };

  // Handle real Stripe deposit with card input
  const handleDepositFunds = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !amount) {
      setPaymentStatus('Please fill in all fields');
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    if (amountInCents < 1000) { // Minimum R10.00
      setPaymentStatus('Minimum deposit amount is R10.00');
      return;
    }

    setLoading(true);
    setPaymentStatus('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Step 1: Create payment intent
      console.log('🔧 Creating payment intent for amount:', amountInCents);
      console.log('💾 Using token:', token.substring(0, 20) + '...');
      
      const intentResponse = await fetch(`${config.API_URL}/funder/deposit/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: 'zar'
        })
      });
      
      console.log('📡 Intent API Response Status:', intentResponse.status, intentResponse.statusText);

      // Check if intent response is JSON
      const intentContentType = intentResponse.headers.get('content-type');
      if (!intentContentType || !intentContentType.includes('application/json')) {
        const intentTextResponse = await intentResponse.text();
        console.error('Intent endpoint returned non-JSON:', intentTextResponse);
        throw new Error(`Server error (${intentResponse.status}). Server may be down.`);
      }

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.message || `Failed to create payment intent (${intentResponse.status})`);
      }

      console.log('✅ Payment intent created:', intentData.data.paymentIntentId);
      setPaymentStatus('Processing payment with Stripe...');

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: fullUserName || 'Funder',
          },
        }
      });

      if (error) {
        console.error('❌ Stripe payment failed:', error);
        throw new Error(`Payment failed: ${error.message}`);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not completed successfully');
      }

      console.log('✅ Stripe payment succeeded:', paymentIntent.id);
      setPaymentStatus('Payment successful! Confirming deposit...');

      // Step 3: Confirm deposit on backend
      console.log('🔄 Confirming deposit with payment intent:', paymentIntent.id);
      
      const confirmResponse = await fetch(`${config.API_URL}/funder/deposit/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id
        })
      });
      
      console.log('📡 Confirm API Response Status:', confirmResponse.status, confirmResponse.statusText);

      const confirmContentType = confirmResponse.headers.get('content-type');
      if (!confirmContentType || !confirmContentType.includes('application/json')) {
        const confirmTextResponse = await confirmResponse.text();
        console.error('Confirm endpoint returned non-JSON:', confirmTextResponse);
        throw new Error(`Confirmation failed (${confirmResponse.status}). Payment succeeded but could not update balance.`);
      }

      const confirmData = await confirmResponse.json();
      console.log('📋 Confirm API Response Data:', confirmData);

      if (!confirmResponse.ok) {
        console.error('❌ Confirm API Error:', confirmData);
        throw new Error(confirmData.message || `Failed to confirm deposit (${confirmResponse.status})`);
      }

      // Step 4: Update balance and show success
      const { amount: depositAmount, newBalance } = confirmData.data;
      
      console.log('💰 Deposit confirmed! New balance:', newBalance, 'Deposit amount:', depositAmount);
      console.log('📋 Full confirm response:', confirmData);
      
      // Update localStorage immediately with new balance
      const balanceString = newBalance.toString();
      localStorage.setItem('funderMainBalance', balanceString);
      console.log('💾 Updated localStorage with balance:', balanceString);
      
      // Force multiple UI updates to ensure balance reflects
      const immediateUpdateTrigger = Date.now();
      setBalanceUpdateTrigger(immediateUpdateTrigger);
      console.log('🔄 Immediate UI trigger set:', immediateUpdateTrigger);
      
      // Show success status in modal
      setPaymentStatus(`✅ Deposit successful! R${depositAmount.toFixed(2)} added to your account.`);
      
      // Clear form
      setAmount('');
      cardElement.clear();
      
      // Refresh balance from backend to ensure sync
      await fetchAccountBalance();
      
      // Force another UI update after backend sync
      setBalanceUpdateTrigger(Date.now() + 1);

      // Close modal and show alert after a brief delay
      setTimeout(() => {
        closeDepositModal();
        
        // Show success alert with detailed information
        alert(`🎉 DEPOSIT SUCCESSFUL! 🎉\n\n💰 Deposited: R${depositAmount.toFixed(2)}\n💳 New Balance: R${newBalance.toFixed(2)}\n📈 Transaction ID: ${paymentIntent.id.substring(0, 20)}...\n\n✅ Your funds are now available in your account!`);
        
        // Final balance refresh to ensure UI is up to date
        fetchAccountBalance();
        
        // Force one more UI update
        setBalanceUpdateTrigger(Date.now() + 2);
      }, 2000); // Show success message for 2 seconds before closing

    } catch (error) {
      console.error('💥 Deposit error:', error);
      setError(error.message || 'Failed to process deposit. Please try again.');
      setPaymentStatus('');
    } finally {
      setLoading(false);
    }
  };



  // Show loading until Stripe is ready
  if (!stripe) {
    return (
      <ResponsiveWrapper>
        <Container>
          <Content>
            <LoadingState>
              Loading Stripe payment system...
            </LoadingState>
          </Content>
        </Container>
        <Header />
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <Container>
        <Content>
          

          {loading ? (
            <LoadingState>
              Loading your card information...
            </LoadingState>
          ) : (
            <BalanceCard>
            {/* Balance Row for Main Account and Money Out */}
            <div className="balance-row">
              <div className="balance-item">
                <div>
                  <div className="balance-label">Main Account Balance</div>
                  <div className="balance-amount" key={`main-balance-${balanceUpdateTrigger}`}>
                    {getCurrentBalance()}
                  </div>
                </div>
              </div>

              <div className="balance-item">
                <div>
                  <div className="balance-label">Money Out Balance</div>
                  <div className="balance-amount">
                    {(() => {
                      // Try to get the money out balance from localStorage
                      const userRole = localStorage.getItem('userRole');
                      if (userRole === 'funder') {
                        // Try to get the funder money out balance
                        const funderMoneyOutBalance = localStorage.getItem('funderMoneyOutBalance');
                        if (funderMoneyOutBalance) {
                          return accountService.formatCurrency(funderMoneyOutBalance);
                        }
                        
                        // Try to get from the raw login response
                        try {
                          const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
                          if (loginResponse.accounts?.length > 1) {
                            // Assuming money out is the second account
                            return accountService.formatCurrency(loginResponse.accounts[1].balance);
                          }
                        } catch (e) {
                          console.warn('Error parsing login response for money out', e);
                        }
                      }
                      
                      // Fall back to R0.00 for non-funders or if no specific money out balance found
                      return 'R0.00';
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Deposit Button */}
            <div className="deposit-section">
              <button className="deposit-button" onClick={openDepositModal}>
                Deposit Funds
              </button>
            </div>

            <div className="card-container">
              <NanaCardWrapper>
                {/* Header with brand and card type outside the card */}
                <div className="card-info-header">
                  <div className="card-brand-external">Nana Caring</div>
                  <div className="card-type-external">Funding Card</div>
                </div>

                {/* The simplified card */}
                <NanaCard>
                  
                  <div className="card-pattern"></div>
                  
                  <div className="card-logo">
                    <div className="card-main-brand">NANA</div>
                    <div className="card-tagline">Caring • Funding • Growing</div>
                  </div>
                </NanaCard>

                {/* Footer with account details and balance outside the card */}
                <div className="card-details-footer">
                  <div className="account-info">
                    {getMainAccountNumber() && (
                      <div className="account-number">
                        {getMainAccountNumber().replace(/(\d{4})(?=\d)/g, '$1 ')}
                      </div>
                    )}
                    <div className="account-holder">
                      {getUserInitialsAndSurname()?.toUpperCase() || fullUserName?.toUpperCase() || userName?.toUpperCase() || 'USER'}
                    </div>
                  </div>
                  
                  <div className="balance-info">
                    <div className="balance-label-external">Available Balance</div>
                    <div className="balance-amount-external" key={`card-balance-${balanceUpdateTrigger}`}>
                      {getCurrentBalance()}
                    </div>
                  </div>
                </div>
              </NanaCardWrapper>
            </div>
          </BalanceCard>
          )}
        </Content>
      </Container>
      
      <Header />

      {/* Deposit Modal */}
      {showDepositModal && (
        <ModalOverlay onClick={closeDepositModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>💳 Deposit Funds</h3>
              <CloseButton onClick={closeDepositModal}>×</CloseButton>
            </ModalHeader>
            
            <DepositForm onSubmit={handleDepositFunds}>
              <FormGroup>
                <label>Amount</label>
                <AmountInput
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter deposit amount (minimum R10.00)"
                  min="10"
                  step="0.01"
                  disabled={loading}
                />
              </FormGroup>
              
              <FormGroup>
                <label>Card Details</label>
                <CardElementContainer>
                  <CardElement options={cardElementOptions} />
                </CardElementContainer>
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={!stripe || loading || !amount}
              >
                {loading ? '⏳ Processing...' : `💳 Deposit R${amount || '0.00'}`}
              </SubmitButton>
            </DepositForm>

            {/* Payment Status */}
            {paymentStatus && (
              <PaymentStatus className={paymentStatus.includes('✅') ? 'success' : 'loading'}>
                {paymentStatus}
              </PaymentStatus>
            )}

           
          </ModalContent>
        </ModalOverlay>
      )}
    </ResponsiveWrapper>
  );
};

export default MyCards;