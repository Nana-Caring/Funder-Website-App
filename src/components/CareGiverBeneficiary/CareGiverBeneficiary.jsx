import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { runServiceDiagnostics, getServiceStatusMessage } from '../../utils/serviceHealth';
import { 
  addBeneficiary, 
  removeBeneficiary, 
  setLoading, 
  setError, 
  clearError,
  refreshFromStorage,
  fetchDependents,
  fetchCaregiverStats,
  registerDependent,
  setCurrentUser,
  loadUserData,
  clearUserData,
  // UI State actions
  showModal,
  hideModal,
  setFormStep,
  setFormData,
  setRelation,
  setPassword,
  setConfirmPassword,
  setFeedback,
  clearFeedback,
  setSubmitting,
  resetForm
} from '../../store/slices/beneficiaries';

const Container = styled.div`
  position: relative;
  margin-top: 40px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 100px);
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #185c37, #1e6b42);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  align-self: flex-start;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(24, 92, 55, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1e6b42, #185c37);
    box-shadow: 0 4px 12px rgba(24, 92, 55, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FormTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  
  &:focus {
    border-color: #185c37;
  }

  &::placeholder {
    color: #999;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Step = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$active ? '#185c37' : '#ddd'};
  transition: all 0.2s;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const NextButton = styled.button`
  background: linear-gradient(135deg, #185c37, #1e6b42);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(24, 92, 55, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1e6b42, #185c37);
    box-shadow: 0 4px 12px rgba(24, 92, 55, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled(NextButton)`
  background: #f5f5f5;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
`;

const TableContainer = styled.div`
  width: 90%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 32px 24px 24px 24px;
  margin-top: 24px;
  margin-bottom: 32px;
  height: 480px;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  .table-wrapper {
    flex: 1 1 auto;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    margin-top: 16px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    background: #fafbfc;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #bdbdbd;
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 11.5px;
    background: transparent;
    color: #222;
    letter-spacing: 0.01em;
  }

  thead {
    position: sticky;
    top: 0;
    background: #f5f7fa;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }

  th {
    padding: 7px 6px;
    color: #444;
    font-weight: 700;
    background: #f5f7fa;
    border-bottom: 2px solid #e0e0e0;
    text-align: left;
    font-size: 11.5px;
    letter-spacing: 0.02em;
  }

  td {
    padding: 7px 6px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    font-size: 11.5px;
    color: #333;
    vertical-align: middle;
    transition: background 0.15s;
  }

  tr {
    transition: background 0.15s;
    &:hover td {
      background: #f5f7fa;
    }
  }
`;

const FeedbackMessage = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
  z-index: 2000; /* Increased z-index to ensure visibility */
  box-shadow: 0 8px 24px rgba(0,0,0,0.25); /* Enhanced shadow */
  background-color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  color: white;
  font-weight: 600;
  min-width: 300px;
  max-width: 500px;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const FeedbackIcon = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #185c37;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;

  &:hover {
    color: #1e6b42;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const CareGiverBeneficiary = () => {
  const dispatch = useDispatch();

  const { 
    list: beneficiaries, 
    isLoading: beneficiariesLoading, 
    error: beneficiariesError,
    statsError,
    stats,
    dashboardErrors,
    currentUserId,
    ui: {
      showFormModal,
      formStep,
      formData,
      relation,
      password,
      confirmPassword,
      feedback,
      isSubmitting
    }
  } = useSelector(state => state.beneficiaries);
  const { user, token: reduxToken } = useSelector(state => state.authentication);
  
  // Debug: Log current state
  console.log('🔍 Current beneficiaries state:', {
    beneficiaries,
    beneficiariesLoading,
    beneficiariesError,
    stats,
    currentUserId,
    feedback
  });
  
  // Improved token retrieval - prefer Redux state, fallback to localStorage with multiple possible keys
  const token = reduxToken || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken') || 
                localStorage.getItem('authToken') ||
                localStorage.getItem('jwt');

  // Diagnostic state for service health checking
  const [diagnostics, setDiagnostics] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Service health check function
  const runDiagnostics = async () => {
    console.log('🔍 Running service diagnostics...');
    setShowDiagnostics(true);
    
    try {
      const results = await runServiceDiagnostics(token);
      setDiagnostics(results);
      
      // Show user-friendly status
      const statusMessage = getServiceStatusMessage(results);
      alert(statusMessage);
      
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
      alert('Unable to run diagnostics. Please check your internet connection.');
    }
  };

  // Optimized effect for initial data loading with retry mechanism
  useEffect(() => {
    if (!token) {
      dispatch(setFeedback({
        success: false,
        message: 'No authentication token found. Please login again.'
      }));
      return;
    }

    // Get current user ID for user-specific data storage
    const currentUserId = user?.id || localStorage.getItem('userId') || localStorage.getItem('id');
    
    if (currentUserId) {
      // Set current user for proper data segmentation
      dispatch(setCurrentUser(currentUserId));
      
      // Load existing data from localStorage first for instant UI
      dispatch(loadUserData(currentUserId));
    }

    // Implement retry mechanism for API calls
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    const fetchWithRetry = async () => {
      if (beneficiaries.length === 0 && !beneficiariesLoading && retryCount < maxRetries) {
        console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries}: Fetching from API...`);
        
        try {
          // Fetch fresh data from API (this will merge with localStorage)
          await dispatch(fetchDependents({ 
            token, 
            params: { 
              page: 1, 
              limit: 50, 
              status: 'active' 
            } 
          })).unwrap();

          console.log('✅ Dependents fetch successful');

          // Try to fetch stats separately - don't fail the whole process if this fails
          try {
            await dispatch(fetchCaregiverStats(token)).unwrap();
            console.log('✅ Stats fetch successful');
          } catch (statsError) {
            console.log('⚠️ Stats fetch failed, but dependents loaded successfully:', statsError);
            // Don't show error to user since the main functionality (dependents) is working
          }
          
        } catch (error) {
          retryCount++;
          console.log(`❌ Dependents API call failed (attempt ${retryCount}/${maxRetries}):`, error);
          
          if (retryCount < maxRetries) {
            console.log(`⏳ Retrying dependents fetch in ${retryDelay/1000} seconds...`);
            setTimeout(fetchWithRetry, retryDelay);
          } else {
            console.log('❌ Max retries reached for dependents. Backend server appears to be down.');
            dispatch(setFeedback({
              success: false,
              message: 'Unable to load dependents. Backend server appears to be temporarily unavailable.'
            }));
          }
        }
      } else if (beneficiaries.length > 0) {
        console.log('✅ Beneficiaries already loaded, count:', beneficiaries.length);
        
        // Try to fetch stats for already loaded beneficiaries, but silently fail if it doesn't work
        try {
          await dispatch(fetchCaregiverStats(token)).unwrap();
          console.log('✅ Stats fetched for existing beneficiaries');
        } catch (statsError) {
          console.log('⚠️ Stats unavailable, but beneficiaries are loaded:', statsError);
        }
      }
    };

    // Start the fetch process
    fetchWithRetry();

    // Listen for storage changes (useful for syncing across tabs)
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes('caregiver_dependents')) {
        console.log('📱 Storage changed, refreshing from localStorage');
        dispatch(refreshFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, user?.id, dispatch]);

  // Show beneficiaries error only if it's a critical error (not stats-related)
  useEffect(() => {
    if (beneficiariesError) {
      // Only show error if it's not just a stats failure and we actually have a dependents problem
      if (beneficiariesError.toLowerCase().includes('dependents') || 
          beneficiariesError.toLowerCase().includes('fetch') && 
          !beneficiariesError.toLowerCase().includes('statistics')) {
        dispatch(setFeedback({
          success: false,
          message: beneficiariesError
        }));
      } else {
        // For stats-only errors, just log them without alerting the user
        console.log('📊 Non-critical error (stats related):', beneficiariesError);
      }
      dispatch(clearError());
    }
  }, [beneficiariesError, dispatch]);

  // Show dashboard errors if any
  useEffect(() => {
    if (dashboardErrors && dashboardErrors.length > 0) {
      const errorMessages = dashboardErrors.map(err => `${err.type}: ${err.error}`).join(', ');
      dispatch(setFeedback({
        success: false,
        message: `Some data failed to load: ${errorMessages}`
      }));
    }
  }, [dashboardErrors, dispatch]);

  // Auto-persist beneficiaries whenever the list changes
  useEffect(() => {
    if (beneficiaries.length > 0 && currentUserId) {
      console.log('📱 Auto-persisting', beneficiaries.length, 'dependents for user', currentUserId);
      const storageKey = `caregiver_dependents_${currentUserId}`;
      const dataToSave = {
        dependents: beneficiaries,
        timestamp: new Date().getTime(),
        userId: currentUserId
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [beneficiaries, currentUserId]);

  // Auto-clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        dispatch(clearFeedback());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback, dispatch]);

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 75%)`;
  };

  const handleOpenModal = () => {
    dispatch(showModal());
  };

  const handleCloseModal = () => {
    dispatch(hideModal());
  };

  // Update the validation function
  const validateStep1 = () => {
    const { firstName, surname, email, idNumber, isInfant, dateOfBirth, useMinimalInfant } = formData;

    // Basic name checks
    if (!firstName || !surname) {
      dispatch(setFeedback({ success: false, message: 'First name and surname are required' }));
      return false;
    }

    // Infant minimal path: require only DOB and validate age <= 1 year
    if (isInfant && useMinimalInfant) {
      if (!dateOfBirth) {
        dispatch(setFeedback({ success: false, message: 'dateOfBirth is required for infant registration' }));
        return false;
      }
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        dispatch(setFeedback({ success: false, message: 'Please provide a valid date of birth' }));
        return false;
      }
      const now = new Date();
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      if (dob < new Date('1900-01-01') || dob > now) {
        dispatch(setFeedback({ success: false, message: 'Date of birth cannot be in the future' }));
        return false;
      }
      if (dob < oneYearAgo) {
        dispatch(setFeedback({ success: false, message: 'Infant age must be 1 year or less' }));
        return false;
      }
      return true;
    }

    // Non-minimal (regular or infant with full details): require email and 13-digit ID
    if (!email || !idNumber) {
      dispatch(setFeedback({ success: false, message: 'Please fill in all required fields before proceeding' }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(setFeedback({ success: false, message: 'Please enter a valid email address' }));
      return false;
    }
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      dispatch(setFeedback({ success: false, message: 'ID Number must be exactly 13 digits' }));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Skip step 2 for infant minimal path
    if (formData.isInfant && formData.useMinimalInfant) {
      return true;
    }
    if (!relation) {
      dispatch(setFeedback({
        success: false,
        message: 'Please select your relation'
      }));
      return false;
    }

    if (!password) {
      dispatch(setFeedback({
        success: false,
        message: 'Password is required'
      }));
      return false;
    }

    if (password !== confirmPassword) {
      dispatch(setFeedback({
        success: false,
        message: 'Passwords do not match'
      }));
      return false;
    }

    if (password.length < 6) {
      dispatch(setFeedback({
        success: false,
        message: 'Password must be at least 6 characters long'
      }));
      return false;
    }

    // Final validation of all required fields
    const { firstName, surname, email, idNumber } = formData;
    if (!firstName?.trim() || !surname?.trim() || !email?.trim() || !idNumber?.trim()) {
      dispatch(setFeedback({
        success: false,
        message: 'All required fields must be completed'
      }));
      return false;
    }

    // Final ID number validation
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      dispatch(setFeedback({
        success: false,
        message: 'ID Number must be exactly 13 digits'
      }));
      return false;
    }

    return true;
  };

  const handleComplete = async () => {
    try {
      if (!validateStep2()) {
        return;
      }

      dispatch(setSubmitting(true));
      dispatch(setLoading(true));

      // Build payload per enhanced API contract
      const isInfant = !!formData.isInfant;
      const useMinimal = !!formData.useMinimalInfant;
      const base = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName?.trim() || undefined,
        surname: formData.surname.trim()
      };
      let dependentData = { ...base };
      if (isInfant) {
        dependentData.isInfant = true;
        if (formData.dateOfBirth) {
          const dob = new Date(formData.dateOfBirth);
          dependentData.dateOfBirth = isNaN(dob.getTime()) ? formData.dateOfBirth : dob.toISOString().split('T')[0];
        }
        if (!useMinimal) {
          dependentData.email = formData.email.trim().toLowerCase();
          dependentData.password = password;
          dependentData.Idnumber = formData.idNumber.trim();
          dependentData.relation = relation.trim();
        }
      } else {
        // Regular dependent registration
        dependentData.email = formData.email.trim().toLowerCase();
        dependentData.password = password;
        dependentData.Idnumber = formData.idNumber.trim();
        dependentData.relation = relation.trim();
      }

      // Make API call with Redux action
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🚀 Starting dependent registration...', dependentData);
  const result = await dispatch(registerDependent({ token, dependentData })).unwrap();
      console.log('✅ Registration result:', result);
      
      // Show immediate success feedback
      dispatch(setFeedback({ 
        success: true, 
        message: result.message || 'Dependent registered successfully with 8 accounts created!' 
      }));
      
      // Reset form completely and close modal
      dispatch(resetForm());
      dispatch(hideModal());

      // The dependent should now be automatically added to the list via the registerDependent.fulfilled reducer
      // Show final success message with updated count
      setTimeout(() => {
        dispatch(setFeedback({ 
          success: true, 
          message: `Dependent "${dependentData.firstName} ${dependentData.surname}" added successfully! Total dependents: ${beneficiaries.length + 1}` 
        }));
      }, 100);

    } catch (error) {
      console.error('❌ Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register beneficiary';
      dispatch(setFeedback({
        success: false,
        message: errorMessage
      }));
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setSubmitting(false));
      dispatch(setLoading(false));
    }
  };

  // Function to handle beneficiary removal
  const handleRemoveBeneficiary = (beneficiaryId) => {
    if (window.confirm('Are you sure you want to remove this beneficiary?')) {
      dispatch(removeBeneficiary(beneficiaryId));
      dispatch(setFeedback({ success: true, message: 'Beneficiary removed successfully!' }));
    }
  };

  return (
    <Container>
      <Content>
        <TableContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '800',
                color: '#222',
                margin: 0
              }}>
                Dependents ({beneficiaries.length})
              </h3>
              {beneficiariesLoading && (
                <div style={{ fontSize: '12px', color: '#666' }}>Loading...</div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {beneficiariesError && (
                <button
                  onClick={runDiagnostics}
                  style={{
                    background: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Run service diagnostics to troubleshoot backend issues"
                >
                  🔍 Diagnose
                </button>
              )}
              
              <AddButton onClick={handleOpenModal}>
                <span style={{ fontSize: '16px' }}>+</span>
                Add Dependent
              </AddButton>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Names</th>
                  <th>Email</th>
                  <th>ID Number</th>
                  <th>Relation</th>
                  <th>Account Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {beneficiariesLoading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div>Loading dependents...</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          If this takes too long, the server might be temporarily unavailable
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : beneficiariesError ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ color: '#d32f2f', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>
                          ⚠️ Unable to Load Dependents
                        </div>
                        <div style={{ fontSize: '14px', maxWidth: '400px', lineHeight: '1.4' }}>
                          The backend server is currently experiencing issues. 
                          Your data is safe and will be available once the server is restored.
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                          Error: {beneficiariesError}
                        </div>
                        <button 
                          onClick={() => window.location.reload()} 
                          style={{
                            background: '#185c37',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Retry Loading
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : beneficiaries.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ color: '#666' }}>
                        No dependents found
                        <br />
                        <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                          Click "Add Dependent" to get started
                        </small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  beneficiaries.map((beneficiary, index) => {
                    console.log('Rendering beneficiary:', beneficiary); // Debug log
                    return (
                    <tr key={beneficiary.id || beneficiary._id || index}>
                      <td>
                        <Avatar color={getRandomPastelColor()}>
                          {(beneficiary.name || beneficiary.firstName || 'U').charAt(0)}
                        </Avatar>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#222' }}>
                          {beneficiary.name || `${beneficiary.firstName || ''} ${beneficiary.surname || ''}`.trim() || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#666' }}>
                          {beneficiary.email || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 500, letterSpacing: '0.03em', color: '#185c37', fontSize: '11.5px' }}>
                          {beneficiary.idNumber || beneficiary.Idnumber || beneficiary.id_number || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#333' }}>
                          {beneficiary.relation || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '11.5px', 
                          color: (beneficiary.account?.balance || beneficiary.balance) > 0 ? '#185c37' : '#999',
                          fontWeight: '600'
                        }}>
                          {beneficiary.account ? 
                            `${beneficiary.account.currency || 'R'} ${(beneficiary.account.balance || 0).toFixed(2)}` :
                            beneficiary.balance !== undefined ?
                            `R ${(beneficiary.balance || 0).toFixed(2)}` :
                            'No Account'
                          }
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: (beneficiary.status || 'active') === 'active' ? '#e8f5e8' : 
                                     (beneficiary.status || 'active') === 'blocked' ? '#ffe8e8' : 
                                     (beneficiary.status || 'active') === 'suspended' ? '#fff3e0' : '#f0f0f0',
                          color: (beneficiary.status || 'active') === 'active' ? '#2e7d32' : 
                                 (beneficiary.status || 'active') === 'blocked' ? '#c62828' : 
                                 (beneficiary.status || 'active') === 'suspended' ? '#f57c00' : '#666',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {beneficiary.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <ActionButton onClick={() => handleRemoveBeneficiary(beneficiary.id || beneficiary._id)}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M2.5 0a.5.5 0 0 1 .5.5V1h10V.5a.5.5 0 0 1 1 0V1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V.5a.5.5 0 0 1 .5-.5zM1 4h14v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm4 2a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 1 0V6.5A.5.5 0 0 0 5 6zm4 0a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 1 0V6.5A.5.5 0 0 0 9 6z"/>
                          </svg>
                        </ActionButton>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </TableContainer>
      </Content>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {formStep === 1 && (
              <>
                <FormTitle>Follow the steps to add a beneficiary</FormTitle>
                <FormSubtitle>Please make sure the information is correct</FormSubtitle>
                <FormGroup>
                  <Label>First Name: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => dispatch(setFormData({firstName: e.target.value}))}
                    required
                    placeholder="Enter first name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Middle Name:</Label>
                  <Input 
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => dispatch(setFormData({middleName: e.target.value}))}
                    placeholder="Enter middle name (optional)"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Surname: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="text"
                    value={formData.surname}
                    onChange={(e) => dispatch(setFormData({surname: e.target.value}))}
                    required
                    placeholder="Enter surname"
                  />
                </FormGroup>
                {/* Infant registration options */}
                <FormGroup>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!formData.isInfant}
                      onChange={(e) => dispatch(setFormData({ isInfant: e.target.checked }))}
                    />
                    Register as infant (≤ 1 year old)
                  </label>
                </FormGroup>
                {formData.isInfant && (
                  <>
                    <FormGroup>
                      <Label>Date of Birth: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                      <Input 
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => dispatch(setFormData({ dateOfBirth: e.target.value }))}
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={!!formData.useMinimalInfant}
                          onChange={(e) => dispatch(setFormData({ useMinimalInfant: e.target.checked }))}
                        />
                        Use minimal infant registration (auto-generate email/ID)
                      </label>
                      <small style={{ color: '#666' }}>
                        If selected, only name and date of birth are required. No welcome emails will be sent to auto-generated addresses.
                      </small>
                    </FormGroup>
                  </>
                )}
                {!(formData.isInfant && formData.useMinimalInfant) && (
                  <>
                    <FormGroup>
                      <Label>Email: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => dispatch(setFormData({email: e.target.value}))}
                        required
                        placeholder="Enter email address"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>ID No: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                      <Input 
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => dispatch(setFormData({idNumber: e.target.value}))}
                        placeholder="Enter 13 digits"
                        pattern="\d{13}"
                        maxLength="13"
                        required
                      />
                    </FormGroup>
                  </>
                )}
                <BottomRow>
                  <StepIndicator>
                    <Step $active={formStep === 1} />
                    <Step $active={formStep === 2} />
                  </StepIndicator>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <BackButton onClick={handleCloseModal}>
                      Cancel
                    </BackButton>
                    <NextButton 
                      onClick={() => {
                        if (validateStep1()) {
                          dispatch(clearFeedback());
                          if (formData.isInfant && formData.useMinimalInfant) {
                            // Skip step 2 for minimal infant flow
                            handleComplete();
                          } else {
                            dispatch(setFormStep(2));
                          }
                        }
                      }}
                    >
                      {formData.isInfant && formData.useMinimalInfant ? 'Complete' : 'Next'}
                    </NextButton>
                  </div>
                </BottomRow>
              </>
            )}
            {formStep === 2 && (
              <>
                <FormTitle>Complete the last steps to add beneficiary</FormTitle>
                <FormSubtitle>Please make sure the information is correct</FormSubtitle>
                <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 16, marginTop: 20, fontSize: 14 }}>How are you related?</div>
                <FormGroup>
                  <Label>Relation: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <select 
                    value={relation} 
                    onChange={e => dispatch(setRelation(e.target.value))}
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    required
                  >
                    <option value="">Choose your relation</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                </FormGroup>
                <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 16, marginTop: 20, fontSize: 14 }}>Confirm passwords:</div>
                <FormGroup>
                  <Label>Password: <span style={{ color: '#888', fontSize: 12 }}>(important)</span></Label>
                  <Input type="password" value={password} onChange={e => dispatch(setPassword(e.target.value))} placeholder="Enter password" />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password:</Label>
                  <Input type="password" value={confirmPassword} onChange={e => dispatch(setConfirmPassword(e.target.value))} placeholder="Confirm password" />
                </FormGroup>
                <BottomRow>
                  <StepIndicator>
                    <Step $active={formStep === 1} />
                    <Step $active={formStep === 2} />
                  </StepIndicator>
                  <ButtonGroup>
                    <BackButton onClick={() => dispatch(setFormStep(1))}>
                      <span style={{ marginRight: 8 }}>&larr;</span> Back
                    </BackButton>
                    <NextButton 
                      onClick={handleComplete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Complete'} 
                      {!isSubmitting && <span style={{ marginLeft: 8 }}>&rarr;</span>}
                    </NextButton>
                  </ButtonGroup>
                </BottomRow>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
      
      {feedback && (
        <FeedbackMessage $success={feedback.success}>
          <FeedbackIcon>{feedback.success ? '✅' : '❌'}</FeedbackIcon>
          <span>{feedback.message}</span>
        </FeedbackMessage>
      )}

      {/* Service Diagnostics Display */}
      {showDiagnostics && diagnostics && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px'
          }}>
            <strong style={{ color: '#185c37' }}>Service Diagnostics</strong>
            <button 
              onClick={() => setShowDiagnostics(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Overall Status:</strong> 
            <span style={{ 
              color: diagnostics.summary.overallHealth === 'HEALTHY' ? '#4caf50' : '#f44336',
              marginLeft: '8px'
            }}>
              {diagnostics.summary.overallHealth}
            </span>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Health Check:</strong> 
            <span style={{ 
              color: diagnostics.summary.healthCheck === 'PASS' ? '#4caf50' : '#f44336',
              marginLeft: '8px'
            }}>
              {diagnostics.summary.healthCheck}
            </span>
          </div>
          
          {diagnostics.summary.endpointAccessibility && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Endpoints:</strong> {diagnostics.summary.endpointAccessibility}
            </div>
          )}
          
          {diagnostics.summary.recommendations.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
              <strong>Recommendations:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                {diagnostics.summary.recommendations.map((rec, index) => (
                  <li key={index} style={{ color: '#666', lineHeight: '1.4' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={{ fontSize: '10px', color: '#999', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
            Checked: {new Date(diagnostics.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </Container>
  );
};

export default CareGiverBeneficiary;