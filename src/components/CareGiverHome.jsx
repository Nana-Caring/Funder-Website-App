import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import expensesIcon from '../assets/icons/expenses.png';
import arrowIcon from '../assets/icons/arrow.png';
import ProfileCompletionPopup from './common/ProfileCompletionPopup';

// Mock data
const accounts = [
  { color: '#a084ee', label: 'Baby Care Account', percent: 0 },
  { color: '#3b82f6', label: 'Entertainment Account', percent: 0 },
  { color: '#ffb84c', label: 'Healthcare Account', percent: 0 },
  { color: '#4ade80', label: 'Key title goes here', percent: 0 },
];

const transactions = [
  { name: 'School fees', date: '1-Feb-25 11:00 AM', amount: '-R10 000', avatar: '' },
  { name: 'School fees', date: '1-Feb-25 11:00 AM', amount: '-R10 000', avatar: '' },
  { name: 'School fees', date: '1-Feb-25 11:00 AM', amount: '-R10 000', avatar: '' },
  { name: 'School fees', date: '1-Feb-25 11:00 AM', amount: '-R10 000', avatar: '' },
];

const requests = [
  { name: 'Charity Matlopjo', reason: 'Healthcare', amount: 'R8 000' },
  { name: 'Charity Matlopjo', reason: 'Healthcare', amount: 'R8 000' },
  { name: 'Charity Matlopjo', reason: 'Healthcare', amount: 'R8 000' },
];

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
  width: ${props => props.percent}%;
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
  const [showProfilePopup, setShowProfilePopup] = useState(false);

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
        <Grid>
          {/* Left: Monthly expenses and bar chart */}
          <Card>
            {/* Avatars centered at the top */}
            <AvatarsRow>
              <Avatar>P</Avatar>
              
              <Avatar style={{ background: '#ff4c60' }}>C</Avatar>
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
               
                <div style={{ color: '#222', fontWeight: 500, fontSize: 16 }}>Monthly expenses</div>
                <img src={expensesIcon} alt="Expenses" style={{ width: 24, height: 24 }} />
              </div>
              <div />
            </FlexRow>
           
            <BarChart style={{ margin: '10px 0 8px 0' }}>
              {accounts.map((acc, i) => (
                <Bar key={acc.label} color={acc.color} percent={25} />
              ))}
            </BarChart>
            <Legend>
              {accounts.map(acc => (
                <LegendRow key={acc.label}>
                  <Dot color={acc.color} />
                  <span>{acc.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#888' }}>00%</span>
                </LegendRow>
              ))}
            </Legend>
          </Card>
          {/* Right: Transaction History */}
          <Card>
            <SectionTitle>
              Transaction History <SeeAll>see all &rarr;</SeeAll>
            </SectionTitle>
            <TransactionList>
              {transactions.slice(0, 4).map((tx, i) => (
                <TransactionItem key={i}>
                  <TransactionAvatar>A</TransactionAvatar>
                  <TransactionInfo>
                    <TransactionName>{tx.name}</TransactionName>
                    <TransactionDate>{tx.date}</TransactionDate>
                  </TransactionInfo>
                  <TransactionAmount>{tx.amount}</TransactionAmount>
                </TransactionItem>
              ))}
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