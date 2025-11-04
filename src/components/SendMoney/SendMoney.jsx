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

// Available account types for direct transfers (matching backend)
const ACCOUNT_TYPES = [
  { value: 'Main', label: 'Main Account (Auto-Distribution)', isMain: true },
  { value: 'Healthcare', label: 'Healthcare & Medical', isMain: false },
  { value: 'Education', label: 'Education & Learning', isMain: false },
  { value: 'Groceries', label: 'Groceries & Food', isMain: false },
  { value: 'Transport', label: 'Transport & Travel', isMain: false },
  { value: 'Entertainment', label: 'Entertainment & Recreation', isMain: false },
  { value: 'Clothing', label: 'Clothing & Apparel', isMain: false },
  { value: 'Baby Care', label: 'Baby Care & Supplies', isMain: false },
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
      console.log('📋 Raw beneficiaries response:', result);
      
      // Backend returns { beneficiaries: [...] }
      const beneficiariesData = result.beneficiaries || [];
      
      console.log('📋 Loaded beneficiaries:', beneficiariesData);
      setBeneficiaries(beneficiariesData);
      
      // Cache beneficiaries with account info
      safeLocalStorage.setItem('beneficiaries_cache', JSON.stringify(beneficiariesData));
      
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
      console.log('🔄 Fetching balance from API...');
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
        
        // Backend returns { success: true, balance: number, currency: "ZAR", accountNumber: string }
        if (result.success && typeof result.balance === 'number') {
          const newBalance = result.balance;
          console.log('✅ Setting balance:', newBalance);
          setBalance(newBalance);
          safeLocalStorage.setItem('funderMainBalance', newBalance.toString());
          return;
        }
      }
      
      throw new Error('Balance API failed or returned invalid data');
    } catch (err) {
      console.error('Balance API failed:', err);
      
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

      if (!selectedAccountType) {
        throw new Error('Please select an account type');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const transferAmount = parseFloat(amount);

      if (balance < transferAmount) {
        throw new Error(`Insufficient funds. Available: R${balance.toFixed(2)}`);
      }

      // Find selected beneficiary with detailed logging
      console.log('🔍 Finding beneficiary with ID:', selectedBeneficiaryId, 'from list:', beneficiaries.map(b => ({id: b.id, name: b.name})));
      
      const beneficiary = beneficiaries.find(b => {
        const match = String(b.id) === selectedBeneficiaryId || 
                     b.id === parseInt(selectedBeneficiaryId, 10);
        console.log('🔍 Checking beneficiary:', {id: b.id, selectedId: selectedBeneficiaryId, match});
        return match;
      });
      
      if (!beneficiary) {
        console.error('❌ Beneficiary not found. Selected ID:', selectedBeneficiaryId, 'Available beneficiaries:', beneficiaries);
        throw new Error('Beneficiary not found. Please select a valid recipient.');
      }

      console.log('✅ Found beneficiary:', beneficiary);

      const token = safeLocalStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Validate beneficiary ID is a valid number
      const parsedBeneficiaryId = parseInt(beneficiary.id, 10);
      if (isNaN(parsedBeneficiaryId) || parsedBeneficiaryId <= 0) {
        console.error('❌ Invalid beneficiary ID format:', beneficiary.id, '- parsed as:', parsedBeneficiaryId);
        throw new Error('Invalid beneficiary ID. Please select a valid recipient.');
      }

      // Prepare transfer data using correct API structure (matching backend)
      const transferData = {
        beneficiaryUserId: parsedBeneficiaryId,  // Backend expects this field name
        accountType: selectedAccountType,        // Backend expects this field name
        amount: transferAmount,
        currency: 'ZAR',
        type: 'TRANSFER',                        // Required by backend - Transaction.type cannot be null
        description: `${selectedAccountType === 'Main' ? 'General support with auto-distribution' : `Direct ${selectedAccountType} support`} - ${beneficiary.name || 'Unknown'}`
      };

      console.log('📤 Final Transfer Request:', JSON.stringify(transferData, null, 2));

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
      console.log('📡 Backend response:', result);

      if (!response.ok) {
        console.error('❌ Transfer failed - Full response:', {
          status: response.status,
          statusText: response.statusText,
          result: result,
        });
        
        // Enhanced error handling based on backend response
        if (result.message) {
          throw new Error(result.message);
        }
        
        // Handle HTTP status codes
        if (response.status === 400) {
          throw new Error('Bad request - please check your input data');
        }
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. You may not have permission for this operation.');
        }
        
        if (response.status === 404) {
          throw new Error('Service not found. The transfer endpoint may not be available.');
        }
        
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(`Transfer failed (HTTP ${response.status})`);
      }

      // Backend returns: { message: "Transfer completed successfully with smart distribution", transferDetails: {...} }
      setTransferResult(result.transferDetails || result);

      // Update balance (since backend doesn't return new balance, fetch it)
      await fetchBalance();

      // Show success popup based on transfer type
      if (selectedAccountType === 'Main') {
        // Main account transfer success message
        setPopupMessage(
          `R${transferAmount.toFixed(2)} sent successfully!\n\nSmart distribution activated\nFunds distributed across spending categories with 20% emergency fund`
        );
      } else {
        // Direct transfer success message  
        setPopupMessage(
          `R${transferAmount.toFixed(2)} sent to ${String(beneficiary.name || 'Beneficiary')}\n\n${String(selectedAccountType)} account funded successfully`
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

  // Helper function to get distribution preview - FIXED PERCENTAGES
  const getDistributionPreview = () => {
    if (selectedAccountType !== 'Main' || !amount || parseFloat(amount) <= 0) {
      return null;
    }
    
    const transferAmount = parseFloat(amount);
    
    // Use correct distribution percentages as per backend (80% distributed, 20% emergency fund)
    const emergencyFund = transferAmount * 0.20; // 20% emergency fund
    const totalForDistribution = transferAmount * 0.80; // 80% distributed
    
    // Distribution percentages from the backend (of the 80% distribution amount)
    const distributionPattern = [
      { category: 'Healthcare', percentage: 25, amount: (totalForDistribution * 0.25).toFixed(2) },
      { category: 'Groceries', percentage: 20, amount: (totalForDistribution * 0.20).toFixed(2) },
      { category: 'Education', percentage: 20, amount: (totalForDistribution * 0.20).toFixed(2) },
      { category: 'Transport', percentage: 10, amount: (totalForDistribution * 0.10).toFixed(2) },
      { category: 'Pregnancy', percentage: 10, amount: (totalForDistribution * 0.10).toFixed(2) },
      { category: 'Entertainment', percentage: 5, amount: (totalForDistribution * 0.05).toFixed(2) },
      { category: 'Clothing', percentage: 5, amount: (totalForDistribution * 0.05).toFixed(2) },
      { category: 'Baby Care', percentage: 5, amount: (totalForDistribution * 0.05).toFixed(2) }
    ];
    
    // Add emergency fund allocation at the top
    const distributionWithEmergency = [
      { category: 'Emergency Fund', percentage: 20, amount: emergencyFund.toFixed(2), isEmergency: true },
      ...distributionPattern
    ];
    
    return distributionWithEmergency;
  };

  const selectedBeneficiary = beneficiaries.find(b => String(b.id) === selectedBeneficiaryId);
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
                <option key={b.id} value={String(b.id)}>
                  {b.name}
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
                🧠 Smart Distribution: 20% → Emergency Fund, 80% → Auto-allocated across spending categories by priority.
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
                💡 Smart Distribution Preview
                <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>
                  (How R{amount} will be allocated)
                </span>
              </DistributionTitle>
              {distributionPreview.map((item, index) => (
                <DistributionItem key={index} style={{ 
                  backgroundColor: item.isEmergency ? '#fff3cd' : 'transparent',
                  borderLeft: item.isEmergency ? '3px solid #856404' : 'none',
                  paddingLeft: item.isEmergency ? '8px' : '0'
                }}>
                  <DistributionCategory style={{ 
                    fontWeight: item.isEmergency ? '700' : '500',
                    color: item.isEmergency ? '#856404' : '#64748b'
                  }}>
                    {item.isEmergency && '🚨 '}{item.category}
                  </DistributionCategory>
                  <DistributionAmount style={{ 
                    color: item.isEmergency ? '#856404' : '#185c37'
                  }}>
                    R{item.amount} ({item.percentage}% of transfer)
                  </DistributionAmount>
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
              <>Send R{amount || '0'} with Smart Distribution</>
            ) : (
              <>Send R{amount || '0'} to {selectedAccountType}</>
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

            {/* Compact Success Details */}
            {popupType === 'success' && (
              <SuccessDetails>
                <SuccessGrid>
                  <SuccessItem>
                    <SuccessLabel>Amount</SuccessLabel>
                    <SuccessValue>R{Number(amount || 0).toFixed(2)}</SuccessValue>
                  </SuccessItem>
                  <SuccessItem>
                    <SuccessLabel>Target Account</SuccessLabel>
                    <SuccessValue>{(transferResult && transferResult.targetAccount) || selectedAccountType}</SuccessValue>
                  </SuccessItem>
                </SuccessGrid>
                
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                    Beneficiary ID: {transferResult.beneficiaryId || selectedBeneficiaryId}
                  </div>
                  {selectedAccountType === 'Main' && (
                    <div style={{ color: '#64748b', fontSize: '11px' }}>
                      🧠 Smart distribution activated with emergency fund
                    </div>
                  )}
                </div>
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