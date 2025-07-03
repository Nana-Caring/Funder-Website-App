import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { registerDependent } from '../../services/api';
import { useSelector } from 'react-redux';

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
  background: ${props => props.active ? '#185c37' : '#ddd'};
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
  background-color: ${props => props.success ? '#4CAF50' : '#f44336'};
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

const CareGiverBeneficiary = () => {
  const [step, setStep] = useState(1);
  const [relation, setRelation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'Pulane Thando Malumane', idNumber: '0001234567', relation: 'Daughter' },
    { id: 2, name: 'Pulane Thando Malumane', idNumber: '0001234567', relation: 'Sister' },
  ]);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '', // changed from lastName
    surname: '',
    email: '',
    idNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const { user } = useSelector(state => state.authentication);

  useEffect(() => {
    if (!token) {
      setFeedback({
        success: false,
        message: 'No authentication token found. Please login again.'
      });
    }
  }, [token]);

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 75%)`;
  };

  const handleOpenModal = () => {
    setShowFormModal(true);
    setStep(1);
    setFormData({
      firstName: '',
      middleName: '',
      surname: '',
      email: '',
      idNumber: ''
    });
    setRelation('');
    setPassword('');
    setConfirmPassword('');
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setStep(1);
    setFormData({
      firstName: '',
      middleName: '',
      surname: '',
      email: '',
      idNumber: ''
    });
    setRelation('');
    setPassword('');
    setConfirmPassword('');
    setFeedback(null);
  };

  // Update the validation function
  const validateStep1 = () => {
    const { firstName, surname, email, idNumber } = formData;
    
    // Remove middleName from required fields check
    if (!firstName || !surname || !email || !idNumber) {
      setFeedback({
        success: false,
        message: 'Please fill in all required fields before proceeding'
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({
        success: false,
        message: 'Please enter a valid email address'
      });
      return false;
    }

    // ID validation
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      setFeedback({
        success: false,
        message: 'ID Number must be exactly 13 digits'
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!relation) {
      setFeedback({
        success: false,
        message: 'Please select your relation'
      });
      return false;
    }

    if (!password) {
      setFeedback({
        success: false,
        message: 'Password is required'
      });
      return false;
    }

    if (password !== confirmPassword) {
      setFeedback({
        success: false,
        message: 'Passwords do not match'
      });
      return false;
    }

    if (password.length < 6) {
      setFeedback({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      return false;
    }

    return true;
  };

  const handleComplete = async () => {
    try {
      if (!validateStep2()) {
        return;
      }

      setIsLoading(true);

      // Format data according to the expected API structure
      const dependentData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(), // changed from lastName
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: password,
        Idnumber: formData.idNumber.trim(),
        relation: relation.trim()
      };

      // Debug log
      console.log('Sending registration data:', {
        ...dependentData,
        password: '[HIDDEN]'
      });

      // Make API call with token
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await registerDependent(dependentData, token);
      console.log('Registration successful:', result);

      // Update UI after successful registration
      const newBeneficiary = {
        id: beneficiaries.length + 1,
        name: `${dependentData.firstName} ${dependentData.middleName} ${dependentData.surname}`.trim(),
        idNumber: dependentData.Idnumber,
        relation: dependentData.relation
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setFeedback({ success: true, message: 'Beneficiary registered successfully!' });
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        middleName: '', // changed from lastName
        surname: '',
        email: '',
        idNumber: ''
      });
      setRelation('');
      setPassword('');
      setConfirmPassword('');
      setStep(1);
      setShowFormModal(false);

    } catch (error) {
      console.error('Registration Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setFeedback({
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to register beneficiary'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Content>
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

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Names</th>
                  <th>ID Number</th>
                  <th>Relation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((beneficiary) => (
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
                      <span style={{ fontSize: '11.5px', color: '#999' }}>•••</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableContainer>
      </Content>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {step === 1 && (
              <>
                <FormTitle>Follow the steps to add a beneficiary</FormTitle>
                <FormSubtitle>Please make sure the information is correct</FormSubtitle>
                <FormGroup>
                  <Label>First Name: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    placeholder="Enter first name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Middle Name:</Label>
                  <Input 
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                    placeholder="Enter middle name (optional)"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Surname: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    required
                    placeholder="Enter surname"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="Enter email address"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ID No: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <Input 
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    placeholder="Enter 13 digits"
                    pattern="\d{13}"
                    maxLength="13"
                    required
                  />
                </FormGroup>
                <BottomRow>
                  <StepIndicator>
                    <Step active={step === 1} />
                    <Step active={step === 2} />
                  </StepIndicator>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <BackButton onClick={handleCloseModal}>
                      Cancel
                    </BackButton>
                    <NextButton 
                      onClick={() => {
                        if (validateStep1()) {
                          setStep(2);
                          setFeedback(null); // Clear any existing feedback
                        }
                      }}
                    >
                      Next
                    </NextButton>
                  </div>
                </BottomRow>
              </>
            )}
            {step === 2 && (
              <>
                <FormTitle>Complete the last steps to add beneficiary</FormTitle>
                <FormSubtitle>Please make sure the information is correct</FormSubtitle>
                <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 16, marginTop: 20, fontSize: 14 }}>How are you related?</div>
                <FormGroup>
                  <Label>Relation: <span style={{ color: '#ff4444', fontSize: 12 }}>*</span></Label>
                  <select 
                    value={relation} 
                    onChange={e => setRelation(e.target.value)}
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
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password:</Label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                </FormGroup>
                <BottomRow>
                  <StepIndicator>
                    <Step active={step === 1} />
                    <Step active={step === 2} />
                  </StepIndicator>
                  <ButtonGroup>
                    <BackButton onClick={() => setStep(1)}>
                      <span style={{ marginRight: 8 }}>&larr;</span> Back
                    </BackButton>
                    <NextButton 
                      onClick={handleComplete}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Complete'} 
                      {!isLoading && <span style={{ marginLeft: 8 }}>&rarr;</span>}
                    </NextButton>
                  </ButtonGroup>
                </BottomRow>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
      
      {feedback && (
        <FeedbackMessage success={feedback.success}>
          {feedback.message}
        </FeedbackMessage>
      )}
    </Container>
  );
};

export default CareGiverBeneficiary;