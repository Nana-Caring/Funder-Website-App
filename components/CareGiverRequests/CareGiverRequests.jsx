import React, { useState } from 'react';
import styled from 'styled-components';

const beneficiaries = ['Choose beneficiary', 'Pulane Thando Malumane', 'Other'];
const accounts = ['Choose Account', 'Savings Account', 'Medication Account'];

const mockRequests = [
  { name: 'Pulane Thando Malumane', reason: 'Healthcare - Monthly Medication', status: 'Approved', date: '2024-05-01' },
  { name: 'Pulane Thando Malumane', reason: 'Clothing - Winter Uniform', status: 'Declined', date: '2024-04-28' },
  { name: 'Pulane Thando Malumane', reason: 'Education - School Fees', status: 'Pending', date: '2024-04-25' },
  { name: 'Pulane Thando Malumane', reason: 'Healthcare - Dentist Visit', status: 'Approved', date: '2024-04-20' },
  { name: 'Pulane Thando Malumane', reason: 'Entertainment - School Trip', status: 'Pending', date: '2024-04-15' },
  { name: 'Pulane Thando Malumane', reason: 'Healthcare - Eye Check', status: 'Approved', date: '2024-04-10' },
  { name: 'Pulane Thando Malumane', reason: 'Education - Study Materials', status: 'Approved', date: '2024-04-05' },
  { name: 'Pulane Thando Malumane', reason: 'Clothing - Sports Kit', status: 'Declined', date: '2024-04-01' },
  { name: 'Pulane Thando Malumane', reason: 'Healthcare - Pharmacy', status: 'Approved', date: '2024-03-28' },
  { name: 'Pulane Thando Malumane', reason: 'Education - Extra Classes', status: 'Pending', date: '2024-03-25' },
  { name: 'Pulane Thando Malumane', reason: 'Entertainment - Birthday', status: 'Approved', date: '2024-03-20' },
  { name: 'Pulane Thando Malumane', reason: 'Healthcare - Checkup', status: 'Approved', date: '2024-03-15' },
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
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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

const CancelButton = styled.button`
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: 12px;
  
  &:hover {
    background: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #185c37, #1e6b42);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
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

const FormTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: white;
  
  &:focus {
    border-color: #185c37;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  
  &:focus {
    border-color: #185c37;
  }

  &::placeholder {
    color: #999;
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

const StatusCell = styled.span`
  color: ${props => {
    switch (props.status) {
      case 'Approved': return '#185c37';
      case 'Declined': return '#dc3545';
      case 'Pending': return '#ffc107';
      default: return '#333';
    }
  }};
  font-weight: 600;
  font-size: 11.5px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s;
  
  &:hover {
    background: #f0f0f0;
  }
  
  svg {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const CareGiverRequests = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);

  const handleOpenModal = () => {
    setShowFormModal(true);
    setBeneficiary('');
    setAccount('');
    setAmount('');
    setReason('');
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setBeneficiary('');
    setAccount('');
    setAmount('');
    setReason('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ beneficiary, account, amount, reason });
    handleCloseModal();
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
            Requests
          </h3>
          <AddButton onClick={handleOpenModal}>
            <span style={{ fontSize: '16px' }}>+</span>
            New Request
          </AddButton>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockRequests.map((req, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#222' }}>
                      {req.name}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: '#333' }}>
                      {req.reason}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: '#666' }}>
                      {new Date(req.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <StatusCell status={req.status}>{req.status}</StatusCell>
                  </td>
                  <td>
                    <ActionButton title="More">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="5" cy="12" r="2" fill="#888"/>
                        <circle cx="12" cy="12" r="2" fill="#888"/>
                        <circle cx="19" cy="12" r="2" fill="#888"/>
                      </svg>
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <FormTitle>Who are you requesting for?</FormTitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Beneficiary: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                <Select 
                  value={beneficiary} 
                  onChange={e => setBeneficiary(e.target.value)}
                  required
                >
                  <option value="">Choose beneficiary</option>
                  {beneficiaries.slice(1).map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Account: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                <Select 
                  value={account} 
                  onChange={e => setAccount(e.target.value)}
                  required
                >
                  <option value="">Choose Account</option>
                  {accounts.slice(1).map(a => <option key={a} value={a}>{a}</option>)}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Amount: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                <Input 
                  type="number" 
                  placeholder="Enter amount in Rands" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Reason: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                <Input
                  placeholder="Please provide a reason for this request"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                />
              </FormGroup>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginTop: '24px', 
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Send Request
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 20l18-8-18-8v7l13 1-13 1v7z" fill="currentColor"/>
                  </svg>
                </SubmitButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CareGiverRequests;