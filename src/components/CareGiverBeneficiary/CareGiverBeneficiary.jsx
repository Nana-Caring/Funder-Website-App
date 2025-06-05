import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { registerDependent } from '../../services/api';
import { useSelector } from 'react-redux';

const Container = styled.div`
  width: calc(100% - 250px);
  height: calc(100vh - 80px); /* Adjust height to account for header */
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: flex-start;
  padding: 16px;
  margin-left: auto;
  margin-top: 60px; /* Add margin to move content below header */
  box-sizing: border-box;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  height: calc(100vh - 100px);
`;

const FormContainer = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin: 0 auto 24px;
  position: relative;
  width: 420px;
`;

const FormTitle = styled.h2`
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const FormSubtitle = styled.p`
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 8px; /* Reduced from 10px */
  display: flex;
  align-items: center;
  gap: 12px; /* Reduced from 20px */
`;

const Label = styled.label`
  font-size: 12px;
  color: #333;
  min-width: 80px; /* Reduced from 100px */
`;

const Input = styled.input`
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  max-width: 250px; /* Added max-width */
  
  &:focus {
    outline: none;
    border-color: #FD3E6E;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  thead {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 10px; /* Reduced from 12px */
  text-align: left;
  font-weight: 500;
  color: #333;
  font-size: 13px; /* Reduced from 14px */
`;

const Td = styled.td`
  padding: 10px; /* Reduced from 12px */
  border-top: 1px solid #eee;
  color: #666;
  font-size: 13px; /* Reduced from 14px */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  clear: both;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Step = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#006400' : '#ddd'};
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  right: 0;
`;

const NextButton = styled.button`
  background: #FD3E6E;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: #e63562;
  }
`;

const BackButton = styled(NextButton)`
  background: #FD3E6E;
  
  &:hover {
    background: #e63562;
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

const TableWrapper = styled.div`
  width: 800px;
  height: 100; // Fixed height
  overflow: hidden;
  margin-bottom: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: white;

  .table-container {
    height: 100%;
    overflow-y: auto;

    /* Custom scrollbar styling */
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
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'Pulane Thando Malumane', idNumber: '0001234567', relation: 'Daughter' },
    { id: 2, name: 'Pulane Thando Malumane', idNumber: '0001234567', relation: 'Sister' },
  ]);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  // Update the validation function
  const validateStep1 = () => {
    const { firstName, lastName, surname, email, idNumber } = formData;
    
    // Check all required fields including lastName
    if (!firstName || !lastName || !surname || !email || !idNumber) {
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
        lastName: formData.lastName.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: password,
        Idnumber: formData.idNumber.trim(), // Note the capital 'I' in Idnumber
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
        name: `${dependentData.firstName} ${dependentData.lastName} ${dependentData.surname}`.trim(),
        idNumber: dependentData.Idnumber,
        relation: dependentData.relation
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setFeedback({ success: true, message: 'Beneficiary registered successfully!' });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        surname: '',
        email: '',
        idNumber: ''
      });
      setRelation('');
      setPassword('');
      setConfirmPassword('');
      setStep(1);

    } catch (error) {
      console.error('Registration Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: dependentData
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
        <FormContainer>
          {step === 1 && (
            <>
              <FormTitle>Follow the steps to add a beneficiary</FormTitle>
              <FormSubtitle>Please make sure the information is correct</FormSubtitle>
              <FormGroup>
                <Label>First Name: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
                <Input 
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  placeholder="Enter first name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
                <Input 
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  placeholder="Enter last name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Surname: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
                <Input 
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  required
                  placeholder="Enter surname"
                />
              </FormGroup>
              <FormGroup>
                <Label>Email: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Enter email address"
                />
              </FormGroup>
              <FormGroup>
                <Label>ID No: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
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
              </BottomRow>
            </>
          )}
          {step === 2 && (
            <>
              <FormTitle>Complete the last steps to add beneficiary</FormTitle>
              <FormSubtitle>Please make sure the information is correct</FormSubtitle>
              <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 10, marginTop: 10 }}>How are you related ?</div>
              <FormGroup>
                <Label>Relation: <span style={{ color: '#ff4444', fontSize: 11 }}>*</span></Label>
                <select 
                  value={relation} 
                  onChange={e => setRelation(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: '6px', 
                    borderRadius: 4, 
                    border: '1px solid #ddd', 
                    fontSize: 12 
                  }}
                  required
                >
                  <option value="">Choose your relation</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Other">Other</option>
                </select>
              </FormGroup>
              <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 10, marginTop: 10 }}>Confirm passwords:</div>
              <FormGroup>
                <Label>Password: <span style={{ color: '#888', fontSize: 11 }}>(important)</span></Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Confirm Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
                    style={{ background: '#FD3E6E' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Complete'} 
                    {!isLoading && <span style={{ marginLeft: 8 }}>&rarr;</span>}
                  </NextButton>
                </ButtonGroup>
              </BottomRow>
            </>
          )}
        </FormContainer>

        <TableWrapper>
          <div className="table-container">
            <Table>
              <thead>
                <tr>
                  <Th>Avatar</Th>
                  <Th>Names</Th>
                  <Th>ID Number</Th>
                  <Th>Relation</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id}>
                    <Td>
                      <Avatar color={getRandomPastelColor()}>
                        {beneficiary.name.charAt(0)}
                      </Avatar>
                    </Td>
                    <Td>{beneficiary.name}</Td>
                    <Td>{beneficiary.idNumber}</Td>
                    <Td>{beneficiary.relation}</Td>
                    <Td>•••</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </TableWrapper>
      </Content>
      
      {feedback && (
        <FeedbackMessage success={feedback.success}>
          {feedback.message}
        </FeedbackMessage>
      )}
    </Container>
  );
};

export default CareGiverBeneficiary;