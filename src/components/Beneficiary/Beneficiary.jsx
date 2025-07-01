import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const FormContainer = styled.form`
  margin-bottom: 15px;
  width: 70%;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: auto;
  min-height: fit-content;
`;

const TableContainer = styled.div`
  width: 60%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 16px;
  height: 100%;

  .table-wrapper {
    height: calc(100% - 100px);
    overflow-y: auto;
    margin-top: 16px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
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
  const { token } = useSelector(state => state.authentication);
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      if (!token) {
        setError('Please log in to view beneficiaries');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await funderService.getDependents(token);
        
        if (data && data.length > 0) {
          setBeneficiaries(data);
        } else {
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        
        // Handle the improved error messages from the service
        if (error.message === 'No dependents found.') {
          setBeneficiaries([]);
          // Don't set error for no dependents, just show empty table
        } else {
          setError(error.message || 'Failed to load beneficiaries. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBeneficiaries();
    } else {
      setError('Please log in to access this feature');
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBeneficiary = (e) => {
    e.preventDefault();
    if (formData.name && formData.accountNumber) {
      if (isEditing && editingIndex !== null) {
        setBeneficiaries(prev => prev.map((item, index) => 
          index === editingIndex 
            ? { name: formData.name, accountNumber: formData.accountNumber }
            : item
        ));
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setBeneficiaries(prev => [
          ...prev,
          { name: formData.name, accountNumber: formData.accountNumber }
        ]);
      }
      setFormData({
        name: '',
        accountNumber: '',
      });
    }
  };

  const handleEdit = (beneficiary, index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setFormData({
      name: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setFormData({
      name: '',
      accountNumber: '',
    });
  };

  const handleDeleteAttempt = () => {
    setShowPopup(true);
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BeneficiaryContainer>
      <FormContainer onSubmit={handleAddBeneficiary}>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '16px', 
          fontWeight: '800'
        }}>
          {isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary'}
        </h3>
        
        {error && (
          <div style={{
            background: error.includes('No beneficiaries') ? '#e3f2fd' : '#ffebee',
            color: error.includes('No beneficiaries') ? '#1976d2' : '#c62828',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <label style={{ 
              minWidth: '120px',
              maxWidth: '120px',
              color: '#333', 
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis' 
            }}>
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ 
                width: '200px',
                padding: '1px 6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                height: '24px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <label style={{ 
              minWidth: '120px',
              maxWidth: '120px',
              color: '#333', 
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis' 
            }}>
              Acc No:
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              style={{ 
                width: '200px',
                padding: '1px 6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                height: '24px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '12px' }}>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: isEditing ? '#4CAF50' : 'black',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isEditing ? 'Update Beneficiary' : 'Add Beneficiary'}
          </button>
        </div>
      </FormContainer>

      <TableContainer>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '16px', 
          fontWeight: '800',
          textAlign: 'left'
        }}>
          Beneficiaries
        </h3>
        
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
                <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Account number</th>
                <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeneficiaries.length === 0 ? (
                <tr>
                  <td 
                    colSpan="3" 
                    style={{ 
                      textAlign: 'center', 
                      padding: '40px 20px', 
                      color: '#666', 
                      fontStyle: 'italic',
                      border: '1px solid #ddd'
                    }}
                  >
                    {loading ? 'Loading...' : 'No dependents added yet'}
                  </td>
                </tr>
              ) : (
                filteredBeneficiaries.map((beneficiary, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ 
                      padding: '8px 10px', 
                      border: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Avatar color={getRandomPastelColor()}>
                        {beneficiary.name.charAt(0)}
                      </Avatar>
                      {beneficiary.name}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #ddd' }}>
                      {beneficiary.accountNumber}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleEdit(beneficiary, index)}
                          style={{
                            padding: '4px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <img src={editIcon} alt="Edit" style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button
                          onClick={handleDeleteAttempt}
                          style={{
                            padding: '4px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <img src={deleteIcon} alt="Delete" style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>

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
