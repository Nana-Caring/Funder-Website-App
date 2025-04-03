import React, { useState } from 'react';
import editIcon from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';

const BeneficiaryForm = () => {
  const [beneficiaries, setBeneficiaries] = useState([
    { name: 'Sex', accountNumber: '1213 2322 4353 3421' },
    { name: 'Daughter', accountNumber: '1213 2322 4353 3421' }
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    accountNumber: '',
    expiryDate: '',
    ccv: ''
  });

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
      setBeneficiaries(prev => [
        ...prev,
        { name: formData.name, accountNumber: formData.accountNumber }
      ]);
      setFormData({
        name: '',
        cardNumber: '',
        accountNumber: '',
        expiryDate: '',
        ccv: ''
      });
    }
  };

  return (
    <div className="beneficiary-form" style={{ 
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <form onSubmit={handleAddBeneficiary} style={{ 
        marginBottom: '15px',
        width: '70%',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Form fields */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ minWidth: '140px', maxWidth: '140px', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Name of beneficiary</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ flex: 1, padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px', height: '24px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ minWidth: '140px', maxWidth: '140px', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Card number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              style={{ flex: 1, padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px', height: '24px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ minWidth: '140px', maxWidth: '140px', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Account number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              style={{ flex: 1, padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px', height: '24px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ minWidth: '140px', maxWidth: '140px', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Expiry date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="DD/MM/YEAR"
              style={{ flex: 1, padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px', height: '24px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <label style={{ minWidth: '140px', maxWidth: '140px', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CCV</label>
            <input
              type="text"
              name="ccv"
              value={formData.ccv}
              onChange={handleInputChange}
              maxLength={3}
              style={{ width: '50px', padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px', height: '24px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add beneficiary
          </button>
        </div>
      </form>

      <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '800', marginLeft: '40px' }}>Beneficiaries</h3>
      <div style={{ width: '81%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '8px', marginLeft: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Account number</th>
              <th style={{ textAlign: 'left', padding: '4px 10px', color: '#666', fontWeight: '500', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '4px 10px', border: '1px solid #ddd' }}>{beneficiary.name}</td>
                <td style={{ padding: '4px 10px', border: '1px solid #ddd' }}>{beneficiary.accountNumber}</td>
                <td style={{ padding: '4px 10px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
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
                      onClick={() => setBeneficiaries(prev => prev.filter((_, i) => i !== index))}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeneficiaryForm;
