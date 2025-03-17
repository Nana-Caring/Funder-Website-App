import React from 'react';
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
} from '@mui/icons-material';
import { Avatar } from '@mui/material';

/* 
  Outer container that holds sidebar on the left
  and the main dashboard area on the right.
*/
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 80vw;
  background-color: #f8f8f8;
  overflow: hidden;
  position: relative;
`;







/* 
  The main area (right side) after the sidebar.
  It includes a top header and the main content below it.
*/
const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width:100%;
`;


/* 
  The top header (white bar) with the greeting
  and icons on the right.
*/
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: 100%;
  margin: 0;
  box-sizing: border-box;

  h2 {
    font-size: 20px;
    color: #333;
    margin: 0;
  }

  .icons {
    display: flex;
    gap: 15px;
    align-items: center;

    svg {
      cursor: pointer;
      color: #666;
      font-size: 20px;
    }
  }
`;

/* 
  Main content area below the header:
  We want two columns:
    - Left column (balance, card, quick actions)
    - Right column (tracking, transaction history)
*/
const MainContent = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px;
  height: calc(100vh - 60px);
  overflow: hidden;
  width:100%;
  
  > div {
    flex: 1;
    min-width: 300px;
    height: 100%;
  }
`;

const BalanceCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .balance-row {
    display: flex;
    justify-content: space-between;
  }

  .balance-item {
    h3 {
      font-size: 12px;
      color: #666;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 18px;
      color: #333;
      margin: 0;
      font-weight: 600;
    }
  }
`;

const NanaCard = styled.div`
  background: #000;
  color: white;
  padding: 10px;
  border-radius: 12px;
  aspect-ratio: 2;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;

  .card-number {
    font-size: 14px;
    letter-spacing: 2px;
    margin-top: 25px;
  }

  .card-name {
    font-size: 12px;
    margin-top: 4px;
  }

  .visa-logo {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .nana-logo {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 14px;
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  gap: 16px;

  .action-card {
    flex: 1;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    &:first-child {
      flex: 0.8; /* Reduce width of Quick Transfer component */
    }

    h3 {
      font-size: 14px;
      color: #333;
      margin: 0 0 6px 0;
    }

    .users {
      display: flex;
      align-items: center;
      margin: 8px 0;
      
      .avatar {
        margin-right: 8px;
        border: 2px solid white;
        width: 28px;
        height: 28px;
      }

      .arrow-icon {
        width: 20px;
        height: 20px;
        margin-left: 4px;
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
        padding: 12px;
        background: #f8f8f8;
        border-radius: 8px;
        margin-bottom: 8px;

        .request-details {
          display: flex;
          flex-direction: column;
          gap: 4px;

          span:first-child {
            font-weight: 500;
            color: #333;
          }

          span:last-child {
            font-size: 12px;
            color: #666;
          }
        }

        .request-amount {
          font-weight: 500;
          color: #333;
        }

        .more-options {
          color: #666;
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
      background: #f72c9d;
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
 
  padding: 20px;
`;

const TrackingSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    gap: 15px;
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
  margin-bottom: 15px;

  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
  }

  .progress-bar {
    height: 30px;
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

const TransactionHistory = styled.div`
  margin-top: 20px;
  
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 20px 0;

    .search-icon {
      cursor: pointer;
      color: #666;
    }
  }

  .transaction {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .avatar {
      margin-right: 12px;
    }

    .details {
      flex: 1;
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
      color: #ff4081;
      font-weight: 600;
    }
  }
`;

const Dashboard = () => {
  return (
    <Container>
     
     
      {/* --- MAIN DASHBOARD AREA --- */}
      <DashboardContainer>
        {/* HEADER */}
        <Header>
          <h2>Welcome Back, Mr Prince</h2>
          <div className="icons">
            <Notifications />
            <Settings />
            <Person />
          </div>
        </Header>

        {/* MAIN CONTENT (2 columns) */}
        <MainContent>
          {/* LEFT COLUMN */}
          <div>
            <BalanceCard>
              <div className="balance-row">
                <div className="balance-item">
                  <h3>Current Balance</h3>
                  <p>R10 000</p>
                </div>
                <div className="balance-item">
                  <h3>Money Out</h3>
                  <p>-R10 000</p>
                </div>
              </div>
            </BalanceCard>

            <NanaCard>
              <div className="nana-logo">Nana Card</div>
              <div className="card-number">1234 5678 9101 1121</div>
              <div className="card-name">MR PRINCE</div>
              <div className="visa-logo">Visa</div>
            </NanaCard>

            <QuickActions>
              <div className="action-card">
                <h3>Quick Transfer</h3>
                <div className="users">
                  <Avatar className="avatar" alt="Tim" src="/src/assets/avatars/avatar1.png" />
                  <Avatar className="avatar" alt="Daughter" src="/src/assets/avatars/avatar2.png" />
                  <Avatar className="avatar" alt="Chris" src="/src/assets/avatars/avatar3.png" />
                  <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
                </div>
                <select className="transfer-select">
                  <option>Select Account</option>
                  <option>Savings Account</option>
                  <option>Checking Account</option>
                </select>
                <button>Send Money</button>
              </div>
              <div className="action-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Manage Requests</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '14px' }}>see all</span>
                    <img src="/src/assets/icons/arrow.png" alt="arrow" style={{ width: '16px', height: '16px', color: '#666' }} />
                  </div>
                </div>
                <div className="deposit-selects">
                  <div className="request-item">
                    <div className="request-details">
                      <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                    </div>
                    <div className="request-amount">R10 000</div>
                    <span className="more-options">...</span>
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                      <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                    </div>
                    <div className="request-amount">R10 000</div>
                    <span className="more-options">...</span>
                  </div>
                  <div className="request-item">
                    <div className="request-details">
                      <span>Charity Matlapo</span>
                      <span>Healthcare</span>
                    </div>
                    <div className="request-amount">R10 000</div>
                    <span className="more-options">...</span>
                  </div>
                </div>
                <button>See All</button>
              </div>
            </QuickActions>
          </div>

          {/* RIGHT COLUMN */}
          <RightPanel>
            <TrackingSection>
              <div className="icons-container">
                <Avatar alt="Parent" src="/src/assets/avatars/avatar2.png"  />
                <Avatar alt="Child" src="/src/assets/avatars/avatar3.png"  />
                <img src="/src/assets/icons/arrow.png" alt="arrow" className="arrow-icon" />
              </div>
              <h3>Track how your child use her money.</h3>
              <div className="total">00</div>
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
                Transaction History
                <Search className="search-icon" />
              </h3>
              <div className="transaction">
                <Avatar className="avatar" />
                <div className="details">
                  <h4>School fees</h4>
                  <p>11-feb-25 11:00 AM</p>
                </div>
                <div className="amount">-R10 000</div>
              </div>
              <div className="transaction">
                <Avatar className="avatar" />
                <div className="details">
                  <h4>School fees</h4>
                  <p>11-feb-25 11:00 AM</p>
                </div>
                <div className="amount">-R10 000</div>
              </div>
            </TransactionHistory>
          </RightPanel>
        </MainContent>
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;
