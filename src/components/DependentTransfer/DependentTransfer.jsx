import React, { useState } from 'react';
import styled from 'styled-components';
import { KeyboardArrowDown } from '@mui/icons-material';
import cardBg from '../../assets/card.jpg';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  padding: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const CardLogo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #cac8c8;
  font-family: 'Podkova', serif;
`;

const CardDetails = styled.div`
  position: relative;
  z-index: 2;
  text-align: left;
`;

const CardNumber = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
`;

const CardHolder = styled.div`
  font-size: 16px;
  opacity: 0.8;
  margin-top: 5px;
`;

const TransferContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 560px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 18px;
`;

const Select = styled.div`
  position: relative;
  background: #f8f8f8;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;

  &:hover {
    background: #f0f0f0;
  }
`;

const ToLabel = styled.div`
  text-align: center;
  color: #999;
  margin: 5px 0;
  font-size: 14px;
`;

const AmountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
  flex-wrap: wrap;
`;

const AmountInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 300px;

  label {
    color: #666;
    font-size: 14px;
    white-space: nowrap;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #000;
    }
  }
`;

const TransferButton = styled.button`
  padding: 13px 20px;
  background: transparent;
  color: #4CAF50;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: underline;
  text-decoration-color: #4CAF50;
  text-underline-offset: 4px;

  &:hover {
    color: #45a049;
    text-decoration-color: #45a049;
  }
`;

const DependentTransfer = () => {
  const [amount, setAmount] = useState('');
  return (
    <Container>
      <Card>
        
        <CardDetails>
          <CardHolder>TM Thando MASHUMU</CardHolder>
          <CardNumber>4559 7822 2154</CardNumber>
        </CardDetails>
      </Card>

      <TransferContainer>
        <Title>Choose Account</Title>

        <Select>
          <span>Nana Savings Account</span>
          <KeyboardArrowDown fontSize="small" />
        </Select>

        <ToLabel>To</ToLabel>

        <Select>
          <span>Nana Education Account</span>
          <KeyboardArrowDown fontSize="small" />
        </Select>

        <AmountRow>
          <AmountInputGroup>
            <label>Amount</label>
            <input
              type="number"
              placeholder="R 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </AmountInputGroup>

          <TransferButton>Transfer</TransferButton>
        </AmountRow>
      </TransferContainer>
    </Container>
  );
};

export default DependentTransfer;

