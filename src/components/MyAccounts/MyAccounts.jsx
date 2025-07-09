import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import deleteIcon from '../../assets/icons/delete.png';
import Header from '../Header/Header';
import { paymentMethodService } from '../../services/paymentMethodService';

// Common bank names in South Africa
const COMMON_BANKS = [
  'Standard Bank',
  'First National Bank (FNB)',
  'Absa Bank',
  'Nedbank',
  'Capitec Bank',
  'Discovery Bank',
  'Investec',
  'African Bank',
  'Bidvest Bank',
  'TymeBank',
  'Bank Zero',
  'Mercantile Bank',
  'Sasfin Bank',
  'Grindrod Bank',
  'Access Bank South Africa',
  'Other'
];

const Container = styled.div`
  position: relative;
  margin-top: 40px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 100px);
`;

const Content = styled.div`
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 12px;
`;

const PageTitle = styled.h1`
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const FormSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
`;

const FormHeader = styled.div`
  margin-bottom: 16px;
  text-align: center;
`;

const FormTitle = styled.h3`
  margin: 0 0 6px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
    border: 2px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
    border-radius: 8px;
    font-size: 13px;
    background: white;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.hasError ? '#ef4444' : '#185c37'};
      box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(24, 92, 55, 0.1)'};
    }
    
    &:hover {
      border-color: ${props => props.hasError ? '#ef4444' : '#d1d5db'};
    }
  }

  select {
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='%23374151' d='M7 10l5 5 5-5H7z'/></svg>") no-repeat right 12px center;
    background-size: 16px;
    padding-right: 40px;
    cursor: pointer;
    
    option {
      color: #374151;
      background: white;
      padding: 8px;
    }
    
    option:first-child {
      color: #9ca3af;
      font-style: italic;
    }
  }
`;

const ValidationMessage = styled.div`
  font-size: 12px;
  color: ${props => props.type === 'error' ? '#ef4444' : '#22c55e'};
  margin-top: 2px;
  font-weight: 500;
`;

const CardTypeIndicator = styled.span`
  color: ${props => props.color || '#6b7280'};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const SubmitButton = styled.button`
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

const PaymentMethodsList = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 32px 24px 24px 24px;
  margin-top: 24px;
  margin-bottom: 32px;
  height: 480px; /* Fixed height for scroll effect */
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  .table-wrapper {
    flex: 1 1 auto;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    margin-top: 16px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    background: #fafbfc;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #bdbdbd;
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 11.5px; /* Further decreased font size for more rows */
    background: transparent;
    color: #222;
    letter-spacing: 0.01em;
  }

  thead {
    position: sticky;
    top: 0;
    background: #f5f7fa;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }

  th {
    padding: 7px 6px;
    color: #444;
    font-weight: 700;
    background: #f5f7fa;
    border-bottom: 2px solid #e0e0e0;
    text-align: left;
    font-size: 11.5px;
    letter-spacing: 0.02em;
  }

  td {
    padding: 7px 6px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    font-size: 11.5px;
    color: #333;
    vertical-align: middle;
    transition: background 0.15s;
  }

  tr {
    transition: background 0.15s;
    &:hover td {
      background: #f5f7fa;
    }
  }

  .action-btns button {
    background: none;
    border: none;
    padding: 4px;
    margin: 0 2px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;
    &:hover {
      background: #f0f0f0;
    }
  }

  .action-btns img {
    width: 22px;
    height: 22px;
    filter: grayscale(0.2) brightness(0.95);
    transition: filter 0.15s;
  }

  .action-btns button:hover img {
    filter: grayscale(0) brightness(1.2);
  }

  @media (max-width: 700px) {
    width: 100%;
    padding: 12px 2px 12px 2px;
    .table-wrapper {
      padding: 0;
    }
    th, td {
      padding: 10px 4px;
      font-size: 13px;
    }
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ListTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
`;

const PaymentMethodCard = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const PaymentMethodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PaymentMethodIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.cardType ? 
    paymentMethodService?.getCardBrandColor?.(props.cardType) || 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 
    'linear-gradient(135deg, #10b981, #059669)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const PaymentMethodDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PaymentMethodName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const PaymentMethodNumber = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const PaymentMethodType = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 500;
`;

const DefaultBadge = styled.span`
  background: linear-gradient(135deg, #185c37, #22c55e);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 6px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: scale(1.05);
  }

  img {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
  
  &:hover img {
    opacity: 1;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #185c37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px 16px;
  color: #64748b;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
  }
  
  p {
    margin: 0;
    font-size: 13px;
  }
`;

const AlertMessage = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  
  ${props => props.type === 'success' ? `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  ` : props.type === 'error' ? `
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  ` : `
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
  `}
`;

// Modal Components
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

const ModalHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: #64748b;
  font-size: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
`;

const AddCardButton = styled.button`
  background: linear-gradient(135deg, #185c37, #1e6b42);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  align-self: flex-start;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(24, 92, 55, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1e6b42, #185c37);
    box-shadow: 0 4px 12px rgba(24, 92, 55, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  background: #6b7280;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 0 auto;
  
  &:hover {
    background: #4b5563;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
`;

const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 75%)`;
};

const MyAccounts = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [cardFormData, setCardFormData] = useState({
    bankName: '',
    cardNumber: '',
    expiryDate: '',
    ccv: '',
    nickname: '',
    isDefault: false
  });

  // State for custom bank name when "Other" is selected
  const [customBankName, setCustomBankName] = useState('');

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [cardType, setCardType] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await paymentMethodService.getPaymentMethods();
      // Now using the cards array from API response
      setPaymentMethods(response.cards || []);
    } catch (error) {
      console.log('Payment methods endpoint not available, using empty state');
      // For development - if the endpoint doesn't exist, just show empty state
      setPaymentMethods([]);
      // Don't show error message for 404 since it's expected during development
      if (!error.message.includes('404') && !error.message.includes('Not Found')) {
        setMessage({ text: error.message || 'Failed to fetch cards', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;
    const newValidationErrors = { ...validationErrors };

    if (name === 'cardNumber') {
      // Remove all non-digit characters and limit to 19 characters
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.length <= 19) {
        formattedValue = paymentMethodService.formatCardNumberInput(cleanNumber);
        
        // Real-time validation and card type detection
        if (cleanNumber.length >= 13) {
          const validation = paymentMethodService.validateCardNumber(formattedValue);
          if (validation.isValid) {
            setCardType(validation.cardType);
            delete newValidationErrors.cardNumber;
          } else {
            newValidationErrors.cardNumber = validation.message;
          }
        } else {
          delete newValidationErrors.cardNumber;
          setCardType('');
        }
      } else {
        return; // Don't update if longer than 19 digits
      }
    } else if (name === 'expiryDate') {
      formattedValue = paymentMethodService.formatExpiryDateInput(value);
      
      // Real-time expiry validation
      if (formattedValue.length === 5) {
        const validation = paymentMethodService.validateExpiryDate(formattedValue);
        if (validation.isValid) {
          delete newValidationErrors.expiryDate;
        } else {
          newValidationErrors.expiryDate = validation.message;
        }
      } else {
        delete newValidationErrors.expiryDate;
      }
    } else if (name === 'ccv') {
      // Only allow digits and limit to 4 characters
      const cleanCcv = value.replace(/\D/g, '');
      if (cleanCcv.length <= 4) {
        formattedValue = cleanCcv;
        
        // Real-time CCV validation
        if (cleanCcv.length >= 3) {
          const validation = paymentMethodService.validateCCV(cleanCcv, cardType);
          if (validation.isValid) {
            delete newValidationErrors.ccv;
          } else {
            newValidationErrors.ccv = validation.message;
          }
        } else {
          delete newValidationErrors.ccv;
        }
      } else {
        return; // Don't update if longer than 4 digits
      }
    } else if (name === 'bankName') {
      // Handle "Other" option - clear custom bank name if a predefined bank is selected
      if (value !== 'Other') {
        setCustomBankName('');
      }
      
      // Validate bank name selection
      if (!value || value.trim().length === 0) {
        newValidationErrors.bankName = 'Please select a bank';
      } else {
        delete newValidationErrors.bankName;
      }
    } else if (name === 'nickname' && value.length > 50) {
      return; // Don't update if longer than 50 characters
    }

    setValidationErrors(newValidationErrors);
    setCardFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    // Enhanced validation with detailed error messages
    const cardValidation = paymentMethodService.validateCardNumber(cardFormData.cardNumber);
    if (!cardValidation.isValid) {
      setMessage({ text: cardValidation.message, type: 'error' });
      setSubmitting(false);
      return;
    }

    const expiryValidation = paymentMethodService.validateExpiryDate(cardFormData.expiryDate);
    if (!expiryValidation.isValid) {
      setMessage({ text: expiryValidation.message, type: 'error' });
      setSubmitting(false);
      return;
    }

    const ccvValidation = paymentMethodService.validateCCV(cardFormData.ccv, cardValidation.cardType);
    if (!ccvValidation.isValid) {
      setMessage({ text: ccvValidation.message, type: 'error' });
      setSubmitting(false);
      return;
    }

    // Validate required fields
    if (!cardFormData.bankName.trim()) {
      setMessage({ text: 'Please select a bank', type: 'error' });
      setSubmitting(false);
      return;
    }

    try {
      await paymentMethodService.addCard(cardFormData);
      setMessage({ text: 'Card added successfully!', type: 'success' });
      setCardFormData({
        bankName: '',
        cardNumber: '',
        expiryDate: '',
        ccv: '',
        nickname: '',
        isDefault: false
      });
      setValidationErrors({});
      setCardType('');
      setShowModal(false); // Close modal on success
      fetchPaymentMethods();
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        setMessage({ text: 'Backend endpoint not configured. Card functionality will be available when the backend is set up.', type: 'error' });
      } else {
        setMessage({ text: error.message || 'Failed to add card', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setMessage({ text: '', type: '' }); // Clear any existing messages
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset form when closing modal
    setCardFormData({
      bankName: '',
      cardNumber: '',
      expiryDate: '',
      ccv: '',
      nickname: '',
      isDefault: false
    });
    setValidationErrors({});
    setCardType('');
    setMessage({ text: '', type: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await paymentMethodService.deletePaymentMethod(id);
      setMessage({ text: 'Payment card deleted successfully!', type: 'success' });
      fetchPaymentMethods();
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        setMessage({ text: 'Backend endpoint not configured. Delete functionality will be available when the backend is set up.', type: 'error' });
      } else {
        setMessage({ text: error.message || 'Failed to delete card', type: 'error' });
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await paymentMethodService.setDefaultPaymentMethod(id);
      setMessage({ text: 'Default payment card updated!', type: 'success' });
      fetchPaymentMethods();
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        setMessage({ text: 'Backend endpoint not configured. Set default functionality will be available when the backend is set up.', type: 'error' });
      } else {
        setMessage({ text: error.message || 'Failed to update default card', type: 'error' });
      }
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Content>
      
          {message.text && (
            <AlertMessage type={message.type}>
              {message.text}
            </AlertMessage>
          )}

          <PaymentMethodsList>
            <ListHeader>
              <ListTitle>Your Payment Cards</ListTitle>
              <AddCardButton onClick={openModal}>
                <span>+</span>
                Add Card
              </AddCardButton>
            </ListHeader>
            
            <div className="table-wrapper">
              {loading ? (
                <LoadingSpinner />
              ) : paymentMethods.length === 0 ? (
                <EmptyState>
                  <h4>No payment cards added yet</h4>
                  <p>Add your first card above to get started</p>
                </EmptyState>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Card</th>
                      <th>Bank</th>
                      <th>Card Number</th>
                      <th>Expires</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((card) => {
                      const cardType = paymentMethodService.getCardType(card.cardNumber || card.accountNumber || '');
                      const avatarColor = getRandomPastelColor();
                      return (
                        <tr key={card.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Avatar color={avatarColor}>
                                💳
                              </Avatar>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '12px' }}>
                                  {card.nickname || 'Card'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: '600' }}>{card.bankName}</td>
                          <td>
                            {card.cardNumber || paymentMethodService.formatCardNumber(card.accountNumber || '')}
                          </td>
                          <td>{card.expiryDate}</td>
                          <td>
                            <span style={{ 
                              color: paymentMethodService.getCardBrandColor(cardType), 
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {cardType}
                            </span>
                          </td>
                          <td>
                            {card.isDefault ? (
                              <DefaultBadge>Default</DefaultBadge>
                            ) : (
                              <span style={{ color: '#666', fontSize: '11px' }}>-</span>
                            )}
                          </td>
                          <td>
                            <div className="action-btns">
                              {!card.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(card.id)}
                                  title="Set as default"
                                  style={{ fontSize: '16px' }}
                                >
                                  ⭐
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(card.id)}
                                title="Delete card"
                              >
                                <img src={deleteIcon} alt="Delete" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </PaymentMethodsList>
        </Content>
      </Container>

      {/* Add Card Modal */}
      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ModalHeader>
              <ModalTitle>Add Credit/Debit Card</ModalTitle>
            </ModalHeader>
            
            {message.text && (
              <AlertMessage type={message.type}>
                {message.text}
              </AlertMessage>
            )}
            
            <FormContainer onSubmit={handleCardSubmit}>
              <FormGroup hasError={validationErrors.bankName}>
                <label>Bank Name *</label>
                <select
                  name="bankName"
                  value={cardFormData.bankName}
                  onChange={handleCardFormChange}
                  required
                >
                  <option value="">Select your bank</option>
                  {COMMON_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                {validationErrors.bankName && (
                  <ValidationMessage type="error">{validationErrors.bankName}</ValidationMessage>
                )}
              </FormGroup>
              
              <FormGroup hasError={validationErrors.cardNumber}>
                <label>
                  Card Number *
                  {cardType && (
                    <CardTypeIndicator color={paymentMethodService.getCardBrandColor(cardType)}>
                      {cardType}
                    </CardTypeIndicator>
                  )}
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardFormData.cardNumber}
                  onChange={handleCardFormChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="23"
                  required
                />
                {validationErrors.cardNumber && (
                  <ValidationMessage type="error">{validationErrors.cardNumber}</ValidationMessage>
                )}
              </FormGroup>
              
              <FormRow>
                <FormGroup hasError={validationErrors.expiryDate}>
                  <label>Expiry Date (MM/YY) *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardFormData.expiryDate}
                    onChange={handleCardFormChange}
                    placeholder="12/25"
                    maxLength="5"
                    required
                  />
                  {validationErrors.expiryDate && (
                    <ValidationMessage type="error">{validationErrors.expiryDate}</ValidationMessage>
                  )}
                </FormGroup>
                
                <FormGroup hasError={validationErrors.ccv}>
                  <label>CCV *</label>
                  <input
                    type="text"
                    name="ccv"
                    value={cardFormData.ccv}
                    onChange={handleCardFormChange}
                    placeholder={cardType === 'American Express' ? '1234' : '123'}
                    maxLength="4"
                    required
                  />
                  {validationErrors.ccv && (
                    <ValidationMessage type="error">{validationErrors.ccv}</ValidationMessage>
                  )}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <label>Nickname (Optional)</label>
                <input
                  type="text"
                  name="nickname"
                  value={cardFormData.nickname}
                  onChange={handleCardFormChange}
                  placeholder="My Visa Card"
                  maxLength="50"
                />
              </FormGroup>
              
              <FormGroup>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={cardFormData.isDefault}
                    onChange={handleCardFormChange}
                    style={{ margin: 0 }}
                  />
                  Set as default payment method
                </label>
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <SubmitButton 
                  type="submit" 
                  disabled={submitting || Object.keys(validationErrors).length > 0}
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Adding...' : 'Add Card'}
                </SubmitButton>
                <CancelButton 
                  type="button" 
                  onClick={closeModal}
                >
                  Cancel
                </CancelButton>
              </div>
            </FormContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default MyAccounts;