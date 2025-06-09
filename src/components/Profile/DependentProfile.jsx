import React, { useState, useEffect, useRef } from 'react';
import * as S from './DependentStyles';
import editIcon from '../../assets/icons/edit.png';

const DependentProfile = () => {
  const [editMode, setEditMode] = useState({});
  const [userData, setUserData] = useState({
    accountNumber: '••••••••',
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    idNumber: '••••••••••••',
    caregiverName: 'Jane Smith',
    monthlyAllowance: 'R2,000',
    spendingLimit: 'R500',
    accountStatus: 'Active',
    kycStatus: 'Pending',
    accountType: 'Student',
    lastTransaction: '2024-06-08',
    accountCreated: '2024-01-01'
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploadStatus('Uploading...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('Document uploaded successfully');
      setUserData(prev => ({
        ...prev,
        kycStatus: 'Under Review'
      }));
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <S.ScrollableContainer>
      <S.ProfileWrapper>
        <S.ProfileHeader>
          <h1>Profile</h1>
          <p>Manage your dependent account information and preferences</p>
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
                <label>Account Status</label>
                <p style={{ color: '#185c37' }}>{userData.accountStatus}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Caregiver Name</label>
                <p>{userData.caregiverName}</p>
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
            <h3>Verification Status</h3>
            <S.Grid>
              <S.InfoItem>
                <label>KYC Status</label>
                <p style={{ color: userData.kycStatus === 'Completed' ? '#185c37' : '#f59e0b' }}>
                  {userData.kycStatus}
                </p>
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={handleUploadClick}
                    style={{
                      padding: '8px 16px',
                      background: userData.kycStatus === 'Completed' ? '#e2e8f0' : '#185c37',
                      color: userData.kycStatus === 'Completed' ? '#64748b' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: userData.kycStatus === 'Completed' ? 'default' : 'pointer',
                      fontSize: '14px'
                    }}
                    disabled={userData.kycStatus === 'Completed'}
                  >
                    {userData.kycStatus === 'Completed' ? 'Verified ✓' : 'Upload Document'}
                  </button>
                  {uploadStatus && (
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                      {uploadStatus}
                    </p>
                  )}
                </div>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Created</label>
                <p>{userData.accountCreated}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Account Limits & Activity</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Monthly Allowance</label>
                <p style={{ color: '#185c37' }}>{userData.monthlyAllowance}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Daily Spending Limit</label>
                <p style={{ color: '#185c37' }}>{userData.spendingLimit}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Last Transaction</label>
                <p>{userData.lastTransaction}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>ID Number</label>
                <p>{userData.idNumber}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>
        </S.ProfileCard>
      </S.ProfileWrapper>
    </S.ScrollableContainer>
  );
};

export default DependentProfile;