import React, { useState } from 'react';
import styled from 'styled-components';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import Header from '../Header/Header';

const Container = styled.div`
  display: flex;
  width: calc(100% - 250px); /* Account for sidebar */
  margin-left: auto;
  flex-direction: column;
  height: calc(100vh - 80px); /* Account for header */
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 80px; /* Add space for header */
`;



const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px; /* Reduced from 1200px for better readability */
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

const AddButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-end;

  &:hover {
    background: #333;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 16px;

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

const AccountsTable = styled.div`
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 300px; /* Fixed height */
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0 0 16px 0;
    color: #333;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
    
    /* Custom scrollbar styling */
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
  const [accounts, setAccounts] = useState([
    { id: 1, bankName: 'FNB', accountNumber: '1213 2322 4353 3421' },
    { id: 2, bankName: 'Capitec', accountNumber: '1213 2322 4353 3421' },
    { id: 3, bankName: 'Standard Bank', accountNumber: '1213 2322 4353 3421' },
    { id: 4, bankName: 'Nedbank', accountNumber: '1213 2322 4353 3421' },
    { id: 5, bankName: 'ABSA', accountNumber: '1213 2322 4353 3421' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account =>
    account.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (account) => {
    setIsEditing(true);
    setEditingAccount(account);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setAccounts(accounts.map(acc => 
      acc.id === editingAccount.id ? editingAccount : acc
    ));
    setIsEditing(false);
    setEditingAccount(null);
    handleFeedback('success', 'Account updated successfully');
  };

  const handleDeleteClick = (account) => {
    setDeletingAccount(account);
  };

  const handleConfirmDelete = () => {
    setAccounts(accounts.filter(acc => acc.id !== deletingAccount.id));
    handleFeedback('error', 'Account deleted successfully');
    setDeletingAccount(null);
  };

  const handleCancelDelete = () => {
    setDeletingAccount(null);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    // Add your new account logic here
    handleFeedback('success', 'Account added successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAccount(null);
  };

  // Add feedback handler
  const handleFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000); // Hide after 3 seconds
  };

  return (
    <Container>
      <Content>
        <FormSection>
          <Form onSubmit={isEditing ? handleUpdate : handleAddAccount}>
            <h4>{isEditing ? 'Edit Account' : 'Add New Account'}</h4>
            <FormGroup>
              <label>Name on card *</label>
              <input 
                type="text"
                required
                value={isEditing ? editingAccount.bankName : ''}
                onChange={(e) => isEditing && setEditingAccount({
                  ...editingAccount,
                  bankName: e.target.value
                })}
              />
            </FormGroup>
            <FormGroup>
              <label>Card number</label>
              <input 
                type="text"
                value={isEditing ? editingAccount.accountNumber : ''}
                onChange={(e) => isEditing && setEditingAccount({
                  ...editingAccount,
                  accountNumber: e.target.value
                })}
              />
            </FormGroup>
            <FormGroup>
              <label>Account number *</label>
              <input 
                type="text"
                required
                pattern="\d{10,}"
                title="Please enter at least 10 digits"
              />
            </FormGroup>
            <FormGroup>
              <label>Expiry date *</label>
              <select required>
                <option value="">Select expiry date</option>
                {/* Add your date options here */}
              </select>
            </FormGroup>
            <FormGroup>
              <label>CCV *</label>
              <input 
                type="text"
                required
                pattern="\d{3,4}"
                maxLength="4"
                title="Please enter 3 or 4 digits"
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {isEditing ? (
                <>
                  <AddButton type="submit" style={{ background: '#4CAF50' }}>
                    Update Account
                  </AddButton>
                  <AddButton type="button" onClick={handleCancel} style={{ background: '#f44336' }}>
                    Cancel
                  </AddButton>
                </>
              ) : (
                <AddButton type="submit">Add new account</AddButton>
              )}
            </div>
          </Form>
        </FormSection>

        <AccountsTable>
          <h4>My Accounts</h4>
          <SearchBox>
            <input 
              type="text" 
              placeholder="Search by bank name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <div className="table-container">
            <Table>
              <thead>
                <tr>
                  <th>Bank name</th>
                  <th>Account number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(account => (
                  <tr key={account.id}>
                    <td>{account.bankName}</td>
                    <td>{account.accountNumber}</td>
                    <td>
                      <ActionButton onClick={() => handleEdit(account)}>
                        <img src={editIcon} alt="Edit" />
                      </ActionButton>
                      <ActionButton onClick={() => handleDeleteClick(account)}>
                        <img src={deleteIcon} alt="Delete" />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </AccountsTable>
      </Content>

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
            <h4>Delete Account</h4>
            <p>Are you sure you want to delete the account from {deletingAccount.bankName}?</p>
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