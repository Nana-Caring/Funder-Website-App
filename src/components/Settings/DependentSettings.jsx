import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/Authentication';
import * as S from './DependentBase';

const DependentSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    pushNotifications: true,
    transactionAlerts: true,
    showBalance: true,
    spendingAlerts: true,
    allowanceNotifications: true,
    caregiverApproval: true,
    instantNotifications: true,
    weeklyReports: true,
    biometricLogin: false
  });

  const [limits, setLimits] = useState({
    dailyLimit: 1000,
    monthlyLimit: 5000,
    transferLimit: 2000,
    onlineLimit: 1500
  });

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <S.ScrollableContainer>
      <S.SettingsHeader>
        <h1>Settings</h1>
        <p>Manage your account preferences and security settings</p>
      </S.SettingsHeader>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Security Settings</h3>
        <S.SettingItem>
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security to your account</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={() => handleToggle('twoFactorAuth')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Biometric Login</h4>
            <p>Use fingerprint or face recognition for quick access</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.biometricLogin}
              onChange={() => handleToggle('biometricLogin')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Orders</h3>
        <S.SettingItem>
          <div>
            <h4>Track Your Orders</h4>
            <p>View your order history and delivery status</p>
          </div>
          <button
            onClick={() => navigate('/dependent-orders')}
            style={{
              padding: '8px 16px',
              background: '#185c37',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Orders
          </button>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Spending Controls</h3>
        <S.SettingItem>
          <div>
            <h4>Daily Spending Limit</h4>
            <p>Maximum amount you can spend per day</p>
          </div>
          <input
            type="number"
            value={limits.dailyLimit}
            onChange={(e) => handleLimitChange('dailyLimit', e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '120px'
            }}
          />
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Online Purchase Limit</h4>
            <p>Maximum amount for online transactions</p>
          </div>
          <input
            type="number"
            value={limits.onlineLimit}
            onChange={(e) => handleLimitChange('onlineLimit', e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '120px'
            }}
          />
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Notification Preferences</h3>
        <S.SettingItem>
          <div>
            <h4>Transaction Alerts</h4>
            <p>Get notified for all transactions</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.transactionAlerts}
              onChange={() => handleToggle('transactionAlerts')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Allowance Notifications</h4>
            <p>Receive alerts when allowance is deposited</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.allowanceNotifications}
              onChange={() => handleToggle('allowanceNotifications')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Weekly Summary Reports</h4>
            <p>Receive weekly spending reports</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={() => handleToggle('weeklyReports')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Caregiver Controls</h3>
        <S.SettingItem>
          <div>
            <h4>Caregiver Approval</h4>
            <p>Require approval for purchases above limit</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.caregiverApproval}
              onChange={() => handleToggle('caregiverApproval')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Show Balance to Caregiver</h4>
            <p>Allow caregiver to view your balance</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.showBalance}
              onChange={() => handleToggle('showBalance')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Account Actions</h3>
        <S.SettingItem>
          <div>
            <h4>Log Out</h4>
            <p>Sign out of your account on this device</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </S.SettingItem>
      </S.SettingsCard>
    </S.ScrollableContainer>
  );
};

export default DependentSettings;