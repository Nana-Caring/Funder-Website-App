import React, { useState } from 'react';
import styled from 'styled-components';

const accounts = [
  { color: '#a084ee', label: 'Baby Care Account', percent: 0 },
  { color: '#3b82f6', label: 'Entertainment Account', percent: 0 },
  { color: '#ffb84c', label: 'Healthcare Account', percent: 0 },
  { color: '#4ade80', label: 'Education Account', percent: 0 },
];

const transactions = [
  {
    date: '08 May 2024',
    category: 'Healthcare',
    location: 'Panado Clicks Protea Glen',
    amount: '-R500.00',
    color: '#ffb84c',
  },
  {
    date: '08 May 2024',
    category: 'Entertainment',
    location: 'Playstation 6 Game Mall of Africa',
    amount: '-R5000.00',
    color: '#3b82f6',
  },
  {
    date: '07 May 2024',
    category: 'Entertainment',
    location: 'Playstation 6 Game Mall of Africa',
    amount: '-R5000.00',
    color: '#3b82f6',
  },
];

const mockTransactions = {
  lastMonth: [
    {
      date: '15 Apr 2024',
      category: 'Baby Care',
      location: 'Baby City Sandton',
      amount: '-R1200.00',
      color: '#a084ee',
    },
    {
      date: '12 Apr 2024',
      category: 'Education',
      location: 'School Fees Payment',
      amount: '-R2500.00',
      color: '#4ade80',
    },
    {
      date: '10 Apr 2024',
      category: 'Healthcare',
      location: 'Dischem Pharmacy',
      amount: '-R350.00',
      color: '#ffb84c',
    },
  ],
  currentMonth: transactions,
  future: [
    {
      date: '15 Jun 2024',
      category: 'Education',
      location: 'Upcoming School Fees',
      amount: '-R2500.00',
      color: '#4ade80',
    },
    {
      date: '12 Jun 2024',
      category: 'Healthcare',
      location: 'Scheduled Dentist Visit',
      amount: '-R800.00',
      color: '#ffb84c',
    },
  ],
};

const Container = styled.div`
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
`;

const StackedProgressContainer = styled.div`
  display: flex;
  height: 16px;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
`;

const Segment = styled.div`
  height: 100%;
  background-color: ${props => props.color};
  width: 25%;
`;

const LegendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #444;
`;

const ColorDotLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const SectionTitle = styled.div`
  background-color: #d4e9d7;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  padding-bottom: 4px;
`;

const ActiveTab = styled.span`
  color: #c1126b;
  border-bottom: 3px solid #c1126b;
`;

const TransactionItem = styled.div`
  margin: 16px 0 8px;
`;

const DateLabel = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

const TransactionCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TransactionDetails = styled.div`
  font-size: 14px;
  color: #333;
  margin-top: 4px;
`;

const Amount = styled.div`
  color: #c1126b;
  font-weight: bold;
`;

const TransactionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 12px;
  padding-right: 8px;

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
`;

const TabButton = styled.span`
  cursor: pointer;
  padding: 4px 8px;
  color: ${props => (props.active ? '#c1126b' : '#666')};
  border-bottom: ${props => (props.active ? '3px solid #c1126b' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    color: #c1126b;
  }
`;

const CareGiverExpenses = () => {
  const [activeTab, setActiveTab] = useState('currentMonth');

  const tabTitles = {
    lastMonth: 'Last Month',
    currentMonth: 'Current Month',
    future: 'Future',
  };

  const getTabTotal = transactions => {
    return transactions
      .reduce((total, tx) => {
        const amount = parseFloat(tx.amount.replace('R', '').replace(',', ''));
        return total + Math.abs(amount);
      }, 0)
      .toFixed(2);
  };

  return (
    <Container>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <img src="/palesa-logo.svg" alt="Palesa logo" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 600, fontSize: 18, color: '#185c37' }}>Palesa</span>
        </div>
        <h3>Monthly expenses 📅</h3>
        <h1 style={{ fontSize: '40px', margin: '8px 0' }}>00</h1>

        <StackedProgressContainer>
          {accounts.map((acc, idx) => (
            <Segment key={idx} color={acc.color} />
          ))}
        </StackedProgressContainer>

        <LegendWrapper>
          {accounts.map((acc, idx) => (
            <LegendItem key={idx}>
              <ColorDotLabel>
                <ColorDot color={acc.color} />
                <span>{acc.label}</span>
              </ColorDotLabel>
              <span>00%</span>
            </LegendItem>
          ))}
        </LegendWrapper>

        <SectionTitle>
          <span>Monthly Transactions</span>
          <span>~R{getTabTotal(mockTransactions[activeTab])}</span>
        </SectionTitle>

        <Tabs>
          {Object.keys(tabTitles).map(tab => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tabTitles[tab]}
            </TabButton>
          ))}
        </Tabs>

        <TransactionsContainer>
          {mockTransactions[activeTab].map((tx, index) => (
            <TransactionItem key={index}>
              <DateLabel>{tx.date}</DateLabel>
              <TransactionCard>
                <div>
                  <CategoryInfo>
                    <ColorDot color={tx.color} />
                    <strong>{tx.category}</strong>
                  </CategoryInfo>
                  <TransactionDetails>{tx.location}</TransactionDetails>
                </div>
                <Amount>{tx.amount}</Amount>
              </TransactionCard>
            </TransactionItem>
          ))}
        </TransactionsContainer>
      </Card>
    </Container>
  );
};

export default CareGiverExpenses;
