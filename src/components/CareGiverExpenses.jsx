import React from 'react';
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

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  margin: auto;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
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
  width: 25%; /* Static for now since all percents are 0 */
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

const CareGiverExpenses = () => {
  return (
    <Card>
      {/* Palesa logo and text row */}
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
        <span>~R1300.00</span>
      </SectionTitle>

      <Tabs>
        <span>Last Month</span>
        <ActiveTab>Current Month</ActiveTab>
        <span>Future</span>
      </Tabs>

      {transactions.map((tx, index) => (
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
    </Card>
  );
};

export default CareGiverExpenses;
