import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { paymentMethodService } from '../../services/paymentMethodService';

// Safe localStorage wrapper to handle tracking prevention
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.log('LocalStorage access blocked, using fallback');
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.log('LocalStorage write blocked, data not persisted');
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log('LocalStorage remove blocked');
      return false;
    }
  }
};

const stripePromise = loadStripe('pk_test_51REGFbROeQRel9O58mOSulLZR25JiDCo0FqwlrhopxEUuFh68lZXNTKYDer8334RrTFGBvlsKdkPMFbvzLbaoA4X00OLIDpVtW');

const Container = styled.div`
  position: relative;
  margin-top: 20px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    width: calc(100% - 200px);
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 8px;
    margin-left: 0;
  }
`;

const FormSection = styled.div`
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 24px 20px;
  margin: 8px 0;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 12px;
    margin: 4px 0;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px;
    border-radius: 8px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input, select {
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 13px;
    background: white;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #185c37;
      box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
    }
    
    &:hover {
      border-color: #d1d5db;
    }
  }

  select {
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='%23374151' d='M7 10l5 5 5-5H7z'/></svg>") no-repeat right 12px center;
    background-size: 16px;
    padding-right: 40px;
    cursor: pointer;
  }
`;

const WarningText = styled.p`
  color: #dc2626;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #185c37;
    box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
  }

  span {
    font-weight: 600;
    margin-right: 8px;
    color: #374151;
  }

  input {
    border: none;
    font-size: 13px;
    width: 100%;
    outline: none;
    text-align: right;
    background: transparent;
    font-weight: 500;
  }
`;

const PayButton = styled.button`
  background: linear-gradient(135deg, #185c37, #22c55e);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(24, 92, 55, 0.3);
  margin-top: 4px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #22c55e, #185c37);
    box-shadow: 0 6px 16px rgba(24, 92, 55, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 16px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 6px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const PaymentMethodSection = styled.div`
  padding: 12px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 8px;
  }
`;

const PaymentMethodTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
`;

const AccountCard = styled.div`
  background: white;
  border: 2px solid ${props => props.selected ? '#185c37' : '#e5e7eb'};
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 6px;
  
  &:hover {
    border-color: #185c37;
    background: #f9fafb;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    margin-bottom: 4px;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountName = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 13px;
`;

const AccountType = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const SelectedIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#185c37' : '#d1d5db'};
  background: ${props => props.selected ? '#185c37' : 'white'};
  position: relative;
  
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => props.selected ? 1 : 0};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  max-width: 450px;
  width: 90%;
  max-height: fit-content;
`;

const MessageContainer = styled.div`
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  
  ${props => props.$success ? `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  ` : `
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  `}
`;

const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  max-width: 380px;
  width: 90%;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    max-width: 320px;
  }
`;

const PopupIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => props.$success ? 
    'linear-gradient(135deg, #22c55e, #16a34a)' : 
    'linear-gradient(135deg, #f87171, #ef4444)'
  };
  color: white;
`;

const PopupTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const PopupMessage = styled.p`
  margin: 0 0 20px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.4;
`;

const PopupButton = styled.button`
  background: linear-gradient(135deg, #185c37, #22c55e);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #22c55e, #185c37);
    transform: translateY(-1px);
  }
`;

const SendMoney = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accountType, setAccountType] = useState('Main Account');
  const [amount, setAmount] = useState('0.00');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('success');

  
  const showAlert = (message) => {
    setMessage(message);
    setError(message);
  };

    // Fetch beneficiaries from backend
 const fetchBeneficiaries = async () => {
      setLoading(true);
      setError('');
      try {
        const token = safeLocalStorage.getItem('token');
        const userRole = safeLocalStorage.getItem('userRole');
        console.log('🔍 Fetching beneficiaries for user role:', userRole);
        
        let response;
        
        // Try the main beneficiaries endpoint
        try {
          response = await axios.get('https://nanacaring-backend.onrender.com/api/funder/get-beneficiaries', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('📦 Beneficiaries response (get-beneficiaries endpoint):', response.data);
        } catch (funderErr) {
          console.warn('⚠️ Get-beneficiaries endpoint failed, trying alternative...', funderErr.response?.status);
          
          // Try alternative endpoint
          try {
            response = await axios.get('https://nanacaring-backend.onrender.com/api/funder/beneficiaries', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('📦 Beneficiaries response (beneficiaries endpoint):', response.data);
          } catch (altErr) {
            console.warn('⚠️ Alternative endpoint also failed, using cache...', altErr.response?.status);
            
            // If all endpoints fail, try to get from local cache
            const cachedBeneficiaries = safeLocalStorage.getItem('beneficiaries') || safeLocalStorage.getItem('funder_beneficiaries');
            if (cachedBeneficiaries) {
              try {
                const parsed = JSON.parse(cachedBeneficiaries);
                console.log('✅ Loaded beneficiaries from cache:', parsed);
                setBeneficiaries(Array.isArray(parsed) ? parsed : []);
                setLoading(false);
                return;
              } catch (e) {
                console.error('Failed to parse cached beneficiaries');
              }
            }
            
            throw funderErr;
          }
        }
        
        // Extract beneficiaries from the response
        const beneficiariesData = response.data.beneficiaries || 
                                  response.data.data?.beneficiaries || 
                                  response.data.data?.dependents || 
                                  response.data.dependents || 
                                  response.data.data || 
                                  [];
        
        console.log('✅ Raw beneficiaries data:', beneficiariesData);
        console.log('📊 Number of beneficiaries:', beneficiariesData.length);
        
        // Log each beneficiary's structure
        beneficiariesData.forEach((b, idx) => {
          console.log(`👤 Beneficiary ${idx + 1}:`, {
            id: b.id,
            dependentId: b.dependentId,
            name: b.name || b.firstName,
            accountNumber: b.accountNumber,
            hasAccounts: !!b.Accounts,
            accountsCount: b.Accounts?.length || 0
          });
        });
        
        setBeneficiaries(beneficiariesData);
        
        // Cache for future use
        safeLocalStorage.setItem('beneficiaries', JSON.stringify(beneficiariesData));
        safeLocalStorage.setItem('funder_beneficiaries', JSON.stringify(beneficiariesData));
      } catch (err) {
        console.error('❌ Failed to fetch beneficiaries:', err);
        console.error('❌ Error response:', err.response?.data);
        showAlert(err.response?.data?.message || 'Failed to fetch beneficiaries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch wallet balance with real API
    const fetchWalletBalance = async () => {
      const userRole = safeLocalStorage.getItem('userRole');
      let currentBalance = 0;
      
      if (userRole === 'funder') {
        const token = safeLocalStorage.getItem('token');
        
        // Try to get fresh balance from API first
        if (token) {
          try {
            const response = await fetch('https://nanacaring-backend.onrender.com/api/funder/deposit/account', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              currentBalance = data.data.rawBalance;
              // Update localStorage with fresh balance
              safeLocalStorage.setItem('funderMainBalance', currentBalance.toString());
            } else {
              throw new Error('Failed to fetch balance from API');
            }
          } catch (e) {
            console.warn('Failed to fetch fresh balance from API:', e);
            
            // Fallback to cached balance
            const funderMainBalance = safeLocalStorage.getItem('funderMainBalance');
            if (funderMainBalance) {
              currentBalance = parseFloat(funderMainBalance);
            } else {
              try {
                const loginResponse = JSON.parse(safeLocalStorage.getItem('loginResponse') || '{}');
                if (loginResponse.balance) {
                  currentBalance = parseFloat(loginResponse.balance);
                } else if (loginResponse.accounts?.length > 0) {
                  currentBalance = parseFloat(loginResponse.accounts[0].balance);
                }
              } catch (e) {
                console.warn('Error parsing login response', e);
              }
            }
          }
        } else {
          // No token, use cached data
          const funderMainBalance = safeLocalStorage.getItem('funderMainBalance');
          if (funderMainBalance) {
            currentBalance = parseFloat(funderMainBalance);
          } else {
            try {
              const loginResponse = JSON.parse(safeLocalStorage.getItem('loginResponse') || '{}');
              if (loginResponse.balance) {
                currentBalance = parseFloat(loginResponse.balance);
              } else if (loginResponse.accounts?.length > 0) {
                currentBalance = parseFloat(loginResponse.accounts[0].balance);
              }
            } catch (e) {
              console.warn('Error parsing login response', e);
            }
          }
        }
      }
      
      setWalletBalance(currentBalance);
    };

     useEffect(() => {
        fetchBeneficiaries();
        fetchWalletBalance();
      }, []);
    

  // Find selected beneficiary object
  const selectedBeneficiary = beneficiaries.find(b => String(b.id) === beneficiary);

  // Store selected beneficiary data in localStorage for reliable access
  useEffect(() => {
    if (beneficiary && selectedBeneficiary) {
      console.log('🔍 Beneficiary dropdown value:', beneficiary);
      console.log('📋 All beneficiaries:', beneficiaries);
      console.log('✅ Selected beneficiary object:', selectedBeneficiary);
      
      // Store the complete beneficiary object in localStorage
      safeLocalStorage.setItem('selectedBeneficiary', JSON.stringify(selectedBeneficiary));
      safeLocalStorage.setItem('selectedBeneficiaryId', String(selectedBeneficiary.id));
      
      console.log('💾 Stored beneficiary ID in localStorage:', selectedBeneficiary.id);
    }
  }, [beneficiary, beneficiaries, selectedBeneficiary]);

  const closePopup = () => {
    setShowPopup(false);
    setMessage('');
  };

  // Handle wallet-based transfer using real API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // 1. Validate inputs
      console.log('🚀 Starting transfer validation...');
      console.log('📝 Selected beneficiary state value:', beneficiary);
      console.log('📦 Selected beneficiary object:', selectedBeneficiary);
      console.log('📊 All beneficiaries:', beneficiaries);
      
      if (!beneficiary) {
        throw new Error('Please select a beneficiary.');
      }
      
      if (!selectedBeneficiary) {
        console.error('❌ Could not find beneficiary with ID:', beneficiary);
        console.error('📋 Available beneficiaries:', beneficiaries.map(b => ({ id: b.id, name: b.firstName || b.name })));
        throw new Error('Selected beneficiary not found. Please try selecting again.');
      }
      
      // Log the complete structure
      console.log('🔍 DEBUG - Complete beneficiary object:', JSON.stringify(selectedBeneficiary, null, 2));
      console.log('🔑 Available keys in beneficiary:', Object.keys(selectedBeneficiary));
      console.log('🆔 beneficiary.id:', selectedBeneficiary.id, '(type:', typeof selectedBeneficiary.id, ')');
      
      if (!amount || Number(amount) <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      const token = safeLocalStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // 2. Get current wallet balance from backend
      const balanceResponse = await fetch('https://nanacaring-backend.onrender.com/api/funder/deposit/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let currentBalance = 0;
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        currentBalance = balanceData.data.rawBalance;
        // Update localStorage with fresh balance
        safeLocalStorage.setItem('funderMainBalance', currentBalance.toString());
      } else {
        // Fallback to cached balance
        const funderMainBalance = safeLocalStorage.getItem('funderMainBalance');
        if (funderMainBalance) {
          currentBalance = parseFloat(funderMainBalance);
        } else {
          throw new Error('Unable to verify account balance. Please try again.');
        }
      }

      // 3. Check sufficient funds
      if (currentBalance < Number(amount)) {
        throw new Error(`Insufficient wallet balance. You have R${currentBalance.toFixed(2)} but need R${Number(amount).toFixed(2)}. Please deposit funds first.`);
      }

      // 4. Get beneficiary details and account information for transfer
      let beneficiaryName = selectedBeneficiary.firstName || selectedBeneficiary.name || '';
      let beneficiaryId = selectedBeneficiary.id;
      
      // Find the account number from Accounts array
      let accountNumber = null;
      if (Array.isArray(selectedBeneficiary.Accounts) && selectedBeneficiary.Accounts.length > 0) {
        const mainAcc = selectedBeneficiary.Accounts.find(
          acc => (acc.accountType && acc.accountType.toLowerCase() === 'main') ||
                  (acc.accountName && acc.accountName.toLowerCase() === 'main')
        );
        if (mainAcc && mainAcc.accountNumber) {
          accountNumber = mainAcc.accountNumber;
        }
      }

      console.log('🔍 Selected beneficiary:', selectedBeneficiary);
      console.log('📋 Beneficiary Accounts:', selectedBeneficiary.Accounts);
      console.log('🆔 Beneficiary ID:', beneficiaryId);
      console.log('🔢 Account Number:', accountNumber);

      // Validate we have all required data
      if (!beneficiaryId) {
        throw new Error('Beneficiary ID is missing. Please try selecting the beneficiary again.');
      }
      
      if (!accountNumber) {
        throw new Error(`${beneficiaryName} does not have a Main Account. Please contact support.`);
      }

      // 5. Create transfer request with all required fields
      const transferData = {
        beneficiaryId: typeof beneficiaryId === 'string' ? parseInt(beneficiaryId, 10) : beneficiaryId,
        accountNumber: accountNumber,
        amount: Number(amount),
        description: `Transfer to ${beneficiaryName} (Main Account)`
      };

      console.log('📤 Transfer Request:', transferData);
      console.log('📤 Transfer Request JSON:', JSON.stringify(transferData, null, 2));
      console.log('📤 beneficiaryId type:', typeof transferData.beneficiaryId, 'value:', transferData.beneficiaryId);
      console.log('📤 accountNumber type:', typeof transferData.accountNumber, 'value:', transferData.accountNumber);

      const transferResponse = await fetch('https://nanacaring-backend.onrender.com/api/funder/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transferData)
      });

      console.log('📡 Transfer response status:', transferResponse.status);
      console.log('📡 Transfer response headers:', Object.fromEntries(transferResponse.headers.entries()));

      // Get the response text first to see what's actually being returned
      const responseText = await transferResponse.text();
      console.log('📄 Raw response text:', responseText);

      let transferResult = null;
      let backendError = '';
      try {
        transferResult = responseText ? JSON.parse(responseText) : null;
        console.log('📤 Transfer response:', transferResult);
      } catch (jsonErr) {
        backendError = `Server error: ${responseText || 'Unable to parse response.'}`;
        console.error('❌ JSON parse error:', jsonErr);
        console.error('❌ Response was:', responseText);
      }

      if (!transferResponse.ok) {
        // Show backend error message if available
        console.error('❌ Transfer failed with status:', transferResponse.status);
        console.error('❌ Backend error:', transferResult);
        
        let errorMsg = 'Transfer failed.';
        
        if (transferResult) {
          if (transferResult.message) {
            errorMsg = transferResult.message;
          }
          if (transferResult.error) {
            errorMsg += ` (${transferResult.error})`;
          }
          if (transferResult.details) {
            errorMsg += `\n\nDetails: ${JSON.stringify(transferResult.details)}`;
          }
        } else {
          errorMsg = backendError || 'Transfer failed (server error).';
        }
        
        // Add helpful message for validation errors
        if (transferResult?.error === 'Validation error') {
          errorMsg += '\n\nThis is a backend validation issue. The backend may not be configured to accept UUID account IDs. Please contact the administrator.';
        }
        
        throw new Error(errorMsg);
      }

      // 6. Update local balance with new balance from response
      const newBalance = transferResult.data.funder.newBalance;
      safeLocalStorage.setItem('funderMainBalance', newBalance.toString());

      // 7. Show success message
      setMessage(
        `🎉 Transfer successful!\n\n` +
        `Amount: R${transferResult.data.amount.toFixed(2)}\n` +
        `To: ${beneficiaryName} (Main Account)\n` +
        `Reference: ${transferResult.data.transferReference}\n` +
        `Your new balance: R${newBalance.toFixed(2)}`
      );
      setPopupType('success');
      setShowPopup(true);
      
      // Reset form
      setAmount('');
      setBeneficiary('');
      setAccountType('Main Account');

    } catch (err) {
      // Show backend error message if available
      let errorMessage = err.message || 'Transfer failed. Please check your details and try again.';
      setMessage(errorMessage);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormSection>
        <FormHeader>
          <FormTitle>Send Money</FormTitle>
          <FormSubtitle>Transfer funds from your wallet to your beneficiaries instantly</FormSubtitle>
        </FormHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="beneficiary-select">Beneficiary name</label>
            <select
              id="beneficiary-select"
              name="beneficiary"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              required
            >
              <option value="">Select</option>
              {beneficiaries.length === 0 && (
                <option value="" disabled>
                  {loading ? 'Loading beneficiaries...' : 'No beneficiaries found'}
                </option>
              )}
              {beneficiaries.map((b, idx) => {
                // Debug: Log each beneficiary's structure
                console.log(`📝 Beneficiary ${idx + 1} in dropdown:`, {
                  id: b.id,
                  name: b.firstName || b.name,
                  hasId: !!b.id,
                  allKeys: Object.keys(b)
                });
                
                return (
                  <option key={`${b.id || idx}-${idx}`} value={String(b.id || '')}>
                    {b.firstName || b.name || 'Unknown'} {b.middleName ? b.middleName : ''} {b.lastName || ''}
                  </option>
                );
              })}
            </select>
            {beneficiaries.length === 0 && !loading && (
              <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                No beneficiaries available. Please add a beneficiary first.
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <label>From (Payment Source)</label>
            <PaymentMethodSection>
              <PaymentMethodTitle>Your Wallet</PaymentMethodTitle>
              <AccountCard selected={true}>
                <AccountInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '25px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #185c37, #22c55e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      NANA
                    </div>
                    <div>
                      <AccountName>
                        Main Account Wallet
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '10px', 
                          background: '#185c37', 
                          color: 'white', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          PRIMARY
                        </span>
                      </AccountName>
                      <AccountType>
                        Available Balance: {(() => {
                          const userRole = safeLocalStorage.getItem('userRole');
                          if (userRole === 'funder') {
                            const funderMainBalance = safeLocalStorage.getItem('funderMainBalance');
                            if (funderMainBalance) {
                              return `R${parseFloat(funderMainBalance).toFixed(2)}`;
                            }
                            
                            try {
                              const loginResponse = JSON.parse(safeLocalStorage.getItem('loginResponse') || '{}');
                              if (loginResponse.balance) {
                                return `R${parseFloat(loginResponse.balance).toFixed(2)}`;
                              } else if (loginResponse.accounts?.length > 0) {
                                return `R${parseFloat(loginResponse.accounts[0].balance).toFixed(2)}`;
                              }
                            } catch (e) {
                              console.warn('Error parsing login response', e);
                            }
                          }
                          return 'R0.00';
                        })()}
                      </AccountType>
                    </div>
                  </div>
                  <div style={{ 
                    color: '#22c55e', 
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                </AccountInfo>
              </AccountCard>
              
              {/* Low balance warning */}
              {(() => {
                const userRole = safeLocalStorage.getItem('userRole');
                let currentBalance = 0;
                
                if (userRole === 'funder') {
                  const funderMainBalance = safeLocalStorage.getItem('funderMainBalance');
                  if (funderMainBalance) {
                    currentBalance = parseFloat(funderMainBalance);
                  } else {
                    try {
                      const loginResponse = JSON.parse(safeLocalStorage.getItem('loginResponse') || '{}');
                      if (loginResponse.balance) {
                        currentBalance = parseFloat(loginResponse.balance);
                      } else if (loginResponse.accounts?.length > 0) {
                        currentBalance = parseFloat(loginResponse.accounts[0].balance);
                      }
                    } catch (e) {
                      console.warn('Error parsing login response', e);
                    }
                  }
                }
                
                if (currentBalance < parseFloat(amount || 0)) {
                  return (
                    <div style={{ 
                      marginTop: '8px',
                      padding: '12px', 
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#92400e'
                    }}>
                      <strong>Insufficient Balance!</strong><br />
                      You need R{parseFloat(amount || 0).toFixed(2)} but only have R{currentBalance.toFixed(2)} available. Please deposit funds first.
                    </div>
                  );
                }
                
                return null;
              })()}
            </PaymentMethodSection>
          </FormGroup>

          <FormGroup>
            <label>To</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Main Account">Main Account</option>
              <option value="Education" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Education
              </option>
              <option value="Healthcare" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Healthcare
              </option>
              <option value="Clothing" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Clothing
              </option>
              <option value="Entertainment" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Entertainment
              </option>
              <option value="Baby Care" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Baby Care
              </option>
              <option value="Pregnancy" disabled style={{ filter: 'blur(3px)', color: '#aaa' }}>
                Pregnancy
              </option>
            </select>
          </FormGroup>

          <WarningText>
            Please be advised that when you proceed now, you have made sure that the details are accurate.
          </WarningText>

          <AmountContainer>
            <label>Amount</label>
            <AmountField>
              <span>R</span>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))} />
            </AmountField>
          </AmountContainer>



        <PayButton type="submit" disabled={loading}>
          {loading ? 'Processing Transfer...' : 'Transfer from Wallet'}
        </PayButton>

          {message && <WarningText>{message}</WarningText>}
        </form>
      </FormSection>
      
      {showPopup && (
        <ModalOverlay onClick={closePopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupIcon $success={popupType === 'success'}>
              {popupType === 'success' ? '✅' : '❌'}
            </PopupIcon>
            <PopupTitle>
              {popupType === 'success' ? 'Success!' : 'Error'}
            </PopupTitle>
            <PopupMessage>{message}</PopupMessage>
            <PopupButton onClick={closePopup}>
              {popupType === 'success' ? 'Great!' : 'Try Again'}
            </PopupButton>
          </PopupContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SendMoney;
