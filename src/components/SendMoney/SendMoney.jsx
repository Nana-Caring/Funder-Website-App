import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Available account types for direct transfers (aligned with backend cleanup)
const ACCOUNT_TYPES = [
  { value: 'Main', label: 'Main Account', isMain: true },
  { value: 'Healthcare', label: 'Healthcare & Medical', isMain: false },
  { value: 'Education', label: 'Education & Learning', isMain: false },
  { value: 'Clothing', label: 'Clothing & Apparel', isMain: false },
  { value: 'Baby Care', label: 'Baby Care & Supplies', isMain: false },
  { value: 'Entertainment', label: 'Entertainment & Recreation', isMain: false },
  { value: 'Pregnancy', label: 'Pregnancy & Maternity', isMain: false }
];

const Container = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 20px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  
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
`;

const FormHeader = styled.div`
  margin-bottom: 16px;
  text-align: center;
`;

const FormTitle = styled.h2`
  margin: 0 0 6px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  select, input {
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 13px;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #185c37;
      box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
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

const WalletCard = styled.div`
  background: white;
  border: 2px solid #185c37;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(24, 92, 55, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(24, 92, 55, 0.15);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #185c37, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(24, 92, 55, 0.3);
`;

const WalletDetails = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const WalletBalance = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  
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
    font-weight: 500;
  }
`;

const PayButton = styled.button`
  width: 100%;
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
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #22c55e, #185c37);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DistributionPreview = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`;

const DistributionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DistributionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 12px;
  color: #64748b;
  
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const DistributionCategory = styled.span`
  font-weight: 500;
`;

const DistributionAmount = styled.span`
  font-weight: 600;
  color: #185c37;
`;

const SuccessDetails = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  font-size: 12px;
`;

const SuccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const SuccessItem = styled.div`
  background: white;
  padding: 8px;
  border-radius: 6px;
  border-left: 3px solid #22c55e;
`;

const SuccessLabel = styled.div`
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
`;

const SuccessValue = styled.div`
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
  margin-top: 2px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 13px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 8px 0;
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

const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  max-width: 380px;
  width: 90%;
  text-align: center;
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
  white-space: pre-line;
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
  
  &:hover {
    background: linear-gradient(135deg, #22c55e, #185c37);
  }
`;

const SendMoney = () => {
  // State management
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('Main');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [transferResult, setTransferResult] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    loadBeneficiaries();
    fetchBalance();
    
    // Also try to load cached balance immediately for better UX
    const cachedBalance = safeLocalStorage.getItem('funderMainBalance');
    if (cachedBalance && !isNaN(parseFloat(cachedBalance))) {
      console.log('🏦 Loading cached balance on mount:', parseFloat(cachedBalance));
      setBalance(parseFloat(cachedBalance));
    }
  }, []);

  const loadBeneficiaries = async () => {
    const token = safeLocalStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(
        'https://nanacaring-backend.onrender.com/api/funder/beneficiaries',
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load beneficiaries: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load beneficiaries');
      }

      const data = result.data || [];
      setBeneficiaries(data);
      
      // Cache beneficiaries with account info
      safeLocalStorage.setItem('beneficiaries_cache', JSON.stringify(data));
      
      console.log('✅ Loaded beneficiaries:', data.length);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
      
      // Try loading from cache
      const cached = safeLocalStorage.getItem('beneficiaries_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setBeneficiaries(parsed);
          console.log('✅ Loaded from cache:', parsed.length);
        } catch (e) {
          console.error('Cache parse error');
        }
      }
    }
  };

  const fetchBalance = async () => {
    const token = safeLocalStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    try {
      console.log('🔄 Fetching balance from new API...');
      const response = await fetch(
        'https://nanacaring-backend.onrender.com/api/funder/balance',
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('💰 Balance API Response:', result);
        
        if (result.success && result.data && typeof result.data.balance === 'number') {
          const newBalance = result.data.balance;
          console.log('✅ Setting balance:', newBalance);
          setBalance(newBalance);
          safeLocalStorage.setItem('funderMainBalance', newBalance.toString());
          return;
        }
      }
      
      throw new Error('New API failed or returned invalid data');
    } catch (err) {
      console.warn('New balance API failed, trying fallback:', err.message);
      
      // Fallback to old endpoint for backward compatibility
      try {
        console.log('🔄 Trying fallback balance API...');
        const response = await fetch(
          'https://nanacaring-backend.onrender.com/api/funder/deposit/account',
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('💰 Fallback Balance API Response:', data);
          
          if (data.data && typeof data.data.rawBalance === 'number') {
            const newBalance = data.data.rawBalance;
            console.log('✅ Setting fallback balance:', newBalance);
            setBalance(newBalance);
            safeLocalStorage.setItem('funderMainBalance', newBalance.toString());
            return;
          }
        }
        
        throw new Error('Fallback API also failed');
      } catch (fallbackErr) {
        console.error('All balance APIs failed:', fallbackErr);
        
        // Use cached balance as last resort
        const cached = safeLocalStorage.getItem('funderMainBalance');
        if (cached && !isNaN(parseFloat(cached))) {
          const cachedBalance = parseFloat(cached);
          console.log('📱 Using cached balance:', cachedBalance);
          setBalance(cachedBalance);
        } else {
          console.error('No valid cached balance found');
          setBalance(0); // Default to 0 if nothing else works
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTransferResult(null);

    try {
      // Validate inputs
      if (!selectedBeneficiaryId) {
        throw new Error('Please select a beneficiary');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!selectedAccountType) {
        throw new Error('Please select an account type');
      }

      const transferAmount = parseFloat(amount);

      if (balance < transferAmount) {
        throw new Error(`Insufficient funds. Available: R${balance.toFixed(2)}`);
      }

      // Find selected beneficiary
      const beneficiary = beneficiaries.find(b => String(b.userId) === selectedBeneficiaryId);
      
      if (!beneficiary) {
        throw new Error('Beneficiary not found');
      }

      const token = safeLocalStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Prepare transfer data using new API structure
      const transferData = {
        beneficiaryUserId: parseInt(beneficiary.userId, 10),
        accountType: selectedAccountType,
        amount: transferAmount,
        currency: 'ZAR',
        description: `${selectedAccountType === 'Main' ? 'General support with auto-distribution' : `Direct ${selectedAccountType} support`} - ${beneficiary.name}`
      };

      console.log('📤 New API Transfer request:', JSON.stringify(transferData, null, 2));

      // Make transfer request using new API endpoint
      const response = await fetch(
        'https://nanacaring-backend.onrender.com/api/funder/transfer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(transferData)
        }
      );

      const result = await response.json();
      
      console.log('📡 New API Backend response:', result);

      if (!response.ok || !result.success) {
        console.error('❌ Transfer failed:', result);
        
        // Handle specific error types
        if (result.errors) {
          const errorMessages = result.errors.map(err => `${err.field}: ${err.message}`).join('\n');
          throw new Error(`Validation failed:\n${errorMessages}`);
        }
        
        if (result.message === 'Insufficient funds') {
          throw new Error(`Insufficient funds. Available: R${result.data?.availableBalance || balance}, Requested: R${result.data?.requestedAmount || transferAmount}`);
        }

        if (result.message === 'You are not authorized to transfer to this beneficiary') {
          throw new Error('You are not authorized to transfer to this beneficiary. Please contact support.');
        }
        
        const errorMsg = result.message || 'Transfer failed';
        throw new Error(errorMsg);
      }

      // Store transfer result for display
      setTransferResult(result.data);

      // Update balance
      const newBalance = result.data.funder.newBalance;
      setBalance(newBalance);
      safeLocalStorage.setItem('funderMainBalance', newBalance.toString());

      // Show success popup with enhanced details
      if (result.data.autoDistribution) {
        // Main account transfer success message
        const distributionText = result.data.autoDistribution.categories
          .filter(cat => cat.amount > 0)
          .map(cat => `• ${cat.category}: R${cat.amount} (${cat.percentage}%)`)
          .join('\n');
        
        setPopupMessage(
          `Transfer Successful!\n\nR${transferAmount.toFixed(2)} sent to ${beneficiary.name}'s Main Account\n\nFunds allocated to:\n${distributionText}\n\nReference: ${result.data.transferReference}`
        );
      } else {
        // Direct transfer success message
        setPopupMessage(
          `Transfer Successful!\n\nR${transferAmount.toFixed(2)} sent to ${beneficiary.name}'s ${selectedAccountType}\n\nNew ${selectedAccountType} Balance: R${result.data.beneficiary.newBalance.toFixed(2)}\n\nReference: ${result.data.transferReference}`
        );
      }
      
      setPopupType('success');
      setShowPopup(true);

      // Reset form
      setAmount('');
      setSelectedBeneficiaryId('');
      setSelectedAccountType('Main');

    } catch (err) {
      console.error('Transfer error:', err);
      setError(err.message);
      setPopupMessage(err.message);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get distribution preview
  const getDistributionPreview = () => {
    if (selectedAccountType !== 'Main' || !amount || parseFloat(amount) <= 0) {
      return null;
    }
    
    const transferAmount = parseFloat(amount);
    
    // Distribution percentages aligned with backend (matches cleanup summary)
    const distributionPattern = [
      { category: 'Healthcare', percentage: 25 },
      { category: 'Education', percentage: 20 },
      { category: 'Clothing', percentage: 20 },
      { category: 'Baby Care', percentage: 15 },
      { category: 'Entertainment', percentage: 10 },
      { category: 'Pregnancy', percentage: 10 }
    ];
    
    return distributionPattern.map(item => ({
      ...item,
      amount: (transferAmount * item.percentage / 100).toFixed(2)
    }));
  };

  const selectedBeneficiary = beneficiaries.find(b => String(b.userId) === selectedBeneficiaryId);
  const distributionPreview = getDistributionPreview();

  return (
    <Container>
      <FormSection>
        <FormHeader>
          <FormTitle>Transfer Funds</FormTitle>
          <FormSubtitle>Send money to your dependents with smart distribution or targeted category funding</FormSubtitle>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          {/* Beneficiary Selection */}
          <FormGroup>
            <label>Select Recipient</label>
            <select
              value={selectedBeneficiaryId}
              onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
              required
            >
              <option value="">Choose a beneficiary...</option>
              {beneficiaries.map((b) => (
                <option key={b.userId} value={String(b.userId)}>
                  {b.name} {b.relationship ? `(${b.relationship})` : ''}
                </option>
              ))}
            </select>
          </FormGroup>

          {/* From Account */}
          <FormGroup>
            <label>From Account</label>
            <WalletCard>
              <WalletInfo>
                <WalletIcon>NANA</WalletIcon>
                <div>
                  <WalletDetails>Primary Funder Account</WalletDetails>
                  <WalletBalance>Available Balance: R{balance.toFixed(2)}</WalletBalance>
                </div>
              </WalletInfo>
              <span style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
            </WalletCard>
          </FormGroup>

          {/* Transfer Type Selection */}
          <FormGroup>
            <label>Transfer Destination</label>
            <select
              value={selectedAccountType}
              onChange={(e) => setSelectedAccountType(e.target.value)}
              required
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedAccountType === 'Main' && (
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                Funds will be automatically allocated across multiple spending categories based on priority.
              </div>
            )}
          </FormGroup>

          {/* Amount Section */}
          <FormGroup>
            <label>Transfer Amount</label>
            
            {/* Amount Input */}
            <AmountField>
              <span>ZAR</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </AmountField>
          </FormGroup>

          {/* Distribution Preview for Main Account */}
          {distributionPreview && (
            <DistributionPreview>
              <DistributionTitle>
                Allocation Preview
                <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>
                  (Estimated distribution)
                </span>
              </DistributionTitle>
              {distributionPreview.map((item, index) => (
                <DistributionItem key={index}>
                  <DistributionCategory>{item.category}</DistributionCategory>
                  <DistributionAmount>R{item.amount} ({item.percentage}%)</DistributionAmount>
                </DistributionItem>
              ))}
            </DistributionPreview>
          )}

          {/* Error Display */}
          {error && <ErrorText>{error}</ErrorText>}

          {/* Submit Button */}
          <PayButton type="submit" disabled={loading || !selectedBeneficiaryId || !amount || parseFloat(amount) <= 0}>
            {loading ? (
              <>Processing Transfer...</>
            ) : selectedAccountType === 'Main' ? (
              <>Transfer to Main Account</>
            ) : (
              <>Transfer to {selectedAccountType}</>
            )}
          </PayButton>
        </form>
      </FormSection>

      {/* Success/Error Popup */}
      {showPopup && (
        <ModalOverlay onClick={() => setShowPopup(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupIcon $success={popupType === 'success'}>
              {popupType === 'success' ? '✓' : '✗'}
            </PopupIcon>
            <PopupTitle>
              {popupType === 'success' ? 'Transfer Successful!' : 'Transfer Failed'}
            </PopupTitle>
            <PopupMessage>{popupMessage}</PopupMessage>

            {/* Enhanced Success Details */}
            {popupType === 'success' && transferResult && (
              <SuccessDetails>
                <SuccessGrid>
                  <SuccessItem>
                    <SuccessLabel>Amount Sent</SuccessLabel>
                    <SuccessValue>R{transferResult.amount} {transferResult.currency}</SuccessValue>
                  </SuccessItem>
                  <SuccessItem>
                    <SuccessLabel>New Balance</SuccessLabel>
                    <SuccessValue>R{transferResult.funder.newBalance}</SuccessValue>
                  </SuccessItem>
                  <SuccessItem>
                    <SuccessLabel>Account Type</SuccessLabel>
                    <SuccessValue>{transferResult.targetAccountType}</SuccessValue>
                  </SuccessItem>
                  <SuccessItem>
                    <SuccessLabel>Reference</SuccessLabel>
                    <SuccessValue style={{ fontSize: '10px' }}>{transferResult.transferReference}</SuccessValue>
                  </SuccessItem>
                </SuccessGrid>
                
                {transferResult.autoDistribution && (
                  <div style={{ marginTop: '12px', fontSize: '11px' }}>
                    <strong>🧠 Auto-Distribution Summary:</strong><br/>
                    Total Distributed: R{transferResult.autoDistribution.totalDistributed} of R{transferResult.autoDistribution.totalAmount}<br/>
                    Categories Updated: {transferResult.autoDistribution.categories.filter(c => c.amount > 0).length}
                  </div>
                )}
              </SuccessDetails>
            )}

            <PopupButton onClick={() => setShowPopup(false)}>
              {popupType === 'success' ? 'Complete' : 'Try Again'}
            </PopupButton>
          </PopupContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SendMoney;
