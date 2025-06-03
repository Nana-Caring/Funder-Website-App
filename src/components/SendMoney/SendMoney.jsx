import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FormSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
 
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-align: center;
  }

  select, input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
    background: white;
  }

  select {
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='black' d='M7 10l5 5 5-5H7z'/></svg>") no-repeat right 10px center;
    background-size: 16px;
    padding-right: 40px;
  }
`;

const WarningText = styled.p`
  color: red;
  font-size: 12px;
  text-align: left;
`;

const AmountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100px;

  span {
    font-weight: bold;
    margin-right: 4px;
  }

  input {
    border: none;
    font-size: 14px;
    width: 100%;
    outline: none;
    text-align: right;
  }
`;

const PayButton = styled.button`
  background-color: black;
  color: white;
  padding: 8px 35px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover {
    background-color: #333;
  }
`;

const SendMoney = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('5000');

  return (
    <Container>
      <FormSection>
        <FormGroup>
          <label>Beneficiary name</label>
          <select value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)}>
            <option value="">Select</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>From</label>
          <input type="text" value="Nana Account" readOnly />
        </FormGroup>

        <FormGroup>
          <label>To</label>
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option value="">Select</option>
            <option value="Baby Care Account">Baby Care Account</option>
            <option value="Savings Account">Savings Account</option>
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

        <PayButton type="submit">Pay</PayButton>
      </FormSection>
    </Container>
  );
};

export default SendMoney;
