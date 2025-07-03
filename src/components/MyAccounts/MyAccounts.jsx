import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import axios from 'axios';

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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddButton = styled.button`
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

const TableContainer = styled.div`
  width: 90%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 32px 24px 24px 24px;
  margin-top: 24px;
  margin-bottom: 32px;
  height: 480px;
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
    font-size: 11.5px;
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
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 400px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;

  label {
    font-size: 14px;
    color: #666;
    min-width: 100px;
  }

  input, select {
    flex: 1;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;


const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 12px 0;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    color: #333;
    
    &::placeholder {
      color: #999;
    }
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

const AccountsTable = styled.div`
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 300px;
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0 0 16px 0;
    color: #333;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 3px;
    text-align: left;
    line-height: 0.4;
  }

  td {
    border: 1px solid #ddd;
  }

  th {
    background: #f8f8f8;
    font-weight: 500;
    color: #666;
    border-bottom: 2px solid #ddd;
  }

  tbody tr:last-child td {
    border-bottom: 1px solid #ddd;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin: 0 4px;

  img {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  &:hover img {
    opacity: 1;
  }
`;

const FeedbackPopup = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &.success {
    background-color: #4CAF50;
    color: white;
  }

  &.error {
    background-color: #f44336;
    color: white;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 900;
`;

const ConfirmationPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
  text-align: center;

  h4 {
    margin: 0 0 16px 0;
    color: #333;
  }

  p {
    margin: 0 0 16px 0;
    color: #666;
    font-size: 14px;
  }

  .buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
`;

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    cardNumber: '',
    expiryDate: '',
    ccv: ''
  });

  // Helper function to get random pastel color
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 75%)`;
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account =>
    (account.card?.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit logic (only for metadata, not card details)
  const handleEdit = (account) => {
    setIsEditing(true);
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      cardNumber: '',
      expiryDate: '',
      ccv: ''
    });
    setShowFormModal(true);
  };

  const handleOpenModal = () => {
    setShowFormModal(true);
    setIsEditing(false);
    setEditingAccount(null);
    setFormData({
      bankName: '',
      accountNumber: '',
      cardNumber: '',
      expiryDate: '',
      ccv: ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAccount(null);
    setShowFormModal(false);
    setFormData({
      bankName: '',
      accountNumber: '',
      cardNumber: '',
      expiryDate: '',
      ccv: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Only allow editing metadata, not card details
    setAccounts(accounts.map(acc => 
      acc.id === editingAccount.id ? { ...editingAccount, ...formData } : acc
    ));
    setIsEditing(false);
    setEditingAccount(null);
    setShowFormModal(false);
    handleFeedback('success', 'Account updated successfully');
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    const newAccount = {
      id: Date.now(),
      bankName: formData.bankName,
      accountNumber: formData.accountNumber
    };
    setAccounts([...accounts, newAccount]);
    setShowFormModal(false);
    setFormData({
      bankName: '',
      accountNumber: '',
      cardNumber: '',
      expiryDate: '',
      ccv: ''
    });
    handleFeedback('success', 'Account added successfully');
  };

  const handleDeleteClick = (account) => {
    setDeletingAccount(account);
  };

  const handleConfirmDelete = () => {
    setAccounts(accounts.filter(acc => acc.id !== deletingAccount.id));
    handleFeedback('error', 'Card deleted successfully');
    setDeletingAccount(null);
  };

  const handleCancelDelete = () => {
    setDeletingAccount(null);
  };

  // Add feedback handler
  const handleFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <Container>
      <TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '800',
            color: '#222',
            margin: 0
          }}>
            My Accounts
          </h3>
          <AddButton onClick={handleOpenModal}>
            <span style={{ fontSize: '16px' }}>+</span>
            Add Account
          </AddButton>
        </div>
        
        <SearchBox>
          <input 
            type="text"
            placeholder="Search by bank name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Account Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: 'inherit', 
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      padding: '10px 6px',
                      borderRadius: '6px'
                    }}
                    onClick={() => handleEdit(account)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f8ff';
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 92, 55, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'inherit';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Avatar color={getRandomPastelColor()}>
                      {account.bankName.charAt(0)}
                    </Avatar>
                    <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#222' }}>
                      {account.bankName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 500, letterSpacing: '0.03em', color: '#185c37', fontSize: '11.5px' }}>
                      {account.accountNumber}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClick={() => setShowFormModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <FormContainer onSubmit={isEditing ? handleUpdate : handleAddAccount}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: '700',
                color: '#222',
                textAlign: 'center'
              }}>
                {isEditing ? 'Edit Account' : 'Add New Account'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    color: '#333', 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    required
                    style={{ 
                      width: '280px',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    color: '#333', 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    required
                    style={{ 
                      width: '280px',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    color: '#333', 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Enter card number"
                    style={{ 
                      width: '280px',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block',
                      color: '#333', 
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      style={{ 
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block',
                      color: '#333', 
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      CCV
                    </label>
                    <input
                      type="text"
                      name="ccv"
                      value={formData.ccv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      style={{ 
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: isEditing ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #185c37, #1e6b42)',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {isEditing ? 'Update Account' : 'Add Account'}
                </button>
              </div>
            </FormContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Add Feedback Popup */}
      {feedback && (
        <FeedbackPopup className={feedback.type}>
          {feedback.message}
        </FeedbackPopup>
      )}

      {/* Add Confirmation Popup */}
      {deletingAccount && (
        <>
          <Overlay onClick={handleCancelDelete} />
          <ConfirmationPopup>
            <h4>Delete Card</h4>
            <p>Are you sure you want to delete this card?</p>
            <p>This action cannot be undone.</p>
            <div className="buttons">
              <AddButton 
                onClick={handleCancelDelete}
                style={{ background: '#666' }}
              >
                Cancel
              </AddButton>
              <AddButton 
                onClick={handleConfirmDelete}
                style={{ background: '#f44336' }}
              >
                Delete
              </AddButton>
            </div>
          </ConfirmationPopup>
        </>
      )}
    </Container>
  );
};

export default MyAccounts;