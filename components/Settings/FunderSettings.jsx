import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/Authentication';
import * as S from './SettingsBase';

const FunderSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    pushNotifications: true,
    fundingAlerts: true,
    automaticFunding: false,
    monthlyReports: true,
    transactionApprovals: true,
    biometricAuth: false,
    highValueAlerts: true,
    beneficiaryManagement: true,
    scheduledPayments: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
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
        <p>Manage your funding preferences and security controls</p>
      </S.SettingsHeader>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Security Settings</h3>
        <S.SettingItem>
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Enhance account security with 2FA verification</p>
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
       
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Transaction Controls</h3>
        <S.SettingItem>
          <div>
            <h4>High-Value Transaction Alerts</h4>
            <p>Get notified for transactions above threshold</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.highValueAlerts}
              onChange={() => handleToggle('highValueAlerts')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Transaction Approvals</h4>
            <p>Review and approve dependent transactions</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.transactionApprovals}
              onChange={() => handleToggle('transactionApprovals')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Funding Preferences</h3>
        <S.SettingItem>
          <div>
            <h4>Automatic Funding</h4>
            <p>Enable scheduled automatic funding transfers</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.automaticFunding}
              onChange={() => handleToggle('automaticFunding')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Beneficiary Management</h4>
            <p>Manage and verify funding recipients</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.beneficiaryManagement}
              onChange={() => handleToggle('beneficiaryManagement')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Notifications</h3>
        <S.SettingItem>
          <div>
            <h4>Push Notifications</h4>
            <p>Receive instant updates about account activity</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            <span></span>
          </S.Toggle>
        </S.SettingItem>
        <S.SettingItem>
          <div>
            <h4>Monthly Reports</h4>
            <p>Receive detailed monthly funding reports</p>
          </div>
          <S.Toggle>
            <input
              type="checkbox"
              checked={settings.monthlyReports}
              onChange={() => handleToggle('monthlyReports')}
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

export default FunderSettings;