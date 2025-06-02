import React, { useState } from 'react';
import styled from 'styled-components';
import { ExpandMore } from '@mui/icons-material';
import cardBg from '../../assets/card.jpg';

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
  position: relative;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;
`;

const Content = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const AccountCard = styled.div`
  background-color: #e0e0e0;
  padding: 16px 32px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 16px;
    font-weight: 400;
    color: #333;
  }
`;

const AccountNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  color: #666;
  font-size: 14px;
  white-space: nowrap;

  span {
    min-width: 120px;
    text-align: right;
  }
`;

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto 12px auto;
`;

const NanaCardShadow = styled.div`
  position: absolute;
  top: 35px;
  left: 40px;
  width: calc(100% + 30px);
  height: 197px;
  background-color: gray;
  border-radius: 15px;
  z-index: 0;
  filter: blur(1px);
`;

const NanaCard = styled.div`
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 16px;
  border-radius: 15px;
  aspect-ratio: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 150px;
  width: 100%;
  max-width: 380px;
  z-index: 1;

  .card-name {
    font-size: 18px;
    font-weight: bold;
    margin-left: 9px;
    margin-top: 4px;
    font-family: 'Podkova', serif;
    color: #CAC8C8;
  }
`;

const AccountsListWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 0 0 12px 0;
`;

const DependentMyAccounts = () => {
  const [accounts] = useState([
    { id: 1, name: 'Nana Baby Care Account', accountNumber: '44523...56655', balance: 'R500' },
    { id: 2, name: 'Nana Education Account', accountNumber: '44523...56655', balance: 'R1,000' },
    { id: 3, name: 'Nana Healthcare Account', accountNumber: '44523...56655', balance: 'R2,000' },
    { id: 4, name: 'Nana Clothing Account', accountNumber: '44523...56655', balance: 'R1,500' },
    { id: 5, name: 'Nana Entertainment Account', accountNumber: '44523...56655', balance: 'R800' }
  ]);

  return (
    <Container>
      <Content>
        <div style={{ fontSize: '16px', color: '#333', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '8px', width: '100%', maxWidth: '540px', textAlign: 'left', margin: '0 auto 8px auto' }}>Balance: R500</div>
        <NanaCardWrapper>
          <NanaCard>
            <div style={{ fontSize: '12px', marginTop: '4px', marginLeft: '9px', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>TM Thando MASHUMU</div>
            <div style={{ fontSize: '16px', marginTop: '4px', marginLeft: '9px', letterSpacing: '2px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>4554 7821 2154</div>
          </NanaCard>
        </NanaCardWrapper>
        <AccountsListWrapper>
          {accounts.map(account => (
            <AccountCard key={account.id} style={{ margin: account.id === 1 ? '12px 0 0 0' : '0' , background: account.id === 1 ? '#FD3E6E' : '#f7f7f7', color: account.id === 1 ? 'white' : '#333', boxShadow: account.id === 1 ? '0 2px 6px rgba(253,62,110,0.12)' : 'none', fontWeight: account.id === 1 ? 600 : 400 }}>
              <span style={{ fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{account.name}</span>
              <AccountNumber>
                <span>{account.accountNumber}</span>
                <span>{account.balance}</span>
                <ExpandMore style={{ color: account.id === 1 ? 'white' : '#333', marginLeft: '8px' }} />
              </AccountNumber>
            </AccountCard>
          ))}
        </AccountsListWrapper>
      </Content>
    </Container>
  );
};

export default DependentMyAccounts; 