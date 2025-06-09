import React, { useState, useEffect, useRef } from 'react';
import * as S from './ProfileStyles';
import editIcon from '../../assets/icons/edit.png';

const CaregiverProfile = () => {
  const [editMode, setEditMode] = useState({});
  const [userData, setUserData] = useState({
    accountNumber: '••••••••',
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    idNumber: '••••••••••••',
    dependentsCount: '2',
    accessLevel: 'Full Access',
    verificationStatus: 'Verified',
    kycStatus: 'Completed',
    supervisionLevel: 'Primary Caregiver',
    accountType: 'Caregiver',
    lastActivity: '2024-06-08',
    accountCreated: '2024-01-01',
    dependentNames: ['John Doe', 'Jane Doe'],
    monthlyReport: 'Available',
    alertPreferences: 'All Transactions'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const storedName = localStorage.getItem('name') || '';
    const storedSurname = localStorage.getItem('surname') || '';
    const storedEmail = localStorage.getItem('email') || '';
    const storedPhone = localStorage.getItem('phoneNumber') || '';

    setUserData(prev => ({
      ...prev,
      name: storedName,
      surname: storedSurname,
      email: storedEmail,
      phoneNumber: storedPhone
    }));
  }, []);

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  return (
    <S.ScrollableContainer>
      <S.ProfileWrapper>
        <S.ProfileHeader>
          <h1>Caregiver Profile</h1>
          <p>Manage your caregiver account and dependent oversight</p>
        </S.ProfileHeader>

        <S.ProfileCard>
          <S.Section>
            <h3>Account Information</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Account Number</label>
                <p>{userData.accountNumber}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Type</label>
                <p>{userData.accountType}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Access Level</label>
                <p style={{ color: '#185c37' }}>{userData.accessLevel}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Supervision Level</label>
                <p style={{ color: '#185c37' }}>{userData.supervisionLevel}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Personal Information</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Name</label>
                <div className="value-container">
                  <p>{userData.name || 'Not provided'}</p>
                  <img src={editIcon} alt="Edit" className="edit-icon" onClick={() => handleEdit('name')} />
                </div>
              </S.InfoItem>
              <S.InfoItem>
                <label>Surname</label>
                <div className="value-container">
                  <p>{userData.surname || 'Not provided'}</p>
                  <img src={editIcon} alt="Edit" className="edit-icon" onClick={() => handleEdit('surname')} />
                </div>
              </S.InfoItem>
              <S.InfoItem>
                <label>Email Address</label>
                <div className="value-container">
                  <p>{userData.email || 'Not provided'}</p>
                  <img src={editIcon} alt="Edit" className="edit-icon" onClick={() => handleEdit('email')} />
                </div>
              </S.InfoItem>
              <S.InfoItem>
                <label>Phone Number</label>
                <div className="value-container">
                  <p>{userData.phoneNumber || 'Not provided'}</p>
                  <img src={editIcon} alt="Edit" className="edit-icon" onClick={() => handleEdit('phoneNumber')} />
                </div>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Dependent Management</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Number of Dependents</label>
                <p>{userData.dependentsCount}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Dependent Names</label>
                <div>
                  {userData.dependentNames.map((name, index) => (
                    <p key={index} style={{ marginBottom: '4px' }}>{name}</p>
                  ))}
                </div>
              </S.InfoItem>
              <S.InfoItem>
                <label>Monthly Report Status</label>
                <p style={{ color: '#185c37' }}>{userData.monthlyReport}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Alert Preferences</label>
                <p>{userData.alertPreferences}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Verification Status</h3>
            <S.Grid>
              <S.InfoItem>
                <label>KYC Status</label>
                <p style={{ color: '#185c37' }}>{userData.kycStatus}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Verification Level</label>
                <p style={{ color: '#185c37' }}>{userData.verificationStatus}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Last Activity</label>
                <p>{userData.lastActivity}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Created</label>
                <p>{userData.accountCreated}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>
        </S.ProfileCard>
      </S.ProfileWrapper>
    </S.ScrollableContainer>
  );
};

export default CaregiverProfile;