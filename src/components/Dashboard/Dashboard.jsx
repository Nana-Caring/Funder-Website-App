import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Search,
  Notifications,
  Settings,
  Person,
  Home,
  AccountBalance,
  Send,
  Group,
  Share,
  Close,
  ArrowBack
} from '@mui/icons-material';
import PaymentModal from '../PaymentModal/PaymentModal';
import ProfileCompletionPopup from '../common/ProfileCompletionPopup';
import { Avatar, Modal, IconButton } from '@mui/material';
/* 
  Outer container that holds the main dashboard area.
*/
const Container = styled.div`
  display: flex;
  width: calc(100% - 250px); /* Account for sidebar width */
  height: calc(100vh - 80px); /* Account for header height */
  position: relative;
  margin-left: auto;
  margin-top: 25px; /* Space below header */
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  padding: 24px; /* Add equal padding around content */
  box-sizing: border-box;
`;

const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px; /* Reduced from 1200px for better centering */
  margin: 0 auto; /* Center horizontally */
  box-sizing: border-box;
  gap: 24px; /* Add consistent spacing between elements */
`;

const MainContent = styled.div`
  display: flex;
  gap: 24px; /* Consistent spacing */
  width: 100%;
  justify-content: center; /* Center content horizontally */
  
  > div {
    &:first-child {
      flex: 1.5;
      max-width: 600px; /* Reduced from 700px */
    }
    &:last-child {
      flex: 1;
      max-width: 350px; /* Reduced from 400px */
    }
  }
`;

const BalanceCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: 16px;

  .balance-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .balance-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px;

    
    p {
      font-size: 16px;
      margin: 0;
      font-weight: 400;
      font-family: Inter;
      color: #666;
    }
  }

  .card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }
`;

import cardBg from '../../assets/images/card-bg.png';

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  filter: blur(8px);
`;

const NanaCard = styled.div`
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 20px;
  border-radius: 15px;
  aspect-ratio: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 170px;
  width: 100%;
  max-width: 380px;
  z-index: 1;

  .card-name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 9px;
    margin-top: 8px;
    font-family: 'Podkova', serif;
    color: #CAC8C8;
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-top:25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  display: flex;
  gap: 16px;

  .action-card {
    flex: 1;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    &:first-child {
      flex: 0.7;
    }

    h3 {
      font-size: 14px;
      color: #333;
      margin: 0 0 6px 0;
    }

    .users {
      display: flex;
      align-items: flex-start;
      margin: 8px 0;
      gap: 24px; /* Increased from 12px to 24px */
      font-family: 'Poppins', sans-serif;
      
      .user-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .avatar {
          margin-bottom: 4px;
          border: 2px solid white;
          width: 28px;
          height: 28px;
        }

        .user-name {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
          font-family: 'Poppins', sans-serif;
        }
      }

      .arrow-icon {
        width: 20px;
        height: 20px;
        margin-left: 4px;
        align-self: center;
      }
    }

    .transfer-select {
      width: 100%;
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 12px;
    }

    .deposit-selects {
      margin: 4px 0;
      max-height: 200px; /* Fixed height for scrolling */
      overflow-y: auto; /* Enable vertical scrolling */
      padding-right: 4px; /* Add space for scrollbar */

      /* Custom scrollbar styling */
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }

      .request-item {
        display: flex;
        align-items: center;
        padding: 6px 8px; /* Slightly reduced padding */
        background: #e0e0e0;
        border-radius: 8px;
        margin-bottom: 6px; /* Reduced spacing between items */
        transition: background-color 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: #d0d0d0;
        }

        .request-details {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px; /* Reduced from 16px */
          font-size: 11px; /* Reduced from 14px */
          font-family: 'Poppins', sans-serif;

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:first-child {
              color: #111;
              font-weight: 500;
            }

            &:last-child {
              color: #666;
              cursor: pointer;
            }
          }
        }
      }
    }

    .account-select {
      width: 100%;
      padding: 6px;
      margin-bottom: 4px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 12px;
    }

    button {
      width: 100%;
      padding: 8px;
      border: none;
      border-radius: 8px;
      background: #FD3E6E;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
      }

      &.see-all {
        background: none;
        color: #ff0000;
        font-weight: 500;
        margin-top: 8px;
      }
    }
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const TrackingSection = styled.div`
  background: white;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 0px;
   font-family: 'Poppins', sans-serif;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    gap: 15px;
    position: relative;

    .dots {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #FD3E6E;

        &.inactive {
          background: transparent;
          border: 1px solid #FD3E6E;
        }
      }
    }
  }
  .arrow-icon {
    color: #666;
  }

  .account-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
  }

  .account-item {
   font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &.baby { background: #9c27b0; }
      &.entertainment { background: #2196f3; }
      &.healthcare { background: #ff9800; }
    }
  }
`;

const AccountProgress = styled.div`
  margin-bottom: 6px;

  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
  }

  .progress-bar {
    height: 21px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    gap: 4px;

    .fill {
      height: 100%;
      border-radius: 4px;
      &.baby { background: #9c27b0; flex: 0.2; }
      &.entertainment { background: #2196f3; flex: 0.4; }
      &.healthcare { background: #ff9800; flex: 0.2; }
      &.education { background: #4caf50; flex: 0.2; }
    }
  }
`;

const SendMoneyModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
  }

  .form-group {
    margin-bottom: 16px;

    &:has(input[type="number"]) {
      display: flex;
      align-items: center;
      gap: 16px;

      label {
        margin-bottom: 0;
        min-width: 80px;
      }
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #666;
      font-size: 14px;
      text-align: center;
    }

    select, input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .warning-message {
    color: #ff0000;
    font-size: 12px;
    margin: 16px 0;
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 24px;

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      background: #000;
      color: white;

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

const TransactionHistory = styled.div`
  margin-top: 0;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  h3 {
    position: sticky;
    top: 0;
    background: white;
    padding: 8px 0;
    margin: 0;
    z-index: 1;
  }

  .transactions-container {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  }

  .transaction {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px;
    background: #e0e0e0;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    gap: 16px; /* Reduced from 30px */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      background: #d0d0d0;
    }

    .avatar {
      width: 28px; /* Reduced from 32px */
      height: 28px; /* Reduced from 32px */
      flex-shrink: 0;
    }

    .details {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px; /* Reduced from 20px */
      font-size: 11px; /* Reduced font size */
      color: #666;
      
      span {
        white-space: nowrap; /* Keep text in one line */
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .amount {
        color: rgb(5, 1, 3);
        font-weight: 500;
        margin-left: auto;
      }
    }
  }

  @media (max-width: 480px) {
    .transaction {
      gap: 8px;
      
      .details {
        font-size: 10px;
        gap: 8px;
      }
    }
  }
`;

const ResponsiveStyles = styled.div`
  @media (max-width: 1200px) {
    ${Container} {
      padding: 16px; /* Smaller padding on smaller screens */
    }
    ${MainContent} {
      flex-direction: column;
      align-items: center; /* Center items when stacked */
      
      > div {
        &:first-child, &:last-child {
          max-width: 600px;
          width: 100%;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    ${MainContent} {
      flex-direction: column;
      gap: 24px;
      align-items: flex-start; /* Changed from center */
    }
    ${RightPanel} {
      margin-right: 0;
      margin-top: 24px;
    }
    ${DashboardContainer} {
      padding: 12px;
      align-items: flex-start; /* Changed from center */
    }
  }

  @media (max-width: 768px) {
    ${Container} {
      width: calc(100% - 200px);
    }
    
    ${DashboardContainer} {
      padding: 12px;
    }
    ${MainContent} {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start; /* Changed from center */
      > div {
        min-width: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Changed from center */
      }
    }
    ${BalanceCard}, ${QuickActions}, ${TrackingSection}, ${TransactionHistory} {
      padding: 10px;
      border-radius: 10px;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
    ${NanaCardWrapper} {
      max-width: 98vw;
    }
    ${NanaCard} {
      height: 120px;
      max-width: 98vw;
      padding: 10px;
      font-size: 14px;
    }
    ${QuickActions} {
      flex-direction: column;
      gap: 12px;
      .action-card {
        margin-bottom: 8px;
      }
    }
    ${SendMoneyModal} {
      width: 95vw;
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    ${DashboardContainer} {
      padding: 4px;
      align-items: center;
    }
    ${BalanceCard}, ${QuickActions}, ${TrackingSection}, ${TransactionHistory} {
      padding: 6px;
      border-radius: 8px;
      width: 100%;
      max-width: 98vw;
      margin: 0 auto;
    }
    ${NanaCard} {
      height: 90px;
      font-size: 12px;
      padding: 6px;
    }
    ${QuickActions} {
      gap: 8px;
      .action-card {
        padding: 6px;
      }
    }
    ${SendMoneyModal} {
      width: 99vw;
      padding: 6px;
    }
    .modal-header h2 {
      font-size: 16px;
    }
    .form-group label, .form-group select, .form-group input {
      font-size: 12px;
    }
    ${TransactionHistory} .transaction {
      gap: 10px;
      font-size: 12px;
      .avatar {
        width: 24px;
        height: 24px;
      }
    }
  }
`;


const LetterAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color || '#FD3E6E'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const mockRequests = [
  { name: 'Charity Matlapo', category: 'Healthcare', amount: 'R10 000' },
  { name: 'John Smith', category: 'Education', amount: 'R5 000' },
  { name: 'Sarah Johnson', category: 'Baby Care', amount: 'R3 500' },
  { name: 'Michael Brown', category: 'Entertainment', amount: 'R2 000' },
  { name: 'Emma Davis', category: 'Healthcare', amount: 'R8 000' },
];

const mockTransactions = [
  { id: 1, type: 'School fees', date: '11-feb-25 11:00 AM', amount: '-R10 000' },
  { id: 2, type: 'Healthcare', date: '10-feb-25 02:30 PM', amount: '-R2 500' },
  { id: 3, type: 'Entertainment', date: '09-feb-25 09:15 AM', amount: '-R1 500' },
  { id: 4, type: 'Baby Care', date: '08-feb-25 03:45 PM', amount: '-R3 000' },
  { id: 5, type: 'Education', date: '07-feb-25 10:20 AM', amount: '-R5 000' },
  { id: 6, type: 'Healthcare', date: '06-feb-25 01:00 PM', amount: '-R800' },
  { id: 7, type: 'Entertainment', date: '05-feb-25 04:30 PM', amount: '-R2 000' },
  { id: 8, type: 'Baby Care', date: '04-feb-25 11:45 AM', amount: '-R1 200' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    // Check if we should show the profile completion popup
    const checkShowPopup = () => {
      const dismissed = localStorage.getItem('profileCompletionDismissed');
      const reminderTime = localStorage.getItem('profileCompletionReminder');
      const currentTime = Date.now();

      console.log('Profile popup check:', {
        dismissed,
        reminderTime,
        currentTime,
        stillInReminderPeriod: reminderTime && currentTime < parseInt(reminderTime)
      });

      // Don't show if user has dismissed it permanently
      if (dismissed === 'true') {
        console.log('Popup dismissed permanently');
        return false;
      }

      // Don't show if we're still in the reminder period
      if (reminderTime && currentTime < parseInt(reminderTime)) {
        console.log('Still in reminder period');
        return false;
      }

      // Check if profile is complete by looking at required fields
      const storedUser = localStorage.getItem('user');
      console.log('Stored user data:', storedUser);
      
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
          
          console.log('Profile completion check:', {
            userData,
            requiredFields,
            missingFields,
            shouldShowPopup: missingFields.length > 0
          });
          
          // Show popup if there are missing fields
          return missingFields.length > 0;
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          return false;
        }
      }

      console.log('No stored user data found');
      return false;
    };

    // Show popup after a short delay to let the dashboard load
    const timer = setTimeout(() => {
      const shouldShow = checkShowPopup();
      console.log('Should show profile popup:', shouldShow);
      if (shouldShow) {
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
    <ResponsiveStyles>
      <Container>
      <DashboardContainer>
        
        <MainContent>
          <div>
            <BalanceCard>
              <div className="balance-row">
                <div className="balance-item">
                  <p>Money Out:</p>
                  <p>-R10 000</p>
                </div>
                
              </div>
            </BalanceCard>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <NanaCardWrapper>
                <NanaCardShadow />
                <NanaCard>
                  <div className="card-name">MR PRINCE MASHUNU</div>
                 
                </NanaCard>
              </NanaCardWrapper>
            </div>

            <QuickActions>
              <div className="action-card">
                <h3>Quick Transfer</h3>
                <div className="users">
                  <div className="user-container">
                    <LetterAvatar color="#185c37">S</LetterAvatar>
                    <span className="user-name">Son</span>
                  </div>
                  <div className="user-container">
                    <LetterAvatar color="#c1126b">D</LetterAvatar>
                    <span className="user-name">Daughter</span>
                  </div>
                  <div className="user-container">
                    <LetterAvatar color="#3b82f6">C</LetterAvatar>
                    <span className="user-name">Chris</span>
                  </div>
                  <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
                </div>
                <select className="transfer-select">
                  <option>Select Account</option>
                  <option>Savings Account</option>
                  <option>Checking Account</option>
                </select>
                <button onClick={() => setIsModalOpen(true)}>Send Money</button>
                <Modal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  aria-labelledby="send-money-modal"
                >
                  <SendMoneyModal>
                    <div className="modal-header">
                      <IconButton onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', left: '10px' }}>
                        <ArrowBack />
                      </IconButton>
                      <h2 style={{ width: '100%', textAlign: 'center' }}>Pay</h2>
                      <IconButton onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '10px' }}>
                        <Close />
                      </IconButton>
                    </div>
                    <div className="form-group">
                      <select>
                        <option value="">Beneficiary name</option>
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>From</label>
                      <select>
                        <option>Capitec Account</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>To</label>
                      <select>
                        <option>Baby Care Account</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount</label>
                      <input type="number" placeholder="R 5000" />
                    </div>
                    <p className="warning-message">
                      Please be advised that when you proceed now, you have made sure the details are accurate
                    </p>
                    <div className="button-group">
                      <button 
                        className="proceed" 
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsPaymentModalOpen(true);
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  </SendMoneyModal>
                </Modal>
                <Modal
                  open={isPaymentModalOpen}
                  onClose={() => setIsPaymentModalOpen(false)}
                  aria-labelledby="payment-modal"
                >
                  <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />
                </Modal>
              </div>
              <div className="action-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Manage Requests</h3>
                  <div 
                    onClick={() => navigate('/messages')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <span style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '14px' }}>see all</span>
                    <img src="/src/assets/icons/arrow.png" alt="arrow" style={{ width: '16px', height: '16px', color: '#666' }} />
                  </div>
                </div>
                <div className="deposit-selects">
                  {mockRequests.map((request, index) => (
                    <div className="request-item" key={index}>
                      <div className="request-details">
                        <span>{request.name}</span>
                        <span>{request.category}</span>
                        <span>{request.amount}</span>
                        <span>...</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <button>See All</button> */}
              </div>
            </QuickActions>
          </div>

          {/* RIGHT COLUMN */}
          <RightPanel>
            <TrackingSection>
              <div className="icons-container">
                <LetterAvatar color="#185c37">P</LetterAvatar>
                <LetterAvatar color="#c1126b">C</LetterAvatar>
                <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
                <div className="dots">
                  <div className="dot"></div>
                  <div className="dot inactive"></div>
                  <div className="dot inactive"></div>
                </div>
              </div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Monthly expenses <img src="/src/assets/icons/expenses.png" alt="arrow" className="arrow-icon" style={{ width: '16px', height: '16px' }} /></h3>
            <p className="total" style={{ fontFamily: 'Inter', fontSize: '30px', fontWeight: '400', marginTop: '4px', marginBottom: '4px', color: '#333333' }}>00</p>
              <AccountProgress>
                <div className="label">
                  <span>Baby Care Account</span>
                  <span>00%</span>
                </div>
                <div className="progress-bar">
                  <div className="fill baby"></div>
                  <div className="fill entertainment"></div>
                  <div className="fill healthcare"></div>
                  <div className="fill education"></div>
                </div>
              </AccountProgress>
              <div className="account-list">
                <div className="account-item">
                  <div className="dot baby"></div>
                  <span>Baby Care Account</span>
                  <span style={{ marginLeft: 'auto' }}>20%</span>
                </div>
                <div className="account-item">
                  <div className="dot entertainment"></div>
                  <span>Entertainment Account</span>
                  <span style={{ marginLeft: 'auto' }}>40%</span>
                </div>
                <div className="account-item">
                  <div className="dot healthcare"></div>
                  <span>Healthcare Account</span>
                  <span style={{ marginLeft: 'auto' }}>20%</span>
                </div>
              </div>
            </TrackingSection>

            <TransactionHistory>
              <h3>
               Latest Transactions
               
              </h3>
              <div className="transactions-container">
                {mockTransactions.map((transaction) => (
                  <div className="transaction" key={transaction.id}>
                    <LetterAvatar>
                      {transaction.type.charAt(0)}
                    </LetterAvatar>
                    <div className="details">
                      <span>{transaction.type}</span>
                      <span>{transaction.date}</span>
                      <span className="amount">{transaction.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TransactionHistory>
          </RightPanel>
        </MainContent>
      </DashboardContainer>
      
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup
          onClose={handleClosePopup}
          onCompleteProfile={handleCompleteProfile}
        />
      )}
    </Container>
    </ResponsiveStyles>
  );
};

export default Dashboard;
