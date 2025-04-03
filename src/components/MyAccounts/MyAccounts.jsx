import React, { useState } from 'react';
import styled from 'styled-components';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import Header from '../Header/Header';

const Container = styled.div`
  display: flex;
  width: 80%;
  background-color: white;
  position: relative;
  flex-direction: column;
  height: 90vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;



const Content = styled.div`
  padding: 10px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
  max-width: 1200px;
`;

const FormSection = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  width: 70%;
  align-self: center;
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

const AccountsTable = styled.div`
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
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

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, bankName: 'FNB', accountNumber: '1213 2322 4353 3421' },
    { id: 2, bankName: 'Capitec', accountNumber: '1213 2322 4353 3421' }
  ]);

  return (
    <Container>
    
      <Content>
        <FormSection>
          <Form>
            <FormGroup>
              <label>Name on card</label>
              <input type="text" />
            </FormGroup>
            <FormGroup>
              <label>Card number</label>
              <input type="text" />
            </FormGroup>
            <FormGroup>
              <label>Account number</label>
              <input type="text" />
            </FormGroup>
            <FormGroup>
              <label>Expiry date</label>
              <select>
                <option>DD/MM/YEAR</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>CCV</label>
              <input type="text" />
            </FormGroup>
            <AddButton>Add new account</AddButton>
          </Form>
        </FormSection>

        <AccountsTable>
          <h4>My Accounts</h4>
          <Table>
            <thead>
              <tr>
                <th>Bank name</th>
                <th>Account number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  <td>{account.bankName}</td>
                  <td>{account.accountNumber}</td>
                  <td>
                    <ActionButton>
                      <img src={editIcon} alt="Edit" />
                    </ActionButton>
                    <ActionButton>
                      <img src={deleteIcon} alt="Delete" />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AccountsTable>
      </Content>
    </Container>
  );
};

export default MyAccounts;