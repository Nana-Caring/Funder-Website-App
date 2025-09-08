import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import expensesIcon from '../assets/icons/expenses.png';
import arrowIcon from '../assets/icons/arrow.png';
import ProfileCompletionPopup from './common/ProfileCompletionPopup';
import { 
  fetchDependents, 
  fetchCaregiverStats, 
  fetchRecentActivity 
} from '../store/slices/beneficiaries';

// Styled components
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 80px;
  box-sizing: border-box;
  height: calc(100vh - 10px);
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 16px;
  margin-bottom: 16px;
  align-items: start;
  width: 100%;
  justify-content: center; /* Center grid items */
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 16px; /* Reduced padding */
  display: flex;
  flex-direction: column;
  min-height: 240px; /* Reduced height */
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;

const RequestsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 180px; /* Reduced height */
  overflow-y: auto;
`;

const RequestsCard = styled(Card)`
  max-width: 100%;
  margin: 0;
  padding: 16px;
  min-height: 200px; /* Reduced height */
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


const Avatar = styled.div`
  width: 32px; /* Reduced size */
  height: 32px;
  border-radius: 50%;
  background: #a084ee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  border: 2px solid #fff;
`;

const BarChart = styled.div`
  display: flex;
  height: 20px; /* Reduced height */
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0 12px 0; /* Reduced margins */
  background: #e5e7eb;
`;

const Bar = styled.div`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.$percent}%;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #444;
`;

const Dot = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.color};
  display: inline-block;
`;

const SectionTitle = styled.div`
  font-size: 16px; /* Reduced font size */
  margin-bottom: 14px; /* Reduced margin */
  color: #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SeeAll = styled.span`
  color: #ff4c60;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7faf7;
  border-radius: 12px;
  padding: 8px 12px;
`;

const TransactionAvatar = styled(Avatar)`
  background: #3b82f6;
  width: 32px;
  height: 32px;
  font-size: 16px;
`;

const TransactionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const TransactionName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #222;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const TransactionAmount = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-left: auto;
`;

const RequestRow = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 12px 12px;
  gap: 8px;
`;

const RequestName = styled.div`
  flex: 2;
  font-size: 15px;
  color: #222;
`;

const RequestReason = styled.div`
  flex: 2;
  font-size: 15px;
  color: #444;
`;

const RequestAmount = styled.div`
  flex: 1;
  font-size: 15px;
  color: #222;
`;

const RequestAction = styled.div`
  flex: 0 0 40px;
  display: flex;
  justify-content: flex-end;
`;

const AvatarsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const DotIndicator = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'pink' : '#e0e0e0'};
  display: inline-block;
`;

const ResponsiveWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* Center the wrapper */
  padding: 0 12px;

  @media (max-width: 1200px) {
    ${Grid} {
      grid-template-columns: 1fr;
      max-width: 600px;
      margin: 0 auto; /* Center grid on smaller screens */
    }
  }

  @media (max-width: 768px) {
    padding: 0 8px;
    ${Grid} {
      grid-template-columns: 1fr;
    }
  }
`;

// Update the component return statement
const CareGiverHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  
  // Get data from Redux store
  const { 
    list: dependents, 
    isLoading, 
    error,
    stats,
    recentActivity 
  } = useSelector(state => state.beneficiaries);
  const { user } = useSelector(state => state.authentication);
  
  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchCaregiverStats(token));
      dispatch(fetchDependents({ token, params: { limit: 5 } }));
      dispatch(fetchRecentActivity({ token, params: { limit: 4, days: 30 } }));
    }
  }, [dispatch, token]);

  // Calculate dynamic account data based on dependents
  const getAccountsData = () => {
    if (!dependents.length) {
      return [
        { color: '#a084ee', label: 'Baby Care Account', percent: 0, balance: 0 },
        { color: '#3b82f6', label: 'Entertainment Account', percent: 0, balance: 0 },
        { color: '#ffb84c', label: 'Healthcare Account', percent: 0, balance: 0 },
        { color: '#4ade80', label: 'Education Account', percent: 0, balance: 0 },
      ];
    }

    const totalBalance = stats?.totalAccountBalance || 0;
    const accountCount = dependents.length;
    const avgBalance = accountCount > 0 ? totalBalance / accountCount : 0;

    return [
      { 
        color: '#a084ee', 
        label: 'Baby Care Account', 
        percent: totalBalance > 0 ? 25 : 0, 
        balance: avgBalance * 0.3 
      },
      { 
        color: '#3b82f6', 
        label: 'Entertainment Account', 
        percent: totalBalance > 0 ? 20 : 0, 
        balance: avgBalance * 0.2 
      },
      { 
        color: '#ffb84c', 
        label: 'Healthcare Account', 
        percent: totalBalance > 0 ? 35 : 0, 
        balance: avgBalance * 0.35 
      },
      { 
        color: '#4ade80', 
        label: 'Education Account', 
        percent: totalBalance > 0 ? 20 : 0, 
        balance: avgBalance * 0.15 
      },
    ];
  };

  const accountsData = getAccountsData();
  const recentTransactions = recentActivity?.transactions || [];
  
  // Mock requests data - replace with real API when available
  const requests = [
    { name: 'Healthcare Request', reason: 'Medical expenses', amount: `R${(stats?.totalAccountBalance * 0.1 || 1000).toFixed(0)}` },
    { name: 'Education Request', reason: 'School fees', amount: `R${(stats?.totalAccountBalance * 0.15 || 1500).toFixed(0)}` },
    { name: 'Emergency Request', reason: 'Urgent care', amount: `R${(stats?.totalAccountBalance * 0.05 || 500).toFixed(0)}` },
  ];

  useEffect(() => {
    // Check if we should show the profile completion popup
    const checkShowPopup = () => {
      const dismissed = localStorage.getItem('profileCompletionDismissed');
      const reminderTime = localStorage.getItem('profileCompletionReminder');
      const currentTime = Date.now();

      // Don't show if user has dismissed it permanently
      if (dismissed === 'true') {
        return false;
      }

      // Don't show if we're still in the reminder period
      if (reminderTime && currentTime < parseInt(reminderTime)) {
        return false;
      }

      // Check if profile is complete by looking at required fields
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const requiredFields = [
            'firstName', 'surname', 'email', 'phoneNumber', 'Idnumber',
            'postalAddressLine1', 'postalCity', 'postalProvince', 'postalCode',
            'homeAddressLine1', 'homeCity', 'homeProvince', 'homeCode'
          ];
          
          const missingFields = requiredFields.filter(field => 
            !userData[field] || userData[field].toString().trim() === ''
          );
          
          // Show popup if there are missing fields
          return missingFields.length > 0;
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          return false;
        }
      }

      return false;
    };

    // Show popup after a short delay to let the dashboard load
    const timer = setTimeout(() => {
      if (checkShowPopup()) {
        setShowProfilePopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCompleteProfile = () => {
    setShowProfilePopup(false);
    // Navigate to profile page (all roles use /profile route)
    navigate('/profile');
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  return (
    <>
      <MainContent>
      <ResponsiveWrapper>
        {/* Statistics Summary Card */}
        <Card style={{ 
          marginBottom: '16px', 
          background: 'linear-gradient(135deg, #185c37, #1e6b42)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
              Caregiver Dashboard Overview
            </h3>
            {isLoading && (
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Loading...</div>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {stats?.totalDependents || dependents.length || 0}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Dependents</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {stats?.dependentsByStatus?.active || 0}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Accounts</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                {stats?.currency || 'ZAR'} {stats?.totalAccountBalance?.toFixed(2) || '0.00'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Balance</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {recentActivity?.totalTransactions || 0}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Recent Transactions</div>
            </div>
          </div>
        </Card>

        <Grid>
          {/* Left: Monthly expenses and bar chart */}
          <Card>
            {/* Avatars centered at the top */}
            <AvatarsRow>
              <Avatar>{user?.firstName?.charAt(0) || 'C'}</Avatar>
              <Avatar style={{ background: '#ff4c60' }}>
                {dependents.length > 0 ? dependents[0].name.charAt(0) : 'D'}
              </Avatar>
              <img src={arrowIcon} alt="Arrow" style={{ width: 24, height: 24 }} />
            </AvatarsRow>
            {/* Dots below avatars */}
            <DotsRow>
              <DotIndicator active />
              <DotIndicator />
            </DotsRow>
            {/* Monthly expenses and rest of content */}
            <FlexRow style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#222', fontWeight: 500, fontSize: 16 }}>
                  Total Balance: {stats?.currency || 'ZAR'} {stats?.totalAccountBalance?.toFixed(2) || '0.00'}
                </div>
                <img src={expensesIcon} alt="Expenses" style={{ width: 24, height: 24 }} />
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {dependents.length} Dependents
              </div>
            </FlexRow>
            <BarChart style={{ margin: '10px 0 8px 0' }}>
              {accountsData.map((acc, i) => (
                <Bar key={acc.label} color={acc.color} $percent={acc.percent} />
              ))}
            </BarChart>
            <Legend>
              {accountsData.map(acc => (
                <LegendRow key={acc.label}>
                  <Dot color={acc.color} />
                  <span>{acc.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#888' }}>
                    {acc.percent}% ({stats?.currency || 'ZAR'} {acc.balance.toFixed(0)})
                  </span>
                </LegendRow>
              ))}
            </Legend>
          </Card>
          {/* Right: Transaction History */}
          <Card>
            <SectionTitle>
              Recent Activity 
              <SeeAll onClick={() => navigate('/caregiver/beneficiaries')}>
                see all &rarr;
              </SeeAll>
            </SectionTitle>
            <TransactionList>
              {isLoading ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  Loading transactions...
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 4).map((tx, i) => (
                  <TransactionItem key={tx.id || i}>
                    <TransactionAvatar>
                      {tx.dependent?.name?.charAt(0) || 'D'}
                    </TransactionAvatar>
                    <TransactionInfo>
                      <TransactionName>
                        {tx.description || 'Transaction'}
                      </TransactionName>
                      <TransactionDate>
                        {new Date(tx.timestamp || tx.createdAt).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TransactionDate>
                    </TransactionInfo>
                    <TransactionAmount style={{
                      color: tx.type === 'Credit' ? '#4ade80' : '#ef4444'
                    }}>
                      {tx.type === 'Credit' ? '+' : '-'}R{tx.amount?.toFixed(2) || '0.00'}
                    </TransactionAmount>
                  </TransactionItem>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No recent transactions
                </div>
              )}
            </TransactionList>
          </Card>
        </Grid>
        <RequestsCard>
          <SectionTitle style={{ padding: '0 12px 0 12px' }}>
            Requests <SeeAll>see all &rarr;</SeeAll>
          </SectionTitle>
          <RequestsTable>
            {requests.map((req, i) => (
              <RequestRow key={i}>
                <RequestName>{req.name}</RequestName>
                <RequestReason>{req.reason}</RequestReason>
                <RequestAmount>{req.amount}</RequestAmount>
                <RequestAction>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" fill="#888"/><circle cx="12" cy="12" r="2" fill="#888"/><circle cx="19" cy="12" r="2" fill="#888"/></svg>
                </RequestAction>
              </RequestRow>
            ))}
          </RequestsTable>
        </RequestsCard>
      </ResponsiveWrapper>
      
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup
          onClose={handleClosePopup}
          onCompleteProfile={handleCompleteProfile}
        />
      )}
    </MainContent>
    </>
  );
};

export default CareGiverHome;