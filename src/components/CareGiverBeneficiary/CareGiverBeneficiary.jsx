import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addBeneficiary, 
  removeBeneficiary, 
  setLoading, 
  setError, 
  clearError,
  refreshFromStorage,
  fetchDependents,
  fetchCaregiverStats,
  setSearchParams,
  loadDashboardData,
  searchDependents,
  registerDependent,
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
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background-color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  color: white;

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

const RemoveButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #cc3333;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CareGiverBeneficiary = () => {
  const dispatch = useDispatch();

  const { 
    list: beneficiaries, 
    isLoading: beneficiariesLoading, 
    error: beneficiariesError,
    pagination,
    stats,
    searchParams,
    dashboardErrors,
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
  
  // Improved token retrieval - prefer Redux state, fallback to localStorage with multiple possible keys
  const token = reduxToken || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken') || 
                localStorage.getItem('authToken') ||
                localStorage.getItem('jwt');

  // Separate effect for initial data loading (only depends on token)
  useEffect(() => {
    if (!token) {
      dispatch(setFeedback({
        success: false,
        message: 'No authentication token found. Please login again.'
      }));
      return;
    }

    // Always use loadDashboardData for initial load - it's more efficient
    dispatch(loadDashboardData({ token, params: searchParams }));

    // Listen for storage changes (useful for syncing across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'caregiver_dependents') {
        dispatch(refreshFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, dispatch]); // Remove searchParams from dependency to prevent infinite re-renders

  // Separate effect for handling search parameter changes
  useEffect(() => {
    if (!token) return;

    const isDefaultParams = searchParams.page === 1 && !searchParams.search && searchParams.status === 'active';
    
    // Only fetch if we have non-default search params (avoid duplicate initial load)
    if (!isDefaultParams) {
      dispatch(fetchDependents({ token, params: searchParams }));
    }
  }, [
    token, 
    dispatch, 
    searchParams.page, 
    searchParams.search, 
    searchParams.status, 
    searchParams.sortBy, 
    searchParams.sortOrder, 
    searchParams.limit
  ]); // Use individual properties instead of the whole object

  // Show beneficiaries error if any
  useEffect(() => {
    if (beneficiariesError) {
      dispatch(setFeedback({
        success: false,
        message: beneficiariesError
      }));
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
    const { firstName, surname, email, idNumber } = formData;
    
    // Remove middleName from required fields check
    if (!firstName || !surname || !email || !idNumber) {
      dispatch(setFeedback({
        success: false,
        message: 'Please fill in all required fields before proceeding'
      }));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(setFeedback({
        success: false,
        message: 'Please enter a valid email address'
      }));
      return false;
    }

    // ID validation
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      dispatch(setFeedback({
        success: false,
        message: 'ID Number must be exactly 13 digits'
      }));
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
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

      // Format data according to the expected API structure
      const dependentData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName?.trim() || null, // Optional middle name
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: password,
        Idnumber: formData.idNumber.trim(),
        relation: relation.trim()
      };

      // Make API call with Redux action
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await dispatch(registerDependent({ token, dependentData })).unwrap();
      
      dispatch(setFeedback({ 
        success: true, 
        message: result.message || 'Dependent registered successfully with 8 accounts created!' 
      }));
      
      // Reset form completely and close modal
      dispatch(resetForm());
      dispatch(hideModal());

      // IMPORTANT: Refresh the dependents list from server to get the actual registered data
      // This ensures we get the complete dependent info with all 8 accounts created by backend
      
      // Use a small delay to allow backend to complete the dependent setup
      setTimeout(async () => {
        try {
          // Force a fresh fetch with current search params
          const refreshResult = await dispatch(fetchDependents({ 
            token, 
            params: { 
              ...searchParams, 
              // Temporarily reset to defaults to ensure we see the new dependent
              page: 1,
              search: '',
              status: 'active'
            } 
          })).unwrap();
          
          // Also refresh stats to update counts
          await dispatch(fetchCaregiverStats(token)).unwrap();

          // Check if the dependent appears in the refreshed list
          const newDependentsCount = refreshResult.dependents?.length || 0;
          
          if (newDependentsCount === 0) {
            dispatch(setFeedback({
              success: false,
              message: 'Dependent was registered but may not be assigned to you. Please contact support or try refreshing the page.'
            }));
          } else {
            // Also reset search params to default view so user can see the new dependent
            dispatch(setSearchParams({ 
              page: 1, 
              search: '', 
              status: 'active' 
            }));
          }
        } catch (refreshError) {
          dispatch(setFeedback({
            success: false,
            message: 'Registration successful but failed to refresh data. Please refresh the page manually.'
          }));
        }
      }, 1500); // Give backend time to complete dependent setup

    } catch (error) {
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

  // Function to handle search with debouncing
  const handleSearch = (searchTerm) => {
    dispatch(setSearchParams({ search: searchTerm, page: 1 }));
  };

  // Function to handle status filter
  const handleStatusFilter = (status) => {
    dispatch(setSearchParams({ status, page: 1 }));
  };

  // Function to handle pagination
  const handlePageChange = (page) => {
    dispatch(setSearchParams({ page }));
  };

  // Function to refresh data manually
  const handleRefresh = () => {
    if (token) {
      // Use loadDashboardData for complete refresh
      dispatch(loadDashboardData({ token, params: searchParams }));
    }
  };

  // Function to handle search using the enhanced search method
  const handleSearchEnhanced = (searchTerm) => {
    if (token) {
      dispatch(searchDependents({ 
        token, 
        searchOptions: {
          query: searchTerm,
          status: searchParams.status,
          sortBy: searchParams.sortBy,
          sortOrder: searchParams.sortOrder,
          page: 1,
          limit: searchParams.limit
        }
      }));
    }
  };

  // Function to handle advanced filtering
  const handleAdvancedFilter = (filterOptions) => {
    if (token) {
      dispatch(searchDependents({ 
        token, 
        searchOptions: {
          ...searchParams,
          ...filterOptions,
          page: 1 // Reset to first page when filtering
        }
      }));
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
                Dependents ({stats?.totalDependents || beneficiaries.length})
              </h3>
              {beneficiariesLoading && (
                <div style={{ fontSize: '12px', color: '#666' }}>Loading...</div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search dependents..."
                value={searchParams.search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
              
              {/* Status Filter */}
              <select
                value={searchParams.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
                <option value="all">All Status</option>
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #185c37',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#185c37',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ↻ Refresh
              </button>
              
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
                      <div style={{ color: '#666' }}>Loading dependents...</div>
                    </td>
                  </tr>
                ) : beneficiaries.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ color: '#666' }}>No dependents found</div>
                    </td>
                  </tr>
                ) : (
                  beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id}>
                      <td>
                        <Avatar color={getRandomPastelColor()}>
                          {beneficiary.name.charAt(0)}
                        </Avatar>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#222' }}>
                          {beneficiary.name}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#666' }}>
                          {beneficiary.email || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 500, letterSpacing: '0.03em', color: '#185c37', fontSize: '11.5px' }}>
                          {beneficiary.idNumber}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#333' }}>
                          {beneficiary.relation}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '11.5px', 
                          color: beneficiary.account?.balance > 0 ? '#185c37' : '#999',
                          fontWeight: '600'
                        }}>
                          {beneficiary.account ? 
                            `${beneficiary.account.currency} ${beneficiary.account.balance.toFixed(2)}` : 
                            'No Account'
                          }
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: beneficiary.status === 'active' ? '#e8f5e8' : 
                                     beneficiary.status === 'blocked' ? '#ffe8e8' : 
                                     beneficiary.status === 'suspended' ? '#fff3e0' : '#f0f0f0',
                          color: beneficiary.status === 'active' ? '#2e7d32' : 
                                 beneficiary.status === 'blocked' ? '#c62828' : 
                                 beneficiary.status === 'suspended' ? '#f57c00' : '#666',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {beneficiary.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <ActionButton onClick={() => handleRemoveBeneficiary(beneficiary.id)}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M2.5 0a.5.5 0 0 1 .5.5V1h10V.5a.5.5 0 0 1 1 0V1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V.5a.5.5 0 0 1 .5-.5zM1 4h14v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm4 2a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 1 0V6.5A.5.5 0 0 0 5 6zm4 0a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 1 0V6.5A.5.5 0 0 0 9 6z"/>
                          </svg>
                        </ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '16px',
              padding: '16px 0',
              borderTop: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalDependents)} of{' '}
                {pagination.totalDependents} dependents
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: pagination.hasPrevPage ? 'white' : '#f5f5f5',
                    color: pagination.hasPrevPage ? '#333' : '#999',
                    cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                    fontSize: '12px'
                  }}
                >
                  Previous
                </button>
                
                <span style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px', 
                  color: '#666' 
                }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: pagination.hasNextPage ? 'white' : '#f5f5f5',
                    color: pagination.hasNextPage ? '#333' : '#999',
                    cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                    fontSize: '12px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </TableContainer>
      </Content>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClick={handleCloseModal}>
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
                          dispatch(setFormStep(2));
                          dispatch(clearFeedback()); // Clear any existing feedback
                        }
                      }}
                    >
                      Next
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
          {feedback.message}
        </FeedbackMessage>
      )}
    </Container>
  );
};

export default CareGiverBeneficiary;