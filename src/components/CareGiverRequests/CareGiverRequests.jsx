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
  width: 100%;
  max-width: 800px; /* Limit maximum width */
  min-height: calc(100vh - 80px); /* Account for header */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
  margin-top: -30px; /* Move content below header */ 
`;

const Card = styled.div`
  background: #f7faf7;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 24px;
  width: 100%;
  max-width: 540px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormTitle = styled.h2`
  color: #2a7a4a;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  flex: 0 0 120px;
  color: #2a7a4a;
  font-size: 12px;
  font-weight: 500;
`;

const Select = styled.select`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #fff;
  font-size: 12px;
  margin-left: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #fff;
  font-size: 12px;
  margin-left: 10px;
`;

const ReasonRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const ReasonInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #fff;
  font-size: 12px;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  width: 100%;
  max-width: 700px;
  height: 400px; /* Fixed height for scrolling */
  margin-top: 24px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  thead {
    position: sticky;
    top: 0;
    background: #f3f7f1;
    z-index: 1;
  }
`;

const Th = styled.th`
  background: #f3f7f1;
  color: #222;
  font-weight: 500;
  padding: 6px 4px;
  text-align: left;
`;

const Td = styled.td`
  padding: 0px 2px;
  border-top: 1px solid #f0f0f0;
  color: #333;
`;

const StatusCell = styled(Td)`
  color: ${props => {
    switch (props.status) {
      case 'Approved': return '#2a7a4a';
      case 'Declined': return '#dc3545';
      case 'Pending': return '#ffc107';
      default: return '#333';
    }
  }};
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #888;
`;

const Page = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: #f7faf7;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 250px); /* Account for sidebar */
  margin-left: auto;
  margin-top: 80px; /* Move content below header */
  background: #f7faf7;
`;

const CareGiverRequests = () => {
  const [beneficiary, setBeneficiary] = useState('Choose beneficiary');
  const [account, setAccount] = useState('Choose Account');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  return (
    <MainContent>
      <Container>
        <Card>
          <FormTitle>Who are you requesting for?</FormTitle>
          <FormRow>
            <Label>Beneficiary:</Label>
            <Select value={beneficiary} onChange={e => setBeneficiary(e.target.value)}>
              {beneficiaries.map(b => <option key={b}>{b}</option>)}
            </Select>
          </FormRow>
          <FormRow>
            <Label>Account:</Label>
            <Select value={account} onChange={e => setAccount(e.target.value)}>
              {accounts.map(a => <option key={a}>{a}</option>)}
            </Select>
          </FormRow>
          <FormRow>
            <Label>Amount:</Label>
            <Input type="number" placeholder="R" value={amount} onChange={e => setAmount(e.target.value)} />
          </FormRow>
          <div style={{ color: '#2a7a4a', fontSize: 13, marginBottom: 6, marginTop: 10 }}>
            Please provide a reason of request below
          </div>
          <FormRow>
            <Label>Reason:</Label>
            <Input
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <SendButton title="Send">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 20l18-8-18-8v7l13 1-13 1v7z" fill="#2a7a4a"/></svg>
            </SendButton>
          </FormRow>
        </Card>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Reason</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {mockRequests.map((req, idx) => (
                <tr key={idx}>
                  <Td>{req.name}</Td>
                  <Td>{req.reason}</Td>
                  <Td>{new Date(req.date).toLocaleDateString()}</Td>
                  <StatusCell status={req.status}>{req.status}</StatusCell>
                  <Td>
                    <ActionButton title="More">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="5" cy="12" r="2" fill="#888"/>
                        <circle cx="12" cy="12" r="2" fill="#888"/>
                        <circle cx="19" cy="12" r="2" fill="#888"/>
                      </svg>
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </MainContent>
  );
};

export default CareGiverRequests;