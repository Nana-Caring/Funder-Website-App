import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../store/slices/ui';

// Styled components (mirrors CareGiverExpenses for consistent UI)
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
  max-width: 800px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
`;

const StackedProgressContainer = styled.div`
  display: flex;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
`;

const Segment = styled.div`
  height: 100%;
  background-color: ${props => props.color};
  width: ${props => props.width}%;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  white-space: nowrap;
  ${props => props.width < 8 && `font-size: 0;`}
  ${props => props.width < 15 && props.width >= 8 && `font-size: 9px;`}
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

const TabButton = styled.span`
  cursor: pointer;
  padding: 4px 8px;
  color: ${props => (props.active ? '#c1126b' : '#666')};
  border-bottom: ${props => (props.active ? '3px solid #c1126b' : 'none')};
  transition: all 0.2s ease;
  &:hover { color: #c1126b; }
`;

const TransactionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
  &::-webkit-scrollbar-thumb:hover { background: #ccc; }
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

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ExpenseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  position: relative;
`;

const ExpenseTitle = styled.h3`
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DependentSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const DependentsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  position: relative;
  min-height: 48px;
  align-items: center;
`;

const DependentsSlider = styled.div`
  display: flex;
  gap: 8px;
  transition: transform 0.3s ease;
  transform: translateX(${props => props.offset}px);
  width: fit-content;
`;

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
  &:hover { background: #f0f0f0; border-color: #999; }
  &:disabled { opacity: 0.5; cursor: not-allowed; background: #f9f9f9; }
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
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 140px;
  justify-content: flex-start;
  &:hover { background: #f0f0f0; }
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

// Helper: assign avatar color deterministically
const getAvatarColor = (index) => {
  const colors = ['#a084ee', '#3b82f6', '#ffb84c', '#4ade80', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316'];
  return colors[index % colors.length];
};

const FunderExpenses = () => {
  // Redux setup
  const dispatch = useDispatch();
  const { user, token: reduxToken } = useSelector(state => state.authentication || {});

  // Local state
  const [activeTab, setActiveTab] = useState('currentMonth');
  const [activeBeneficiaryIndex, setActiveBeneficiaryIndex] = useState(0);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);

  const token = useMemo(() => {
    return reduxToken || localStorage.getItem('token');
  }, [reduxToken]);

  // Fetch dependents for funder
  useEffect(() => {
    const fetchDependents = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setError('');
        dispatch(showLoading({ message: 'Loading beneficiaries...' }));
        
        // Try funder beneficiaries endpoint first (as used in SendMoney)
        let response = await fetch('https://nanacaring-backend.onrender.com/api/funder/beneficiaries', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Fallback to funder/dependents endpoint
          response = await fetch('https://nanacaring-backend.onrender.com/api/funder/dependents', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (response.ok) {
          const result = await response.json();
          const arr = Array.isArray(result?.data) ? result.data : (result?.beneficiaries || result || []);
          setDependents(arr);
          // Cache for fallback
          try { localStorage.setItem('beneficiaries_cache', JSON.stringify(arr)); } catch {}
        } else {
          // Final fallback: cached
          const cached = localStorage.getItem('beneficiaries_cache');
          if (cached) {
            setDependents(JSON.parse(cached));
          } else {
            setDependents([]);
          }
        }
      } catch (err) {
        console.error('Failed to load funder dependents:', err);
        setError(err.message || 'Failed to load dependents');
      } finally {
        setLoading(false);
        dispatch(hideLoading());
      }
    };

    fetchDependents();
  }, [token, dispatch]);

  // Fetch funder transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return;
      try {
        dispatch(showLoading({ message: 'Loading transactions...' }));
        
        // Try main transactions endpoint
        let response = await fetch('https://nanacaring-backend.onrender.com/api/funder/transactions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fallback endpoint used by Statements.jsx
        if (!response.ok && response.status === 404) {
          response = await fetch('https://nanacaring-backend.onrender.com/api/funder/deposit/account', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.transactions) {
              const transformed = result.data.transactions.map((t, index) => ({
                id: t.id || index,
                description: t.description || 'Transaction',
                type: t.type || 'Debit',
                amount: parseFloat(t.amount) || 0,
                createdAt: t.createdAt,
                timestamp: t.createdAt
              }));
              setTransactions(transformed);
              return;
            }
          }
        }

        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (response.ok) {
          const result = await response.json();
          const txs = result?.data || [];
          setTransactions(Array.isArray(txs) ? txs : []);
        }
      } catch (err) {
        console.error('Failed to fetch funder transactions:', err);
        // Don't surface error loudly here; list will show empty state
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchTransactions();
  }, [token, dispatch]);

  // Active dependent helpers
  const hasMultiple = dependents.length > 1;
  const currentDependent = dependents[activeBeneficiaryIndex];

  const getAccountsData = (dependent) => {
    if (!dependent) {
      return [
        { color: '#a084ee', label: 'Baby Care Account', percent: 0, balance: 0 },
        { color: '#3b82f6', label: 'Entertainment Account', percent: 0, balance: 0 },
        { color: '#ffb84c', label: 'Healthcare Account', percent: 0, balance: 0 },
        { color: '#4ade80', label: 'Education Account', percent: 0, balance: 0 },
        { color: '#f43f5e', label: 'Food & Nutrition Account', percent: 0, balance: 0 },
        { color: '#8b5cf6', label: 'Clothing Account', percent: 0, balance: 0 },
        { color: '#06b6d4', label: 'Transport Account', percent: 0, balance: 0 },
        { color: '#f97316', label: 'Emergency Account', percent: 0, balance: 0 },
      ];
    }

    const totalBalance = dependent?.account?.balance || dependent?.balance || 1000;
    const age = dependent?.age || 8;
    const dependentType = dependent?.dependentType || 'child';

    let base = {
      babycare: age < 3 ? 0.25 : age < 6 ? 0.15 : 0.05,
      entertainment: age < 6 ? 0.05 : age < 12 ? 0.15 : 0.20,
      healthcare: dependentType === 'elderly' ? 0.35 : 0.20,
      education: age < 3 ? 0.05 : age < 18 ? 0.25 : 0.10,
      food: 0.20,
      clothing: age < 12 ? 0.10 : 0.15,
      transport: age < 6 ? 0.05 : 0.10,
      emergency: 0.10
    };
    const total = Object.values(base).reduce((s, v) => s + v, 0);
    Object.keys(base).forEach(k => { base[k] = base[k] / total; });

    return [
      { color: '#a084ee', label: 'Baby Care Account', percent: Math.round(base.babycare * 100), balance: Math.round(totalBalance * base.babycare) },
      { color: '#3b82f6', label: 'Entertainment Account', percent: Math.round(base.entertainment * 100), balance: Math.round(totalBalance * base.entertainment) },
      { color: '#ffb84c', label: 'Healthcare Account', percent: Math.round(base.healthcare * 100), balance: Math.round(totalBalance * base.healthcare) },
      { color: '#4ade80', label: 'Education Account', percent: Math.round(base.education * 100), balance: Math.round(totalBalance * base.education) },
      { color: '#f43f5e', label: 'Food & Nutrition Account', percent: Math.round(base.food * 100), balance: Math.round(totalBalance * base.food) },
      { color: '#8b5cf6', label: 'Clothing Account', percent: Math.round(base.clothing * 100), balance: Math.round(totalBalance * base.clothing) },
      { color: '#06b6d4', label: 'Transport Account', percent: Math.round(base.transport * 100), balance: Math.round(totalBalance * base.transport) },
      { color: '#f97316', label: 'Emergency Account', percent: Math.round(base.emergency * 100), balance: Math.round(totalBalance * base.emergency) },
    ];
  };

  // Process transactions into tabs
  const processTransactions = () => {
    if (!Array.isArray(transactions)) {
      return { lastMonth: [], currentMonth: [], future: [] };
    }

    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();
    const lm = cm === 0 ? 11 : cm - 1;
    const lmy = cm === 0 ? cy - 1 : cy;

    const out = { lastMonth: [], currentMonth: [], future: [] };

    const mapCategory = (desc) => {
      const d = (desc || '').toLowerCase();
      if (d.includes('health') || d.includes('medical') || d.includes('doctor')) return { category: 'Healthcare', color: '#ffb84c' };
      if (d.includes('school') || d.includes('education') || d.includes('fee')) return { category: 'Education', color: '#4ade80' };
      if (d.includes('food') || d.includes('grocery') || d.includes('meal')) return { category: 'Food & Nutrition', color: '#f43f5e' };
      if (d.includes('game') || d.includes('entertainment') || d.includes('movie')) return { category: 'Entertainment', color: '#3b82f6' };
      if (d.includes('baby') || d.includes('diaper') || d.includes('formula')) return { category: 'Baby Care', color: '#a084ee' };
      if (d.includes('clothes') || d.includes('clothing')) return { category: 'Clothing', color: '#8b5cf6' };
      if (d.includes('transport') || d.includes('taxi') || d.includes('bus')) return { category: 'Transport', color: '#06b6d4' };
      return { category: 'General', color: '#999' };
    };

    transactions.forEach(tx => {
      const dateStr = tx.timestamp || tx.createdAt || tx.date;
      if (!dateStr) return;
      const dt = new Date(dateStr);
      const cat = mapCategory(tx.description);
      const normalized = {
        date: dt.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: cat.category,
        location: tx.description || 'Transaction',
        amount: (tx.type === 'Credit' || tx.type === 'credit' || tx.amount > 0)
          ? `+R${Math.abs(parseFloat(tx.amount) || 0).toFixed(2)}`
          : `-R${Math.abs(parseFloat(tx.amount) || 0).toFixed(2)}`,
        color: cat.color
      };

      const m = dt.getMonth();
      const y = dt.getFullYear();
      if (y === lmy && m === lm) out.lastMonth.push(normalized);
      else if (y === cy && m === cm) out.currentMonth.push(normalized);
      else if (dt > now) out.future.push(normalized);
      else out.currentMonth.push(normalized);
    });

    return out;
  };

  const processed = useMemo(processTransactions, [transactions]);
  const accountsData = useMemo(() => getAccountsData(currentDependent), [currentDependent]);

  const tabTitles = { lastMonth: 'Last Month', currentMonth: 'Current Month', future: 'Future' };

  const getTabTotal = (list) => {
    if (!list) return '0.00';
    return list.reduce((sum, tx) => sum + Math.abs(parseFloat(String(tx.amount).replace('R', '').replace(',', '')) || 0), 0).toFixed(2);
  };

  if (loading) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading expenses data...</div>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>Error loading data: {error}</div>
        </Card>
      </Container>
    );
  }

  if (!dependents || dependents.length === 0) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No beneficiaries found. Please add beneficiaries to view expenses.
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <DependentSection>
            <NavigationButton
              onClick={() => setActiveBeneficiaryIndex(Math.max(0, activeBeneficiaryIndex - 1))}
              disabled={activeBeneficiaryIndex === 0 || !hasMultiple}
            >
              ‹
            </NavigationButton>

            <DependentsContainer>
              <DependentsSlider offset={0}>
                {currentDependent && (
                  <BeneficiaryButton key={currentDependent.id || activeBeneficiaryIndex} active={true} onClick={() => {}}>
                    <Avatar color={getAvatarColor(activeBeneficiaryIndex)}>
                      {(currentDependent.name || currentDependent.firstName || 'B').charAt(0).toUpperCase()}
                    </Avatar>
                    <span style={{ fontWeight: 600, color: '#333' }}>
                      {currentDependent.name || `${currentDependent.firstName || ''} ${currentDependent.surname || ''}`.trim() || 'Beneficiary'}
                    </span>
                  </BeneficiaryButton>
                )}
              </DependentsSlider>
            </DependentsContainer>

            <NavigationButton
              onClick={() => setActiveBeneficiaryIndex(Math.min(dependents.length - 1, activeBeneficiaryIndex + 1))}
              disabled={activeBeneficiaryIndex === dependents.length - 1 || !hasMultiple}
            >
              ›
            </NavigationButton>
          </DependentSection>
        </div>

        <ExpenseHeader>
          <ExpenseTitle>Monthly expenses</ExpenseTitle>
          <div style={{ fontSize: '12px', color: '#666' }}>{new Date().toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
          })}</div>
        </ExpenseHeader>

        <StackedProgressContainer>
          {accountsData.map((acc, idx) => (
            <Segment key={idx} color={acc.color} width={acc.percent}>
              {acc.percent >= 8 ? (
                acc.percent >= 15 ? acc.label.split(' ')[0] : acc.label.charAt(0)
              ) : null}
            </Segment>
          ))}
        </StackedProgressContainer>

        <SectionTitle>
          <span>Monthly Transactions</span>
          <span>R{getTabTotal(processed[activeTab])}</span>
        </SectionTitle>

        <Tabs>
          {Object.keys(tabTitles).map(tab => (
            <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tabTitles[tab]}
            </TabButton>
          ))}
        </Tabs>

        <TransactionsContainer>
          {processed[activeTab] && processed[activeTab].length > 0 ? (
            processed[activeTab].map((tx, index) => (
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
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 20px', fontSize: '14px' }}>
              No transactions found for {tabTitles[activeTab].toLowerCase()}
            </div>
          )}
        </TransactionsContainer>
      </Card>
    </Container>
  );
};

export default FunderExpenses;
