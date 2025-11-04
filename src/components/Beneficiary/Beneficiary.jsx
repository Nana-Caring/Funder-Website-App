import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../store/slices/ui';
import { funderService } from '../../services/funderService';
import authService from '../../services/authService';


const BeneficiaryContainer = styled.div`
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
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const TableContainer = styled.div`
  width: 90%;
  max-width: 1000px;
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

  .action-btns button {
    background: none;
    border: none;
    padding: 4px;
    margin: 0 2px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;
    &:hover {
      background: #f0f0f0;
    }
  }

  .action-btns img {
    width: 22px;
    height: 22px;
    filter: grayscale(0.2) brightness(0.95);
    transition: filter 0.15s;
  }

  .action-btns button:hover img {
    filter: grayscale(0) brightness(1.2);
  }

  @media (max-width: 700px) {
    width: 100%;
    padding: 12px 2px 12px 2px;
    .table-wrapper {
      padding: 0;
    }
    th, td {
      padding: 10px 4px;
      font-size: 13px;
    }
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 12px 0;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    color: #333;
    
    &::placeholder {
      color: #999;
    }
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

const PopupOverlay = styled.div`
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

const PopupMessage = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  text-align: center;

  h4 {
    color: #f44336;
    margin-bottom: 16px;
    font-size: 18px;
  }

  p {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  button {
    background: #333;
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #444;
    }
  }
`;

const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const AccountCard = styled.div`
  background: ${props => props.isMain ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : '#f8f9fa'};
  border: ${props => props.isMain ? '2px solid #4CAF50' : '1px solid #e0e0e0'};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  position: relative;

  ${props => props.isMain && `
    &::before {
      content: '🚨 Emergency Fund';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: #4CAF50;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }
  `}
`;

const BalanceAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.isMain ? '#2e7d32' : '#185c37'};
  margin-top: 8px;
`;

const AccountType = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: capitalize;
`;

const EmergencyInfo = styled.div`
  background: linear-gradient(135deg, #e3f2fd, #f0f8ff);
  border: 1px solid #2196F3;
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  
  h4 {
    color: #1976D2;
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .emergency-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-label {
      font-size: 11px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 14px;
      font-weight: 700;
      color: #1976D2;
    }
  }
`;

const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 75%)`;
};

const DependentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const DependentForm = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;

  h3 {
    margin: 0 0 16px 0;
    color: #185c37;
    font-size: 18px;
  }

  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    input, select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #185c37;
        box-shadow: 0 0 0 2px rgba(24, 92, 55, 0.1);
      }
    }

    small {
      color: #666;
      font-size: 12px;
    }
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 0;

    input[type="checkbox"] {
      width: auto;
    }

    label {
      margin: 0;
      font-size: 14px;
    }
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &.cancel {
        background: #f5f5f5;
        color: #666;

        &:hover {
          background: #e5e5e5;
        }
      }

      &.submit {
        background: #185c37;
        color: white;

        &:hover {
          background: #0f3d24;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }

  .error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
  }

  .success-message {
    color: #28a745;
    font-size: 12px;
    margin-top: 4px;
  }
`;

// Safely format currency when API may return strings like "R 123" or null
const safeParseAmount = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
};

const formatCurrency = (amount) => {
  const n = safeParseAmount(amount);
  return `R ${n.toFixed(2)}`;
};

const calculateEmergencyStats = (accounts) => {
  const mainAccount = accounts?.find(acc => 
    acc.accountType?.toLowerCase() === 'main' || 
    acc.accountName?.toLowerCase() === 'main'
  );
  
  const totalBalance = accounts?.reduce((sum, acc) => sum + safeParseAmount(acc.balance), 0) || 0;
  const emergencyBalance = safeParseAmount(mainAccount?.balance);
  const emergencyPercentage = totalBalance > 0 ? (emergencyBalance / totalBalance * 100) : 0;
  
  return {
    emergencyBalance,
    totalBalance,
    emergencyPercentage: Math.round(emergencyPercentage),
    categoryBalance: totalBalance - emergencyBalance
  };
};

const BeneficiaryForm = () => {
  // Redux state
  const { user, token } = useSelector(state => state.auth || {});
  const dispatch = useDispatch();
  
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({name: '', accountNumber: ''});
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainAccountNumber, setMainAccountNumber] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Dependent registration modal state
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [dependentForm, setDependentForm] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    password: '',
    Idnumber: '',
    relation: 'child',
    isInfant: false,
    dateOfBirth: ''
  });
  const [dependentErrors, setDependentErrors] = useState({});
  const [dependentLoading, setDependentLoading] = useState(false);

  // Enhanced API base URL
  const API_BASE_URL = 'https://nanacaring-backend.onrender.com/api';

  // Fetch beneficiaries using funder service
  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError('');
    try {
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('🔄 Fetching beneficiaries...');
      
      // Try multiple endpoints to find working one
      const endpoints = [
        () => funderService.getBeneficiaries(authToken),
        () => funderService.getBeneficiariesWithAccounts(authToken),
        () => axios.get(`${API_BASE_URL}/funder/get-beneficiaries`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        () => axios.get(`${API_BASE_URL}/funder/get-beneficiaries-enhanced`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        () => axios.get(`${API_BASE_URL}/funder/beneficiaries`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ];

      let lastError = null;
      for (let i = 0; i < endpoints.length; i++) {
        try {
          console.log(`📡 Trying endpoint ${i + 1}...`);
          const result = await endpoints[i]();
          const responseData = result.data || result;
          
          console.log(`✅ Endpoint ${i + 1} success:`, responseData);
          
          // Extract beneficiaries from various possible response structures
          const fetched = responseData.beneficiaries || 
                         responseData.dependents || 
                         responseData.data?.beneficiaries || 
                         responseData.data?.dependents ||
                         (Array.isArray(responseData.data) ? responseData.data : []) ||
                         (Array.isArray(responseData) ? responseData : []);
          
          console.log(`📋 Extracted ${fetched.length} beneficiaries:`, fetched);
          
          setBeneficiaries(fetched);
          localStorage.setItem('funder_beneficiaries', JSON.stringify(fetched));
          return; // Success, exit the loop
        } catch (err) {
          lastError = err;
          console.log(`❌ Endpoint ${i + 1} failed:`, err.response?.status, err.response?.data?.message || err.message);
          // Continue to next endpoint
        }
      }
      
      // All endpoints failed
      console.error('All fetch attempts failed. Last error:', lastError);
      setError(lastError?.response?.data?.message || lastError?.message || 'Failed to fetch beneficiaries');
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError(err.message || 'Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  // Load beneficiaries on component mount
  useEffect(() => {
    const stored = localStorage.getItem('funder_beneficiaries');
    if (stored) {
      try {
        setBeneficiaries(JSON.parse(stored));
      } catch (e) {
        // Ignore parse error, fallback to fetch
      }
    }
    fetchBeneficiaries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced add beneficiary with better error handling using funderService
  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name || !formData.accountNumber){
      setError('Please fill in all fields');
      return;
    }

    // Sanitize account number: digits only
    const sanitizedAccountNumber = String(formData.accountNumber).replace(/\D/g, '');
    if (sanitizedAccountNumber.length < 6) {
      setError('Account number looks invalid. Please check and try again.');
      return;
    }

    try {
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const dependentData = {
        dependentName: formData.name,
        accountNumber: sanitizedAccountNumber
      };

      console.log('🔗 Linking beneficiary using funderService:', dependentData);

      // First try the service wrapper (if available)
      try {
        const result = await funderService.linkDependent(dependentData, authToken);
        console.log('funderService.linkDependent result:', result);

        // If backend returns the created dependent, append it to the UI immediately
        const created = result?.dependent || result?.beneficiary || result?.data || null;
        if (result && (result.success || created)) {
          if (created) {
            setBeneficiaries(prev => [created, ...prev]);
            localStorage.setItem('funder_beneficiaries', JSON.stringify([created, ...beneficiaries]));
          }
          setFormData({ name: '', accountNumber: '' });
          setError('✅ Beneficiary linked successfully!');
          setShowFormModal(false);
          // try to refresh full list (non-blocking)
          fetchBeneficiaries();
          return;
        }
      } catch (svcErr) {
        console.warn('funderService.linkDependent failed:', svcErr?.message || svcErr);
        // fall through to direct attempts
      }

      // Fallback: try direct API POST with several payload variants to work around server expectations
      const payloadVariants = [
        { dependentName: formData.name, accountNumber: sanitizedAccountNumber },
        { name: formData.name, accountNumber: sanitizedAccountNumber },
        { beneficiaryName: formData.name, accountNumber: sanitizedAccountNumber },
        { dependent: { name: formData.name, accountNumber: sanitizedAccountNumber } },
        { dependent_name: formData.name, account_number: sanitizedAccountNumber }
      ];

      let lastError = null;
      for (let i = 0; i < payloadVariants.length; i++) {
        const payload = payloadVariants[i];
        try {
          console.log(`🔁 Direct API attempt ${i + 1}`, payload);
          const resp = await axios.post(`${API_BASE_URL}/funder/link-dependent`, payload, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            timeout: 10000
          });

          console.log('Direct API response:', resp.status, resp.data);
          const created = resp.data?.dependent || resp.data?.beneficiary || resp.data?.data || null;
          if (resp.status === 200 || resp.status === 201 || resp.data?.success) {
            if (created) {
              setBeneficiaries(prev => [created, ...prev]);
              localStorage.setItem('funder_beneficiaries', JSON.stringify([created, ...beneficiaries]));
            }
            setFormData({ name: '', accountNumber: '' });
            setError('✅ Beneficiary linked successfully!');
            setShowFormModal(false);
            fetchBeneficiaries();
            return;
          }
        } catch (errAttempt) {
          lastError = errAttempt;
          console.warn(`Attempt ${i + 1} failed:`, errAttempt?.response?.status, errAttempt?.response?.data || errAttempt.message);
          // stop trying on auth errors
          if (errAttempt?.response?.status === 401 || errAttempt?.response?.status === 403) break;
          // continue for other errors
        }
      }

      // All attempts failed — surface useful details
      const serverMsg = lastError?.response?.data?.message || lastError?.response?.data || lastError?.message || 'Server error. Please try again later.';
      console.error('All link attempts failed. Last error:', lastError);
      setError(`❌ ${serverMsg}`);
    } catch (err) {
      console.error('Unexpected error adding beneficiary:', err);
      setError(err?.message || 'Unexpected error occurred while linking beneficiary');
    }
  };

  const handleEdit = (beneficiary, index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setFormData({
      name: beneficiary.dependentName || beneficiary.name || beneficiary.firstName,
      accountNumber: beneficiary.accountNumber,
    });
    
    // Enhanced main account detection
    let mainAccNum = '';
    if (Array.isArray(beneficiary.Accounts) && beneficiary.Accounts.length > 0) {
      const mainAcc = beneficiary.Accounts.find(
        acc => (acc.accountType && acc.accountType.toLowerCase() === 'main') ||
                (acc.accountName && acc.accountName.toLowerCase() === 'main')
      );
      if (mainAcc && mainAcc.accountNumber) {
        mainAccNum = mainAcc.accountNumber;
      }
    }
    setMainAccountNumber(mainAccNum);
    setShowFormModal(true);
    setError('');
  };

  const handleUpdateBeneficiary = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.accountNumber) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/funder/beneficiary/${beneficiaries[editingIndex]._id}`,
        {
          dependentName: formData.name,
          accountNumber: formData.accountNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response.status === 200) {
        setFormData({ name: '', accountNumber: '' });
        setError('✅ Beneficiary updated successfully.');
        setShowFormModal(false);
        setIsEditing(false);
        setEditingIndex(null);
        await fetchBeneficiaries();
      } else {
        setError(response.data.message || 'Failed to update beneficiary');
      }
    } catch (err) {
      console.error('Error updating beneficiary:', err);
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleViewAccountDetails = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowAccountDetails(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setFormData({ name: '', accountNumber: '' });
    setShowFormModal(false);
    setError('');
  };

  const handleOpenModal = () => {
    setShowFormModal(true);
    setIsEditing(false);
    setEditingIndex(null);
    setFormData({ name: '', accountNumber: '' });
    setError('');
  };

  const handleDeleteAttempt = (beneficiary, index) => {
    setDeleteTarget({ beneficiary, index });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    try {
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      // For now, show info popup since delete may not be implemented in backend
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setShowPopup(true);
      
      // TODO: Implement actual delete when backend supports it
      // const result = await funderService.deleteDependent(deleteTarget.beneficiary._id, authToken);
      // if (result.success) {
      //   await fetchBeneficiaries();
      //   setError('✅ Beneficiary removed successfully.');
      // }
    } catch (err) {
      console.error('Error deleting beneficiary:', err);
      setError(err.message || 'Failed to delete beneficiary');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  // Dependent registration handlers
  const handleDependentFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDependentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Clear non-infant fields when switching to infant
      ...(name === 'isInfant' && checked ? { 
        email: '', 
        password: '', 
        Idnumber: '',
        relation: 'child' 
      } : {})
    }));
    // Clear error for this field
    setDependentErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateDependentForm = () => {
    const errors = {};
    
    if (!dependentForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!dependentForm.surname.trim()) {
      errors.surname = 'Surname is required';
    }
    
    if (dependentForm.isInfant) {
      if (!dependentForm.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required for infants';
      } else {
        // Validate infant age (≤ 1 year)
        const birthDate = new Date(dependentForm.dateOfBirth);
        const today = new Date();
        const ageInMonths = (today - birthDate) / (1000 * 60 * 60 * 24 * 30.44);
        if (ageInMonths > 12) {
          errors.dateOfBirth = 'Child must be 12 months or younger for infant registration';
        }
      }
    } else {
      // Regular dependent validation
      if (!dependentForm.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dependentForm.email)) {
        errors.email = 'Please enter a valid email';
      }
      if (!dependentForm.password) {
        errors.password = 'Password is required';
      } else if (dependentForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (!dependentForm.Idnumber.trim()) {
        errors.Idnumber = 'ID number is required';
      }
    }
    
    setDependentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDependentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDependentForm()) return;

    try {
      setDependentLoading(true);
      dispatch(showLoading({ message: 'Registering dependent...' }));

      // Build payload according to API spec
      const payload = {
        firstName: dependentForm.firstName.trim(),
        surname: dependentForm.surname.trim(),
        relation: dependentForm.relation || 'child'
      };

      // Add optional middle name
      if (dependentForm.middleName.trim()) {
        payload.middleName = dependentForm.middleName.trim();
      }

      if (dependentForm.isInfant) {
        // Infant registration
        payload.isInfant = true;
        payload.dateOfBirth = dependentForm.dateOfBirth;
        // For infants, email/password/ID can be auto-generated by backend
      } else {
        // Regular dependent registration
        payload.email = dependentForm.email.toLowerCase().trim();
        payload.password = dependentForm.password;
        payload.Idnumber = dependentForm.Idnumber.trim();
      }

      console.log('Registering dependent with payload:', payload);
      
      const result = await authService.registerDependent(payload);
      
      if (result.message) {
        setError(`✅ ${result.message}`);
      }
      
      // Reset form and close modal
      setDependentForm({
        firstName: '',
        middleName: '',
        surname: '',
        email: '',
        password: '',
        Idnumber: '',
        relation: 'child',
        isInfant: false,
        dateOfBirth: ''
      });
      setDependentErrors({});
      setShowDependentModal(false);
      
      // Refresh beneficiaries list
      await fetchBeneficiaries();
      
    } catch (err) {
      console.error('Dependent registration failed:', err);
      setError(err.message || 'Failed to register dependent');
    } finally {
      setDependentLoading(false);
      dispatch(hideLoading());
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    (beneficiary.dependentName || beneficiary.name || beneficiary.firstName || '')
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  return (
    <BeneficiaryContainer>
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
          border: '1px solid #4CAF50',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Avatar color="#4CAF50">
            {(user.firstName || user.name || 'U').charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: '600', color: '#2e7d32', fontSize: '16px' }}>
              Welcome back, {user.firstName || user.name || 'Funder'}! 👋
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Manage your beneficiaries and their emergency fund allocations
            </div>
          </div>
        </div>
      )}
      
      <TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '800',
            color: '#222',
            margin: 0
          }}>
            Beneficiaries ({beneficiaries.length})
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <AddButton onClick={handleOpenModal}>
              <span style={{ fontSize: '16px' }}>+</span>
              Link Beneficiary
            </AddButton>
            <AddButton onClick={() => setShowDependentModal(true)}>
              <span style={{ fontSize: '16px' }}>👶</span>
              Register Dependent
            </AddButton>
          </div>
        </div>
        
        <SearchBox>
          <input 
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Main Account</th>
                <th>Emergency Fund</th>
                <th>Total Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Loading beneficiaries...
                  </td>
                </tr>
              ) : filteredBeneficiaries.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No beneficiaries found
                  </td>
                </tr>
              ) : (
                filteredBeneficiaries.map((beneficiary, index) => {
                  const accounts = beneficiary.Accounts || [];
                  const mainAccount = accounts.find(acc => 
                    acc.accountType?.toLowerCase() === 'main' || 
                    acc.accountName?.toLowerCase() === 'main'
                  );
                  const emergencyStats = calculateEmergencyStats(accounts);
                  
                  return (
                    <tr key={index}>
                      <td 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          background: 'inherit', 
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: '10px 6px',
                          borderRadius: '6px'
                        }}
                        onClick={() => handleViewAccountDetails(beneficiary)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f8ff';
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 92, 55, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'inherit';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Avatar color={getRandomPastelColor()}>
                          {(beneficiary.dependentName || beneficiary.name || beneficiary.firstName || '?').charAt(0)}
                        </Avatar>
                        <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#222' }}>
                          {beneficiary.dependentName || beneficiary.name || beneficiary.firstName || '?'}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          fontWeight: 500, 
                          letterSpacing: '0.03em', 
                          color: '#185c37', 
                          fontSize: '11.5px' 
                        }}>
                          {mainAccount?.accountNumber || beneficiary.accountNumber || '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#4CAF50', 
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🚨 {formatCurrency(emergencyStats.emergencyBalance)}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#185c37', 
                          fontSize: '11.5px' 
                        }}>
                          {formatCurrency(emergencyStats.totalBalance)}
                        </span>
                      </td>
                      <td className="action-btns">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(beneficiary, index);
                          }}
                          title="Edit beneficiary"
                        >
                          <img src={editIcon} alt="Edit" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttempt(beneficiary, index);
                          }}
                          title="Delete beneficiary"
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAccountDetails(beneficiary);
                          }}
                          title="View account details"
                          style={{ 
                            background: '#e3f2fd', 
                            borderRadius: '4px',
                            padding: '6px 8px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#1976D2'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {/* Account Details Modal */}
      {showAccountDetails && selectedBeneficiary && (
        <ModalOverlay onClick={() => setShowAccountDetails(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 style={{ 
              marginBottom: '20px', 
              fontSize: '18px', 
              fontWeight: '700',
              color: '#222',
              textAlign: 'center'
            }}>
              {selectedBeneficiary.dependentName || selectedBeneficiary.name || selectedBeneficiary.firstName}'s Account Details
            </h3>
            
            {selectedBeneficiary.Accounts && selectedBeneficiary.Accounts.length > 0 ? (
              <>
                {/* Emergency Fund Statistics */}
                <EmergencyInfo>
                  <h4>🚨 Emergency Fund System</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                    20% of all transfers automatically allocated to emergency savings
                  </p>
                  <div className="emergency-stats">
                    {(() => {
                      const stats = calculateEmergencyStats(selectedBeneficiary.Accounts);
                      return (
                        <>
                          <div className="stat-item">
                            <div className="stat-label">Emergency Fund</div>
                            <div className="stat-value">{formatCurrency(stats.emergencyBalance)}</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-label">Emergency %</div>
                            <div className="stat-value">{stats.emergencyPercentage}%</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-label">Category Balance</div>
                            <div className="stat-value">{formatCurrency(stats.categoryBalance)}</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-label">Total Balance</div>
                            <div className="stat-value">{formatCurrency(stats.totalBalance)}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </EmergencyInfo>

                {/* Accounts Grid */}
                <AccountsGrid>
                  {selectedBeneficiary.Accounts.map((account, idx) => {
                    const isMain = account.accountType?.toLowerCase() === 'main' || 
                                   account.accountName?.toLowerCase() === 'main';
                    return (
                      <AccountCard key={idx} isMain={isMain}>
                        <AccountType>
                          {isMain ? 'Main Account (Emergency)' : 
                           (account.accountType || account.accountName || 'Account')}
                        </AccountType>
                        <BalanceAmount isMain={isMain}>
                          {formatCurrency(account.balance)}
                        </BalanceAmount>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#999', 
                          marginTop: '4px',
                          fontFamily: 'monospace'
                        }}>
                          {account.accountNumber}
                        </div>
                      </AccountCard>
                    );
                  })}
                </AccountsGrid>

                <div style={{ 
                  marginTop: '20px', 
                  padding: '12px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  💡 <strong>Smart Distribution:</strong> Each transfer automatically allocates 20% to emergency savings 
                  and distributes 80% across category accounts based on priority.
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No account details available
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setShowAccountDetails(false)}
                style={{
                  background: 'linear-gradient(135deg, #185c37, #1e6b42)',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClick={() => setShowFormModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <FormContainer onSubmit={isEditing ? handleUpdateBeneficiary : handleAddBeneficiary}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: '700',
                color: '#222',
                textAlign: 'center'
              }}>
                {isEditing ? 'Edit Beneficiary' : 'Link New Beneficiary'}
              </h3>
              
              {!isEditing && (
                <div style={{
                  background: 'linear-gradient(135deg, #e3f2fd, #f0f8ff)',
                  border: '1px solid #2196F3',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#1976D2',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>🚨 Emergency Fund System</div>
                  When you link a beneficiary, our intelligent system automatically:
                  <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                    <li>Allocates <strong>20% to emergency savings</strong> (Main account)</li>
                    <li>Distributes <strong>80% across category budgets</strong></li>
                    <li>Prevents overspending with <strong>category limits</strong></li>
                    <li>Builds <strong>long-term financial discipline</strong></li>
                  </ul>
                </div>
              )}

              {isEditing && mainAccountNumber && (
                <div style={{
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: '#185c37',
                  fontWeight: 600,
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  fontFamily: 'monospace',
                  background: '#e8f5e8',
                  padding: '8px',
                  borderRadius: '6px'
                }}>
                  Main Account: {mainAccountNumber}
                </div>
              )}
              
              {error && (
                <div style={{
                  background: error.includes('✅') ? '#e8f5e8' : error.includes('No beneficiaries') ? '#e3f2fd' : '#ffebee',
                  color: error.includes('✅') ? '#2e7d32' : error.includes('No beneficiaries') ? '#1976d2' : '#c62828',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    color: '#333', 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter beneficiary full name"
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
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    color: '#333', 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter main account number"
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: isEditing ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #185c37, #1e6b42)',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {isEditing ? 'Update Beneficiary' : 'Link Beneficiary'}
                </button>
              </div>
            </FormContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <PopupOverlay>
          <PopupMessage>
            <h4>Confirm Delete</h4>
            <p>
              Are you sure you want to remove "{deleteTarget.beneficiary.dependentName || deleteTarget.beneficiary.name || deleteTarget.beneficiary.firstName}" as a beneficiary?
            </p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleDeleteCancel}
                style={{
                  background: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </PopupMessage>
        </PopupOverlay>
      )}

      {showPopup && (
        <PopupOverlay>
          <PopupMessage>
            <h4>Cannot Delete Beneficiary</h4>
            <p>
              For security reasons, beneficiaries cannot be deleted through the app. 
              Please contact our helpline at 0800 123 456 for assistance.
            </p>
            <button onClick={() => setShowPopup(false)}>
              Close
            </button>
          </PopupMessage>
        </PopupOverlay>
      )}

      {/* Dependent Registration Modal */}
      {showDependentModal && (
        <DependentModal>
          <DependentForm>
            <h3>Register New Dependent</h3>
            <form onSubmit={handleDependentSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={dependentForm.firstName}
                    onChange={handleDependentFormChange}
                    required
                  />
                  {dependentErrors.firstName && (
                    <div className="error-message">{dependentErrors.firstName}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={dependentForm.middleName}
                    onChange={handleDependentFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Surname *</label>
                <input
                  type="text"
                  name="surname"
                  value={dependentForm.surname}
                  onChange={handleDependentFormChange}
                  required
                />
                {dependentErrors.surname && (
                  <div className="error-message">{dependentErrors.surname}</div>
                )}
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="isInfant"
                  checked={dependentForm.isInfant}
                  onChange={handleDependentFormChange}
                />
                <label>This is an infant (12 months or younger)</label>
              </div>

              {dependentForm.isInfant ? (
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={dependentForm.dateOfBirth}
                    onChange={handleDependentFormChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <small>For infants, email and ID will be auto-generated</small>
                  {dependentErrors.dateOfBirth && (
                    <div className="error-message">{dependentErrors.dateOfBirth}</div>
                  )}
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={dependentForm.email}
                      onChange={handleDependentFormChange}
                      required
                    />
                    {dependentErrors.email && (
                      <div className="error-message">{dependentErrors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={dependentForm.password}
                      onChange={handleDependentFormChange}
                      required
                      minLength={6}
                    />
                    {dependentErrors.password && (
                      <div className="error-message">{dependentErrors.password}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>ID Number *</label>
                    <input
                      type="text"
                      name="Idnumber"
                      value={dependentForm.Idnumber}
                      onChange={handleDependentFormChange}
                      required
                    />
                    {dependentErrors.Idnumber && (
                      <div className="error-message">{dependentErrors.Idnumber}</div>
                    )}
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Relationship</label>
                <select
                  name="relation"
                  value={dependentForm.relation}
                  onChange={handleDependentFormChange}
                >
                  <option value="child">Child</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="ward">Ward</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <div className={error.startsWith('✅') ? 'success-message' : 'error-message'}>
                  {error}
                </div>
              )}

              <div className="button-group">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => {
                    setShowDependentModal(false);
                    setDependentForm({
                      firstName: '',
                      middleName: '',
                      surname: '',
                      email: '',
                      password: '',
                      Idnumber: '',
                      relation: 'child',
                      isInfant: false,
                      dateOfBirth: ''
                    });
                    setDependentErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit"
                  disabled={dependentLoading}
                >
                  {dependentLoading ? 'Registering...' : 'Register Dependent'}
                </button>
              </div>
            </form>
          </DependentForm>
        </DependentModal>
      )}
    </BeneficiaryContainer>
  );
};

export default BeneficiaryForm;