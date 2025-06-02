import React, { useState } from 'react';
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
  ArrowBack,
  ExpandMore
} from '@mui/icons-material';
import PaymentModal from '../PaymentModal/PaymentModal';
import { Avatar, Modal, IconButton } from '@mui/material';
/* 
  Outer container that holds the main dashboard area.
*/
const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  position: relative;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

/* 
  The main area (right side) after the sidebar.
  It includes a top header and the main content below it.
*/
const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
`;

/* 
  Main content area below the header:
  We want two columns:
    - Left column (balance, card, quick actions)
    - Right column (tracking, transaction history)
*/
const MainContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 0;
  width: 100%;
  
  
  > div {
    &:first-child {
      flex: 1.5;
      min-width: 300px;
    }
    &:last-child {
      flex: 1;
      min-width: 250px;
    }
  }
`;

const BalanceCard = styled.div`
  background-color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer; /* Add cursor pointer to indicate clickability */

  span {
    font-size: 16px;
    font-weight: 400;
    color: #333; /* Darker text color */
  }
`;

const BalanceDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align text to the right */

  span {
    font-size: 14px;
    font-weight: 400;
    color: #333; /* Darker text color */
  }
`;

import cardBg from '../../assets/card.jpg';

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
  filter: blur(1px);
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
  padding: 16px;
  border-radius: 12px;

  display: flex;
  gap: 12px;
  margin-top: 16px;

  .action-card {
    flex: 1;
    background: white;
    padding: 8px;
    border-radius: 12px;
    height: 200px;
    overflow-y: auto;

    &:first-child {
      flex: 0.7;
      height: 160px;
      overflow-y: visible;
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
      


      .to-text {
        text-align: center;
        margin: 4px 0;
        color: #666;
      }

      .request-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background: #e0e0e0;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background-color 0.2s ease;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: #d0d0d0;
        }
        .request-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-family: Poppins, sans-serif;

          span:first-child {

            color: #111;
          }

          span:last-child {
            font-size: 12px;
            color: #333;
          }
        }

        .request-amount {
          font-weight: 600;
          color: #111;
        }

        .more-options {
          color: #333;
          font-weight: bold;
          cursor: pointer;
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
  margin-right: 8px;
  flex-direction: column;
  gap: 0;
  padding: 0;
  
`;

const TrackingSection = styled.div`
  background: white;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 0px;
   font-family: 'Poppins', sans-serif;
  

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    gap: 12px;
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
      &.education { background: #4caf50; }
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
  margin-top:0;
  background: white;
  padding: 4px;
  border-radius: 12px;

  
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 8px 0;

    .search-icon {
      cursor: pointer;
      color: #666;
    }
  }

  .transaction {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    padding: 4px;
    background: #e0e0e0;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    gap: 24px;

    &:hover {
      background: #d0d0d0;
    }

    .avatar {
     
      width: 32px;
      height: 32px;
    }

    .details {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      
      h4 {
        margin: 0;
        font-size: 14px;
        color: #333;
      }
      p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
    }

    .amount {
      color: rgb(5, 1, 3);
     
     
    }
  }
`;

const AccountsDropdown = styled.div`
  position: absolute;
  /* Adjust top based on the height of BalanceCard and its margin */
  top: calc(12px + 20px + 12px + 6px + 4px); /* Padding top + bottom + border + margin bottom + gap */
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;
  padding: 8px 0;
  /* margin-top: 4px; /* Small gap below the card */

  span {
    display: block;
    padding: 8px 20px;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const DependentHome = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showAccountsDropdown, setShowAccountsDropdown] = useState(false); // New state for dropdown

  const toggleAccountsDropdown = () => {
    setShowAccountsDropdown(!showAccountsDropdown);
  };

  return (
    <Container>
     
     
      {/* --- MAIN DASHBOARD AREA --- */}
      <DashboardContainer>
        <MainContent>
          <div style={{ position: 'relative' }}> {/* Add relative positioning for the dropdown */}
            <BalanceCard onClick={toggleAccountsDropdown}> {/* Add click handler to the card itself */}
              <AccountInfo> {/* Remove click handler from AccountInfo */}
                <span>Nana Main Transact Account</span>
                <ExpandMore style={{ color: '#333' }} />
              </AccountInfo>
              <BalanceDetails>
                <span>Avail R500</span>
                <span>Bal R3,000</span>
              </BalanceDetails>
            </BalanceCard>

            {showAccountsDropdown && (
              <AccountsDropdown>
                <span>Savings Account</span>
                <span>Checking Account</span>
                <span>Another Account</span>
              </AccountsDropdown>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <NanaCardWrapper>
                <NanaCardShadow />
                <NanaCard>
                  <div className="card-name">Nana Card</div>
                </NanaCard>
              </NanaCardWrapper>
            </div>

            <QuickActions>
              <div className="action-card">
                <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Quick Transfer</h3>
                <div style={{ marginBottom: '16px' }}>
                  <select className="transfer-select" style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <option>Main Account</option>
                  </select>
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '12px', margin: '8px 0' }}>Coming soon</div>
                  <select className="transfer-select" style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
                    <option>Choose Account</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    background: '#e0e0e0', 
                    color: '#333', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Send Money
                </button>
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
                  <div className="request-item">
                    <div className="request-details">
                      <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                    
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                    <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                   
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                    <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                      <span  >R10 000</span>
                      <span >...</span>
                    </div>
                    
                  </div>
                  
                </div>
                {/* <button>See All</button> */}
              </div>
            </QuickActions>
          </div>

          {/* RIGHT COLUMN */}
          <RightPanel>
            <TrackingSection>
              
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
                <div className="account-item">
                  <div className="dot education"></div>
                  <span>Education</span>
                  <span style={{ marginLeft: 'auto' }}>20%</span>
                </div>
              </div>
            </TrackingSection>

            <TransactionHistory>
              <h3>
               Latest Transactions
               
              </h3>
              <div className="transaction">
                <Avatar className="avatar" />
                <div className="details">
                  <span>School fees</span>
                  <span>11-feb-25 11:00 AM</span>
                  <span className="amount">-R10 000</span>
                </div>
               
              </div>
              <div className="transaction">
                <Avatar className="avatar" />
                <div className="details">
                  <span>School fees</span>
                  <span>11-feb-25 11:00 AM</span>
                  <span className="amount">-R10 000</span>
                </div>
               
              </div>
              <div className="transaction">
                <Avatar className="avatar" />
                <div className="details">
                  <span>School fees</span>
                  <span>11-feb-25 11:00 AM</span>
                  <span className="amount">-R10 000</span>
                </div>
                
              </div>
            </TransactionHistory>
          </RightPanel>
        </MainContent>
      </DashboardContainer>
    </Container>
  );
};

export default DependentHome;
