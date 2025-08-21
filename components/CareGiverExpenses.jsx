import React, { useState } from 'react';
import styled from 'styled-components';
import avatar1 from '../assets/avatars/avatar1.png';
import expensesIcon from '../assets/icons/expenses.png';

const accountsData = {
  palesa: [
    { color: '#a084ee', label: 'Baby Care Account', percent: 25 },
    { color: '#3b82f6', label: 'Entertainment Account', percent: 15 },
    { color: '#ffb84c', label: 'Healthcare Account', percent: 35 },
    { color: '#4ade80', label: 'Education Account', percent: 25 },
  ],
  thando: [
    { color: '#a084ee', label: 'Baby Care Account', percent: 30 },
    { color: '#3b82f6', label: 'Entertainment Account', percent: 20 },
    { color: '#ffb84c', label: 'Healthcare Account', percent: 20 },
    { color: '#4ade80', label: 'Education Account', percent: 30 },
  ],
  lesedi: [
    { color: '#a084ee', label: 'Baby Care Account', percent: 20 },
    { color: '#3b82f6', label: 'Entertainment Account', percent: 30 },
    { color: '#ffb84c', label: 'Healthcare Account', percent: 25 },
    { color: '#4ade80', label: 'Education Account', percent: 25 },
  ],
};

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
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  height: calc(100vh - 80px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px; /* Increased from 400px to 800px */
  background: white;
  border-radius: 12px;
  padding: 24px; /* Increased padding for better spacing */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
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
  width: ${props => props.width}%;
  transition: width 0.3s ease;
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
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 6px;
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
  margin-top: 8px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
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

const BeneficiaryToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const BeneficiaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: ${props => props.active ? '#f0f0f0' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const CareGiverExpenses = () => {
  const [activeTab, setActiveTab] = useState('currentMonth');
  const [activeBeneficiary, setActiveBeneficiary] = useState('palesa');

  const beneficiaries = {
    palesa: {
      name: 'Palesa',
      color: '#185c37',
      transactions: mockTransactions
    },
    thando: {
      name: 'Thando',
      color: '#c1126b',
      transactions: {
        ...mockTransactions,
        currentMonth: mockTransactions.currentMonth.map(tx => ({
          ...tx,
          amount: tx.amount.replace('500', '300').replace('5000', '2000')
        }))
      }
    },
    lesedi: {
      name: 'Lesedi',
      color: '#3b82f6',
      transactions: {
        ...mockTransactions,
        currentMonth: mockTransactions.currentMonth.map(tx => ({
          ...tx,
          amount: tx.amount.replace('500', '800').replace('5000', '3000')
        }))
      }
    }
  };

  const tabTitles = {
    lastMonth: 'Last Month',
    currentMonth: 'Current Month',
    future: 'Future',
  };

  const calculateTotalExpenses = () => {
    const transactions = beneficiaries[activeBeneficiary].transactions[activeTab];
    return transactions.reduce((total, tx) => {
      const amount = Math.abs(parseFloat(tx.amount.replace('R', '').replace(',', '')));
      return total + amount;
    }, 0).toFixed(2);
  };

  const getTabTotal = (transactions) => {
    return transactions.reduce((total, tx) => {
      const amount = Math.abs(parseFloat(tx.amount.replace('R', '').replace(',', '')));
      return total + amount;
    }, 0).toFixed(2);
  };

  return (
    <Container>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <BeneficiaryToggle>
          {Object.entries(beneficiaries).map(([key, ben]) => (
            <BeneficiaryButton
              key={key}
              active={activeBeneficiary === key}
              onClick={() => setActiveBeneficiary(key)}
            >
              <Avatar color={ben.color}>
                {ben.name.charAt(0)}
              </Avatar>
              <span style={{ 
                fontWeight: activeBeneficiary === key ? '600' : '400',
                color: '#333'
              }}>
                {ben.name}
              </span>
            </BeneficiaryButton>
          ))}
        </BeneficiaryToggle>
        </div>
        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Monthly expenses 📅</h3>
        {/* <h1 style={{ fontSize: '32px', margin: '4px 0' }}>R{calculateTotalExpenses()}</h1> */}

        <StackedProgressContainer>
          {accountsData[activeBeneficiary].map((acc, idx) => (
            <Segment key={idx} color={acc.color} width={acc.percent} />
          ))}
        </StackedProgressContainer>

        <LegendWrapper>
          {accountsData[activeBeneficiary].map((acc, idx) => (
            <LegendItem key={idx}>
              <ColorDotLabel>
                <ColorDot color={acc.color} />
                <span>{acc.label}</span>
              </ColorDotLabel>
              <span>{acc.percent}%</span>
            </LegendItem>
          ))}
        </LegendWrapper>

        

        <SectionTitle>
          <span>Monthly Transactions</span>
          <span>R{getTabTotal(beneficiaries[activeBeneficiary].transactions[activeTab])}</span>
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
          {beneficiaries[activeBeneficiary].transactions[activeTab].map((tx, index) => (
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
