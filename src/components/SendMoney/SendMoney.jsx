import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { paymentMethodService } from '../../services/paymentMethodService';

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
  
  ${props => props.success ? `
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
  background: ${props => props.success ? 
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
  const [amount, setAmount] = useState('5000');
  const [account, setAccount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(''); // Add this line
  const [accounts, setAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
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
        const token = localStorage.getItem('token');
        const response = await axios.get('https://nanacaring-backend.onrender.com/api/funder/get-beneficiaries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
          setBeneficiaries(response.data.beneficiaries || []);
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to fetch beneficiaries');
      } finally {
        setLoading(false);
      }
    };

    // Fetch payment cards from backend
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const response = await paymentMethodService.getPaymentMethods();
        console.log('Payment methods response:', response);
        
        // Extract cards from the API response
        const cards = response.cards || [];
        setPaymentMethods(cards);
        
        // Convert cards to accounts format for the UI
        const formattedAccounts = cards.map(card => ({
          id: card.id,
          name: card.nickname || `${card.bankName} Card`,
          bankName: card.bankName,
          type: paymentMethodService.getCardType(card.cardNumber || ''),
          cardNumber: card.cardNumber,
          expiryDate: card.expiryDate,
          isDefault: card.isDefault,
          isActive: card.isActive
        }));
        
        setAccounts(formattedAccounts);
        
        // Auto-select default card if available
        const defaultCard = formattedAccounts.find(card => card.isDefault);
        if (defaultCard && !selectedAccount) {
          setSelectedAccount(defaultCard.id);
        }
        
      } catch (err) {
        console.error('Error fetching payment cards:', err);
        showAlert('Failed to fetch payment cards. Please add a payment method first.');
      } finally {
        setLoading(false);
      }
    };

     useEffect(() => {
        fetchBeneficiaries();
        fetchPaymentMethods();
      }, []);
    

  // Find selected beneficiary object
  const selectedBeneficiary = beneficiaries.find(b => String(b.id) === beneficiary);

  const closePopup = () => {
    setShowPopup(false);
    setMessage('');
  };

  // Update your handleSubmit to show the popup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!selectedBeneficiary || !selectedBeneficiary.accountNumber) {
      setMessage('Please select a valid beneficiary.');
      setPopupType('error');
      setShowPopup(true);
      setLoading(false);
      return;
    }
    if (!account) {
      setMessage('Please select a card.');
      setPopupType('error');
      setShowPopup(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://nanacaring-backend.onrender.com/api/stripe/create-payment-intent',
        {
          amount: Number(amount),
          accountNumber: selectedBeneficiary.accountNumber,
          accountType,
          paymentMethodId: account
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        setMessage('🎉 Payment successful!');
        setPopupType('success');
        setShowPopup(true);
      } else {
        setMessage(res.data.message || 'Payment failed.');
        setPopupType('error');
        setShowPopup(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Payment failed.');
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
          <FormSubtitle>Transfer funds to your beneficiaries using your payment cards</FormSubtitle>
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
              {beneficiaries.map((b, idx) => (
                <option key={`${b.id}-${idx}`} value={String(b.id)}>
                  {b.firstName} {b.middleName ? b.middleName : ''}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup style={{ position: 'relative' }}>
            <label>From</label>
            <div style={{ position: 'relative' }}>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                style={{ paddingLeft: 40 }}
              >
                <option value="">Select a card</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.card?.brand?.toUpperCase()} •••• {acc.card?.last4} (exp {acc.card?.exp_month}/{acc.card?.exp_year})
                  </option>
                ))}
              </select>
              {/* Mastercard SVG Icon (optional) */}
              <span style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="9" r="7" fill="#EB001B"/>
                  <circle cx="18" cy="9" r="7" fill="#F79E1B"/>
                  <circle cx="14" cy="9" r="7" fill="#FF5F00"/>
                </svg>
              </span>
            </div>
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

        <FormGroup>
          <label>Payment Method</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
            style={{ 
              padding: '12px 14px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <option value="">Select a payment card</option>
            {accounts.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} • {card.type} • ****{card.cardNumber ? card.cardNumber.slice(-4) : '****'}
                {card.isDefault ? ' (Default)' : ''}
              </option>
            ))}
          </select>
          
          {accounts.length === 0 && (
            <div style={{ 
              marginTop: '8px',
              padding: '12px', 
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#92400e'
            }}>
              <strong>No payment cards found.</strong><br />
              Please add a payment card in My Accounts first to make transfers.
            </div>
          )}
          
          {selectedAccount && (
            <PaymentMethodSection style={{ marginTop: '12px' }}>
              <PaymentMethodTitle>Selected Payment Method</PaymentMethodTitle>
              {(() => {
                const selectedCard = accounts.find(card => card.id === selectedAccount);
                if (!selectedCard) return null;
                
                return (
                  <AccountCard selected={true}>
                    <AccountInfo>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '25px',
                          borderRadius: '4px',
                          background: paymentMethodService.getCardBrandColor(selectedCard.type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {selectedCard.type.substring(0, 4).toUpperCase()}
                        </div>
                        <div>
                          <AccountName>
                            {selectedCard.name}
                            {selectedCard.isDefault && (
                              <span style={{ 
                                marginLeft: '8px', 
                                fontSize: '10px', 
                                background: '#185c37', 
                                color: 'white', 
                                padding: '2px 6px', 
                                borderRadius: '4px' 
                              }}>
                                DEFAULT
                              </span>
                            )}
                          </AccountName>
                          <AccountType>
                            {selectedCard.bankName} • {selectedCard.type} • 
                            ****{selectedCard.cardNumber ? selectedCard.cardNumber.slice(-4) : '****'} • 
                            Exp: {selectedCard.expiryDate}
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
                );
              })()}
            </PaymentMethodSection>
          )}
        </FormGroup>

        <PayButton type="submit" disabled={loading || !selectedAccount}>
          {loading ? 'Processing...' : 'Transfer Money'}
        </PayButton>

          {message && <WarningText>{message}</WarningText>}
        </form>
      </FormSection>
      
      {showPopup && (
        <ModalOverlay onClick={closePopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupIcon success={popupType === 'success'}>
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
