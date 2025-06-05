import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { PageContainer } from '../SharedStyles';
import personIcon from '../../assets/icons/person.png';
import editIcon from '../../assets/icons/edit.png';

const ScrollableContainer = styled(PageContainer)`
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

const ProfileWrapper = styled.div`
 width: 100%;
 
`;

const ProfileHeader = styled.div`
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
const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #185c37;

  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
`;

const ProfileCard = styled.div`
   background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    color: #185c37;
    font-size: 18px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }

  p {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin: 0;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #185c37;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(24, 92, 55, 0.1);
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #185c37;
    box-shadow: 0 0 0 2px rgba(24, 92, 55, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &.save {
    background: #185c37;
    color: white;
    &:hover { background: #134a2b; }
  }

  &.cancel {
    background: #f1f1f1;
    color: #666;
    &:hover { background: #e1e1e1; }
  }
`;

const PendingData = styled.span`
  color: #999;
  font-style: italic;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.status === 'Verified' ? '#e2e8f0' : '#185c37'};
  color: ${props => props.status === 'Verified' ? '#64748b' : 'white'};
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: ${props => props.status === 'Verified' ? 'default' : 'pointer'};
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.status === 'Verified' ? '#e2e8f0' : '#134a2b'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const DocumentInfo = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #666;
`;

const Profile = () => {
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [userData, setUserData] = useState({
    accountNumber: '••••••••',
    firstName: localStorage.getItem('firstName') || '...',
    lastName: localStorage.getItem('lastName') || '...',
    email: localStorage.getItem('email') || '...',
    role: localStorage.getItem('role') || 'User',
    phoneNumber: '•• ••• ••••',
    idNumber: '••••••••••••',
    address: 'Pending...',
    city: 'Pending...',
    postalCode: '••••',
    province: 'Pending...',
    country: 'South Africa',
    lastLogin: 'Recent',
    accountStatus: 'Active',
    kycStatus: 'Pending Verification',
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
    setEditedData({ ...editedData, [field]: userData[field] });
  };

  const handleSave = async (field) => {
    try {
      // Here you would typically make an API call to update the user data
      // await updateUserField(field, editedData[field]);
      
      setUserData({ ...userData, [field]: editedData[field] });
      localStorage.setItem(field, editedData[field]);
      setEditMode({ ...editMode, [field]: false });
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setEditedData({ ...editedData, [field]: userData[field] });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      // Here you would typically upload the file to your server
      // const formData = new FormData();
      // formData.append('kycDocument', file);
      // await api.uploadKYCDocument(formData);
      
      // Simulating upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStatus('Document uploaded successfully');
      // Update KYC status in userData
      setUserData(prev => ({
        ...prev,
        kycStatus: 'Under Review'
      }));
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const renderEditableField = (field, label, isPending = false) => (
    <InfoItem>
      <label>{label}</label>
      {editMode[field] ? (
        <>
          <Input
            value={editedData[field] || ''}
            onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
            placeholder={isPending ? 'Enter data' : ''}
          />
          <ButtonGroup>
            <ActionButton className="save" onClick={() => handleSave(field)}>Save</ActionButton>
            <ActionButton className="cancel" onClick={() => handleCancel(field)}>Cancel</ActionButton>
          </ButtonGroup>
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isPending ? (
            <PendingData>Pending...</PendingData>
          ) : (
            <p>{userData[field]}</p>
          )}
          <EditButton onClick={() => handleEdit(field)}>
            <img src={editIcon} alt="Edit" />
          </EditButton>
        </div>
      )}
    </InfoItem>
  );

  return (
    <ScrollableContainer>
      <ProfileWrapper>
        <ProfileHeader>
          <h1>Account Profile</h1>
          <p>Manage your personal information and account details</p>
        </ProfileHeader>

        <ProfileCard>
          <Section>
            <h3>Account Information</h3>
            <Grid>
              <InfoItem>
                <label>Account Number</label>
                <p>{userData.accountNumber}</p>
              </InfoItem>
              <InfoItem>
                <label>Account Status</label>
                <p>{userData.accountStatus}</p>
              </InfoItem>
              <InfoItem>
                <label>KYC Status</label>
                <p style={{ color: userData.kycStatus === 'Pending Verification' ? '#f59e0b' : '#185c37' }}>
                  {userData.kycStatus}
                </p>
              </InfoItem>
              <InfoItem>
                <label>Account Created</label>
                <p>{userData.createdAt}</p>
              </InfoItem>
              <InfoItem>
                <label>KYC Document</label>
                <div>
                  <HiddenInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <UploadButton
                    onClick={handleUploadClick}
                    status={userData.kycStatus}
                    disabled={userData.kycStatus === 'Verified'}
                  >
                    {userData.kycStatus === 'Verified' ? 'Verified ✓' : 'Upload Document'}
                  </UploadButton>
                  {uploadStatus && (
                    <DocumentInfo>
                      {uploadStatus}
                    </DocumentInfo>
                  )}
                  {selectedFile && (
                    <DocumentInfo>
                      Selected file: {selectedFile.name}
                    </DocumentInfo>
                  )}
                </div>
              </InfoItem>
            </Grid>
          </Section>

          <Section>
            <h3>Personal Information</h3>
            <Grid>
              {renderEditableField('phoneNumber', 'Phone Number', true)}
              {renderEditableField('email', 'Email Address')}
              {renderEditableField('idNumber', 'ID Number', true)}
            </Grid>
          </Section>

          <Section>
            <h3>Contact Information</h3>
            <Grid>
              {renderEditableField('address', 'Street Address', true)}
              {renderEditableField('city', 'City', true)}
              {renderEditableField('province', 'Province', true)}
              {renderEditableField('postalCode', 'Postal Code', true)}
            </Grid>
          </Section>

          <Section>
            <h3>Security Information</h3>
            <Grid>
              <InfoItem>
                <label>Last Login</label>
                <p>{userData.lastLogin}</p>
              </InfoItem>
              <InfoItem>
                <label>Two-Factor Authentication</label>
                <p style={{ color: '#dc2626' }}>Not Enabled</p>
              </InfoItem>
            </Grid>
          </Section>
        </ProfileCard>
      </ProfileWrapper>
    </ScrollableContainer>
  );
};

export default Profile;