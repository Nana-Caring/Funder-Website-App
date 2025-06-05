import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/Authentication';

const SettingsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  
`;

const SettingItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #185c37;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const LogoutButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #ff0000;
  }
`;

const ScrollableContainer = styled.div`
  height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 20px;
  margin-left: 200px; /* Adjust this value to match the width of your sidebar */
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #555;
    }
  }
`;

const DangerButton = styled.button`
  background: ${props => props.variant === 'delete' ? '#ff4444' : '#fff'};
  color: ${props => props.variant === 'delete' ? '#fff' : '#ff4444'};
  border: 1px solid #ff4444;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: ${props => props.marginLeft ? '12px' : '0'};

  &:hover {
    background: ${props => props.variant === 'delete' ? '#ff0000' : '#fff5f5'};
  }
`;

const AccountActionItem = styled(SettingItem)`
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  .actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
`;

const SettingsHeader = styled.div`
  background: #185c37;
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 8px 0 0;
    opacity: 0.9;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  input {
    width: 120px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #185c37;
    }
  }
`;

const SaveButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #134a2b;
  }
`;

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    pushNotifications: true,
    emailNotifications: true,
    transactionAlerts: true,
    showBalance: true,
    darkMode: false
  });

  const [limits, setLimits] = useState({
    dailyLimit: 5000,
    monthlyLimit: 50000,
    transferLimit: 10000
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLimitChange = (limit, value) => {
    setLimits(prev => ({
      ...prev,
      [limit]: Number(value)
    }));
  };

  return (
    <ScrollableContainer>
      <SettingsHeader>
        <h1>Account Settings</h1>
        <p>Manage your account preferences and security settings</p>
      </SettingsHeader>

      <SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Bank Account Settings</h3>
        
        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Daily Transaction Limit</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Maximum amount for daily transactions
            </p>
          </div>
          <InputGroup>
            <span>R</span>
            <input
              type="number"
              value={limits.dailyLimit}
              onChange={(e) => handleLimitChange('dailyLimit', e.target.value)}
              min="0"
              max="100000"
            />
            <SaveButton onClick={() => console.log('Saving daily limit...')}>
              Save
            </SaveButton>
          </InputGroup>
        </SettingItem>

        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Monthly Spending Limit</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Maximum amount for monthly transactions
            </p>
          </div>
          <InputGroup>
            <span>R</span>
            <input
              type="number"
              value={limits.monthlyLimit}
              onChange={(e) => handleLimitChange('monthlyLimit', e.target.value)}
              min="0"
              max="1000000"
            />
            <SaveButton onClick={() => console.log('Saving monthly limit...')}>
              Save
            </SaveButton>
          </InputGroup>
        </SettingItem>

        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Transfer Limit</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Maximum amount per transfer
            </p>
          </div>
          <InputGroup>
            <span>R</span>
            <input
              type="number"
              value={limits.transferLimit}
              onChange={(e) => handleLimitChange('transferLimit', e.target.value)}
              min="0"
              max="50000"
            />
            <SaveButton onClick={() => console.log('Saving transfer limit...')}>
              Save
            </SaveButton>
          </InputGroup>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Security Settings</h3>
        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Two-Factor Authentication</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Add an extra layer of security to your account
            </p>
          </div>
          <Toggle>
            <input 
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={() => handleToggle('twoFactorAuth')}
            />
            <span/>
          </Toggle>
        </SettingItem>
        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Show Account Balance</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Display balance on dashboard
            </p>
          </div>
          <Toggle>
            <input 
              type="checkbox"
              checked={settings.showBalance}
              onChange={() => handleToggle('showBalance')}
            />
            <span/>
          </Toggle>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Notification Preferences</h3>
        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Push Notifications</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Receive push notifications for important updates
            </p>
          </div>
          <Toggle>
            <input 
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            <span/>
          </Toggle>
        </SettingItem>
        <SettingItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Transaction Alerts</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Get notified for all transactions
            </p>
          </div>
          <Toggle>
            <input 
              type="checkbox"
              checked={settings.transactionAlerts}
              onChange={() => handleToggle('transactionAlerts')}
            />
            <span/>
          </Toggle>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Account Management</h3>
        
        <AccountActionItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Session Management</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              End your current session
            </p>
          </div>
          <div className="actions">
            <DangerButton onClick={handleLogout} style={{ padding: '6px 12px' }}>
              Logout
            </DangerButton>
          </div>
        </AccountActionItem>

        <AccountActionItem>
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>Account Deactivation</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Temporarily disable your account. You can reactivate it anytime.
            </p>
          </div>
          <div className="actions">
            <DangerButton 
              onClick={() => {
                if (window.confirm('Are you sure you want to deactivate your account?')) {
                  // Add deactivation logic here
                }
              }}
            >
              Deactivate Account
            </DangerButton>
          </div>
        </AccountActionItem>

        <AccountActionItem style={{ borderBottom: 'none' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#ff4444' }}>Delete Account</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <div className="actions">
            <DangerButton 
              variant="delete"
              onClick={() => {
                if (window.confirm('WARNING: This action cannot be undone. Are you sure you want to permanently delete your account?')) {
                  // Add deletion logic here
                }
              }}
            >
              Delete Account
            </DangerButton>
          </div>
        </AccountActionItem>
      </SettingsCard>
    </ScrollableContainer>
  );
};

export default Settings;