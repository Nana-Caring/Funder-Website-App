import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import { useSelector } from 'react-redux';
import { funderService } from '../../services/funderService';

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
  max-width: 450px;
  width: 90%;
  max-height: fit-content;
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
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 32px 24px 24px 24px;
  margin-top: 24px;
  margin-bottom: 32px;
  height: 480px; /* Fixed height for scroll effect */
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
    font-size: 11.5px; /* Further decreased font size for more rows */
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

const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 75%)`;
};

const BeneficiaryForm = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({name: '', accountNumber: ''});
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch beneficiaries from backend and persist to localStorage
  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://nanacaring-backend.onrender.com/api/funder/get-beneficiaries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetched = response.data.beneficiaries || [];
      setBeneficiaries(fetched);
      // Persist to localStorage
      localStorage.setItem('funder_beneficiaries', JSON.stringify(fetched));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };


  // Load beneficiaries from localStorage once, then fetch from backend in background
  useEffect(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('funder_beneficiaries');
    if (stored) {
      try {
        setBeneficiaries(JSON.parse(stored));
      } catch (e) {
        // Ignore parse error, fallback to fetch
      }
    }
    // Always fetch fresh in background (but only once)
    fetchBeneficiaries();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add beneficiary via backend
  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.accountNumber){
      setError('Please fill in all fields');
      return;
    }

    console.log('Sending data to backend:', formData);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://nanacaring-backend.onrender.com/api/funder/link-dependent', {
        dependentName: formData.name,
        accountNumber: formData.accountNumber

      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }  
      );

      
      if (response.status === 200 || response.status === 201) {
        setFormData({ name: '', accountNumber: '' });
        setError('✅ Beneficiary added successfully.');
        setShowFormModal(false);
        await fetchBeneficiaries(); // Refresh beneficiaries list
      } else {
        setError(response.data.message || 'Failed to add beneficiary');
      }
    } catch (err) {
      console.error('Error adding beneficiary:', err);
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleEdit = (beneficiary, index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setFormData({
      name: beneficiary.name || beneficiary.firstName,
      accountNumber: beneficiary.accountNumber,
    });
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
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `/api/funder/beneficiary/${beneficiaries[editingIndex]._id}`,
      {
        dependentName: formData.name,
        accountNumber: formData.accountNumber
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      setFormData({ name: '', accountNumber: '' });
      setError('✅ Beneficiary updated successfully.');
      setShowFormModal(false);
      setIsEditing(false);
      setEditingIndex(null);
      await fetchBeneficiaries(); // refresh + update localStorage
    } else {
      setError(response.data.message || 'Failed to update beneficiary');
    }
  } catch (err) {
    console.error('Error updating beneficiary:', err);
    setError(err.response?.data?.message || 'Server error');
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setFormData({
      name: '',
      accountNumber: '',
    });
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

  const handleDeleteAttempt = () => {
    setShowPopup(true);
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    (beneficiary.name || beneficiary.firstName || '')
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  return (
    <BeneficiaryContainer>
      <TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '800',
            color: '#222',
            margin: 0
          }}>
            Beneficiaries
          </h3>
          <AddButton onClick={handleOpenModal}>
            <span style={{ fontSize: '16px' }}>+</span>
            Add Beneficiary
          </AddButton>
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
                <th>Account number</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeneficiaries.map((beneficiary, index) => (
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
                    onClick={() => handleEdit(beneficiary, index)}
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
                    <span style={{ fontFamily: 'monospace', fontWeight: 500, letterSpacing: '0.03em', color: '#185c37', fontSize: '11.5px' }}>
                      {beneficiary.accountNumber}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>

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
                {isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary'}
              </h3>
              
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
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter beneficiary name"
                    style={{ 
                      width: '280px',
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
                    placeholder="Enter account number"
                    style={{ 
                      width: '280px',
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
                  {isEditing ? 'Update Beneficiary' : 'Add Beneficiary'}
                </button>
              </div>
            </FormContainer>
          </ModalContent>
        </ModalOverlay>
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
    </BeneficiaryContainer>
  );
};

export default BeneficiaryForm;
