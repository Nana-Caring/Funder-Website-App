import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/Authentication';
import * as S from './SettingsBase';

const CaregiverSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    pushNotifications: true,
    dependentAlerts: true,
    showBalance: true,
    monthlyReports: true
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

  return (
    <S.ScrollableContainer>
      <S.SettingsHeader>
        <h1>Settings</h1>
        <p>Manage your caregiver account and dependent controls</p>
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
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Notification Preferences</h3>
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
      </S.SettingsCard>

      <S.SettingsCard>
        <h3 style={{ marginBottom: '16px', color: '#185c37' }}>Account Actions</h3>
        <S.SettingItem>
          <div>
            <h4>Log Out</h4>
            <p>Sign out of your account on this device</p>
          </div>
          <button onClick={handleLogout}>Log Out</button>
        </S.SettingItem>
      </S.SettingsCard>
    </S.ScrollableContainer>
  );
};

export default CaregiverSettings;