import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';

const stripePromise = loadStripe('pk_test_51REGFbROeQRel9O58mOSulLZR25JiDCo0FqwlrhopxEUuFh68lZXNTKYDer8334RrTFGBvlsKdkPMFbvzLbaoA4X00OLIDpVtW');

const Container = styled.div`
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  height: calc(100vh - 80px);
`;

const FormSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 2px;
  }

  select, input {
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    background: white;
    transition: all 0.2s ease;
    box-sizing: border-box;
    
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
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    gap: 16px;
  }
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  min-width: 140px;
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
    font-size: 14px;
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
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(24, 92, 55, 0.3);
  width: 100%;
  margin-top: 8px;
  margin-bottom: 24px;
  z-index: 1;
  position: relative;
  
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
  
  &:active {
    transform: translateY(0);
  }
`;

const IconContainer = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
`;

const FormTitle = styled.h2`
  margin: 0 0 6px 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
`;

const CardElementContainer = styled.div`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #185c37;
    box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
  }
`;

const PaymentMethodSection = styled.div`
  padding: 12px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 6px;
`;

const PaymentMethodTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
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
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountName = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const AccountType = styled.div`
  font-size: 12px;
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

const MessageContainer = styled.div`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
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

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px) saturate(1.5);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(8px) saturate(1.5);
    }
  }
`;

const PopupContainer = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  padding: 16px;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  max-width: 280px;
  width: 80%;
  text-align: center;
  position: relative;
  backdrop-filter: blur(10px);
  animation: modernSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  @keyframes modernSlide {
    0% {
      opacity: 0;
      transform: scale(0.7) translateY(20px) rotateX(10deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0deg);
    }
  }
`;

const PopupIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${props => props.success ? 
    'linear-gradient(135deg, #22c55e, #16a34a)' : 
    'linear-gradient(135deg, #f87171, #ef4444)'
  };
  color: white;
  box-shadow: 
    0 8px 24px ${props => props.success ? 
      'rgba(34, 197, 94, 0.4)' : 
      'rgba(248, 113, 113, 0.4)'
    },
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: ${props => props.success ? 
      'linear-gradient(135deg, #22c55e, #16a34a)' : 
      'linear-gradient(135deg, #f87171, #ef4444)'
    };
    opacity: 0.2;
    z-index: -1;
  }
`;

const PopupTitle = styled.h3`
  margin: 0 0 4px 0;
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const PopupMessage = styled.p`
  margin: 0 0 14px 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.3;
  font-weight: 500;
`;

const PopupButton = styled.button`
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
  padding: 7px 18px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 70px;
  box-shadow: 
    0 4px 14px rgba(30, 41, 59, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #334155, #475569);
    transform: translateY(-1px) scale(1.02);
    box-shadow: 
      0 6px 20px rgba(30, 41, 59, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
      
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0) scale(1);
    transition: all 0.1s;
  }
`;

const SendMoney = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accountType, setAccountType] = useState('Main Account');
  const [amount, setAmount] = useState('5000');
  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch beneficiaries from backend
  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/funder/get-beneficiaries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBeneficiaries(response.data.beneficiaries || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/stripe/payment-methods',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAccounts(res.data.paymentMethods || []);
      } catch (err) {
        setMessage('Failed to load payment methods.');
      }
    };
    fetchAccounts();
    fetchBeneficiaries();
  }, []);

  // Find selected beneficiary object
  const selectedBeneficiary = beneficiaries.find(b => String(b.id) === beneficiary);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!selectedBeneficiary || !selectedBeneficiary.accountNumber) {
      setMessage('Please select a valid beneficiary.');
      setLoading(false);
      return;
    }
    if (!account) {
      setMessage('Please select a card.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Send paymentMethodId to backend
      const res = await axios.post(
        'http://localhost:5000/api/stripe/create-payment-intent',
        {
          amount: Number(amount),
          accountNumber: selectedBeneficiary.accountNumber,
          accountType,
          paymentMethodId: account // This is the Stripe payment method ID
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setMessage('🎉 Payment successful!');
      } else {
        setMessage(res.data.message || 'Payment failed.');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormSection>
        <FormHeader>
          <FormTitle>Send Money</FormTitle>
          <FormSubtitle>Transfer funds to your beneficiaries</FormSubtitle>
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

          <PayButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Pay'}
          </PayButton>

          {message && <WarningText>{message}</WarningText>}
        </form>
      </FormSection>
      
      {showPopup && (
        <PopupOverlay onClick={closePopup}>
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
        </PopupOverlay>
      )}
    </Container>
  );
};

export default SendMoney;
