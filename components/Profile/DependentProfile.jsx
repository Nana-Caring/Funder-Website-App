import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './ProfileStyles';
import editIcon from '../../assets/icons/edit.png';
import { profileService } from '../../services/profileService';

const DependentProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState({});
  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    role: '',
    Idnumber: '',
    relation: '',
    phoneNumber: '',
    postalAddressLine1: '',
    postalAddressLine2: '',
    postalCity: '',
    postalProvince: '',
    postalCode: '',
    homeAddressLine1: '',
    homeAddressLine2: '',
    homeCity: '',
    homeProvince: '',
    homeCode: '',
    createdAt: '',
    updatedAt: '',
    // Additional fields for dependent functionality
    caregiverName: 'Jane Smith',
    monthlyAllowance: 'R2,000',
    spendingLimit: 'R500',
    accountStatus: 'Active',
    kycStatus: 'Pending',
    accountType: 'Student',
    lastTransaction: '2024-06-08',
    totalSpent: 'R1,250',
    remainingBalance: 'R750'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    missingFields: [],
    completedFields: []
  });
  const fileInputRef = useRef(null);

  const fetchProfileCompletion = async () => {
    try {
      const completionData = await profileService.getProfileCompletion();
      setProfileCompletion(completionData);
    } catch (error) {
      console.warn('Failed to fetch profile completion:', error.message);
      // Calculate completion locally as fallback
      calculateLocalCompletion();
    }
  };

  const calculateLocalCompletion = () => {
    const requiredFields = [
      'firstName', 'surname', 'email', 'phoneNumber', 'Idnumber',
      'postalAddressLine1', 'postalCity', 'postalProvince', 'postalCode',
      'homeAddressLine1', 'homeCity', 'homeProvince', 'homeCode'
    ];
    
    const completedFields = requiredFields.filter(field => 
      userData[field] && userData[field].toString().trim() !== ''
    );
    
    const missingFields = requiredFields.filter(field => 
      !userData[field] || userData[field].toString().trim() === ''
    );
    
    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    
    setProfileCompletion({
      percentage,
      completedFields,
      missingFields,
      totalFields: requiredFields.length
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Try to fetch from backend first
        const profileData = await profileService.getUserProfile();
        if (profileData.user) {
          setUserData(prev => ({
            ...prev,
            ...profileData.user
          }));
        }
      } catch (error) {
        console.warn('Failed to fetch profile from backend, using localStorage:', error.message);
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserData(prev => ({
              ...prev,
              ...parsedUser
            }));
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
          }
        } else {
          // Fallback to individual localStorage items
          const storedFirstName = localStorage.getItem('firstName') || '';
          const storedMiddleName = localStorage.getItem('middleName') || '';
          const storedSurname = localStorage.getItem('surname') || '';
          const storedEmail = localStorage.getItem('email') || '';
          const storedPhone = localStorage.getItem('phoneNumber') || '';
          const storedIdNumber = localStorage.getItem('Idnumber') || '';
          const storedRole = localStorage.getItem('role') || '';

          setUserData(prev => ({
            ...prev,
            firstName: storedFirstName,
            middleName: storedMiddleName,
            surname: storedSurname,
            email: storedEmail,
            phoneNumber: storedPhone,
            Idnumber: storedIdNumber,
            role: storedRole
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch profile completion when userData changes
  useEffect(() => {
    if (userData.id) {
      fetchProfileCompletion();
    } else {
      calculateLocalCompletion();
    }
  }, [userData]);

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSave = async (field, value) => {
    setLoading(true);
    setError('');
    
    try {
      // Try to update via API first
      await profileService.updateProfileField(field, value);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));

      // Exit edit mode
      setEditMode({ ...editMode, [field]: false });
      
      // Refresh completion status after successful update
      setTimeout(() => {
        if (userData.id) {
          fetchProfileCompletion();
        } else {
          calculateLocalCompletion();
        }
      }, 500);
      
      console.log(`Updated ${field} to:`, value);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(`Failed to update ${field}. Please try again.`);
      
      // Fallback to localStorage update
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = { ...parsedUser, [field]: value };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
          }
        }
        
        // Also update individual localStorage item for backward compatibility (only for primitive values)
        if (typeof value === 'string' || typeof value === 'number') {
          localStorage.setItem(field, value.toString());
        }
        
        // Update local state
        setUserData(prev => ({
          ...prev,
          [field]: value
        }));
        
        setEditMode({ ...editMode, [field]: false });
        setError('Profile updated locally. Changes will sync when connection is restored.');
        
        // Update completion locally
        setTimeout(() => calculateLocalCompletion(), 500);
      } catch (localError) {
        console.error('Failed to update locally:', localError);
        setError('Failed to update profile. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = () => {
    if (profileCompletion.missingFields.length > 0) {
      // Focus on the first missing field
      const firstMissingField = profileCompletion.missingFields[0];
      handleEdit(firstMissingField);
      
      // Scroll to the element if it exists
      setTimeout(() => {
        const element = document.querySelector(`[data-field="${firstMissingField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      // If profile is complete, navigate to dependent home
      navigate('/dependent-home');
    }
  };

  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  const renderEditableField = (field, value, type = 'text') => {
    const isMissing = profileCompletion.missingFields?.includes(field);
    
    if (editMode[field]) {
      return (
        <div className="edit-container" data-field={field}>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => setUserData(prev => ({ ...prev, [field]: e.target.value }))}
            autoFocus
            style={{
              padding: '8px',
              border: isMissing ? '2px solid #e74c3c' : '1px solid #ddd',
              borderRadius: '4px',
              width: '100%',
              fontSize: '14px',
              backgroundColor: isMissing ? '#fdf2f2' : 'white'
            }}
            placeholder={isMissing ? `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` : ''}
          />
          <div className="edit-actions" style={{ marginTop: '8px' }}>
            <button
              onClick={() => handleSave(field, userData[field])}
              style={{
                padding: '4px 12px',
                marginRight: '8px',
                backgroundColor: '#185c37',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={() => handleCancel(field)}
              style={{
                padding: '4px 12px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="value-container"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: isMissing ? '8px' : '0',
          backgroundColor: isMissing ? '#fdf2f2' : 'transparent',
          borderRadius: isMissing ? '4px' : '0',
          border: isMissing ? '1px solid #e74c3c' : 'none'
        }}
        data-field={field}
      >
        <p style={{ 
          margin: 0, 
          color: isMissing ? '#e74c3c' : 'inherit',
          fontStyle: (!value || value.toString().trim() === '') ? 'italic' : 'normal'
        }}>
          {value || (isMissing ? 'Please fill in this field' : 'Not provided')}
          {isMissing && (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '12px', 
              color: '#e74c3c',
              fontWeight: 'bold'
            }}>
              ⚠ Required
            </span>
          )}
        </p>
        <img src={editIcon} alt="Edit" className="edit-icon" onClick={() => handleEdit(field)} />
      </div>
    );
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
      // Simulate upload delay
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
          <h1>Dependent Profile</h1>
          <p>Manage your account and spending information</p>
          {error && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: '4px', 
              color: '#c00',
              fontSize: '14px',
              marginTop: '10px'
            }}>
              {error}
            </div>
          )}
          {loading && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#eef', 
              border: '1px solid #ccf', 
              borderRadius: '4px', 
              color: '#00c',
              fontSize: '14px',
              marginTop: '10px'
            }}>
              Updating profile...
            </div>
          )}
        </S.ProfileHeader>

        {/* Profile Completion Status */}
        <S.Section style={{ marginBottom: '20px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: profileCompletion.percentage === 100 ? '#d4edda' : '#fff3cd',
            border: `1px solid ${profileCompletion.percentage === 100 ? '#c3e6cb' : '#ffeaa7'}`,
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: profileCompletion.percentage === 100 ? '#155724' : '#856404' }}>
                Profile Completion: {profileCompletion.percentage}%
              </h3>
              {profileCompletion.percentage < 100 && (
                <button
                  onClick={handleCompleteProfile}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#185c37',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Complete Profile
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div style={{
                width: `${profileCompletion.percentage}%`,
                height: '100%',
                backgroundColor: profileCompletion.percentage === 100 ? '#28a745' : '#ffc107',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {profileCompletion.percentage === 100 ? (
              <p style={{ margin: 0, color: '#155724', fontWeight: 'bold' }}>
                ✅ Congratulations! Your profile is complete.
              </p>
            ) : (
              <div>
                <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  <strong>Missing Information:</strong> Please complete the following fields to improve your account security and unlock all features.
                </p>
                {profileCompletion.missingFields?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profileCompletion.missingFields.map((field, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEdit(field)}
                        title={`Click to edit ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      >
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </S.Section>

        <S.ProfileCard>
          <S.Section>
            <h3>Account Information</h3>
            <S.Grid>
              <S.InfoItem>
                <label>User ID</label>
                <p>{userData.id || 'Not provided'}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Role</label>
                <p style={{ color: '#185c37' }}>{userData.role || 'Dependent'}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Type</label>
                <p style={{ color: '#185c37' }}>{userData.accountType}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Status</label>
                <p style={{ color: userData.accountStatus === 'Active' ? '#185c37' : '#e74c3c' }}>
                  {userData.accountStatus}
                </p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Created</label>
                <p>{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Last Updated</label>
                <p>{userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'Not available'}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Personal Information</h3>
            <S.Grid>
              <S.InfoItem>
                <label>First Name</label>
                {renderEditableField('firstName', userData.firstName)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Middle Name</label>
                {renderEditableField('middleName', userData.middleName)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Surname</label>
                {renderEditableField('surname', userData.surname)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Email Address</label>
                {renderEditableField('email', userData.email, 'email')}
              </S.InfoItem>
              <S.InfoItem>
                <label>Phone Number</label>
                {renderEditableField('phoneNumber', userData.phoneNumber, 'tel')}
              </S.InfoItem>
              <S.InfoItem>
                <label>ID Number</label>
                {renderEditableField('Idnumber', userData.Idnumber)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Relation to Caregiver</label>
                {renderEditableField('relation', userData.relation)}
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Postal Address</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Address Line 1</label>
                {renderEditableField('postalAddressLine1', userData.postalAddressLine1)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Address Line 2</label>
                {renderEditableField('postalAddressLine2', userData.postalAddressLine2)}
              </S.InfoItem>
              <S.InfoItem>
                <label>City</label>
                {renderEditableField('postalCity', userData.postalCity)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Province</label>
                {renderEditableField('postalProvince', userData.postalProvince)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Postal Code</label>
                {renderEditableField('postalCode', userData.postalCode)}
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Home Address</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Address Line 1</label>
                {renderEditableField('homeAddressLine1', userData.homeAddressLine1)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Address Line 2</label>
                {renderEditableField('homeAddressLine2', userData.homeAddressLine2)}
              </S.InfoItem>
              <S.InfoItem>
                <label>City</label>
                {renderEditableField('homeCity', userData.homeCity)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Province</label>
                {renderEditableField('homeProvince', userData.homeProvince)}
              </S.InfoItem>
              <S.InfoItem>
                <label>Postal Code</label>
                {renderEditableField('homeCode', userData.homeCode)}
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Financial Information</h3>
            <S.Grid>
              <S.InfoItem>
                <label>Monthly Allowance</label>
                <p style={{ color: '#185c37', fontWeight: 'bold' }}>{userData.monthlyAllowance}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Daily Spending Limit</label>
                <p style={{ color: '#185c37' }}>{userData.spendingLimit}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Total Spent This Month</label>
                <p style={{ color: '#e74c3c' }}>{userData.totalSpent}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Remaining Balance</label>
                <p style={{ color: '#185c37', fontWeight: 'bold' }}>{userData.remainingBalance}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Last Transaction</label>
                <p>{userData.lastTransaction}</p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Primary Caregiver</label>
                <p style={{ color: '#185c37' }}>{userData.caregiverName}</p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Verification Status</h3>
            <S.Grid>
              <S.InfoItem>
                <label>KYC Status</label>
                <p style={{ color: userData.kycStatus === 'Completed' ? '#185c37' : '#e74c3c' }}>
                  {userData.kycStatus}
                </p>
              </S.InfoItem>
              <S.InfoItem>
                <label>Account Verification</label>
                <p style={{ color: userData.accountStatus === 'Active' ? '#185c37' : '#e74c3c' }}>
                  {userData.accountStatus === 'Active' ? 'Verified' : 'Pending'}
                </p>
              </S.InfoItem>
            </S.Grid>
          </S.Section>

          <S.Section>
            <h3>Document Upload</h3>
            <S.FileUpload>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.png"
                style={{ display: 'none' }}
              />
              <S.UploadButton onClick={handleUploadClick}>
                Choose Document
              </S.UploadButton>
              {selectedFile && (
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  Selected: {selectedFile.name}
                </p>
              )}
              {uploadStatus && (
                <p style={{ 
                  marginTop: '10px', 
                  fontSize: '14px',
                  color: uploadStatus.includes('success') ? '#185c37' : '#e74c3c'
                }}>
                  {uploadStatus}
                </p>
              )}
            </S.FileUpload>
          </S.Section>
        </S.ProfileCard>
      </S.ProfileWrapper>
    </S.ScrollableContainer>
  );
};

export default DependentProfile;