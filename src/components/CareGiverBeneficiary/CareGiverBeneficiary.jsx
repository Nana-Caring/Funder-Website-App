import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 96.91%;
  height: 100vh;
  background: #f3f7f1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  margin-left: 35px;
  overflow: hidden;
`;

const Content = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 0;
  padding-top: 12px;
  padding-left: 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-top: 0px;
  position: relative;
  overflow: hidden;
  max-width: 420px;
  width: 100%;
  max-height: calc(100vh - 200px);
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
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #333;
  min-width: 100px;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #FD3E6E;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  max-height: calc(100vh - 400px);
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
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
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

const NextButton = styled.button`
  background: #FD3E6E;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  position: absolute;
  right: 0;
  
  &:hover {
    background: #e63562;
  }
`;

const CareGiverBeneficiary = () => {
  const [step, setStep] = useState(1);
  const [relation, setRelation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Container>
      <Content>
        <FormContainer>
          {step === 1 && (
            <>
              <FormTitle>Follow the steps to add a beneficiary</FormTitle>
              <FormSubtitle>Please make sure the information is correct</FormSubtitle>
              <FormGroup>
                <Label>First Name</Label>
                <Input type="text" />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input type="text" />
              </FormGroup>
              <FormGroup>
                <Label>Surname</Label>
                <Input type="text" />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" />
              </FormGroup>
              <FormGroup>
                <Label>ID No</Label>
                <Input type="text" />
              </FormGroup>
              <BottomRow>
                <StepIndicator>
                  <Step active={step === 1} />
                  <Step active={step === 2} />
                </StepIndicator>
                <NextButton onClick={() => setStep(2)}>Next</NextButton>
              </BottomRow>
            </>
          )}
          {step === 2 && (
            <>
              <FormTitle>Complete the last steps to add beneficiary</FormTitle>
              <FormSubtitle>Please make sure the information is correct</FormSubtitle>
              <div style={{ color: '#185c37', fontWeight: 600, marginBottom: 10, marginTop: 10 }}>How are you related ?</div>
              <FormGroup>
                <Label>Relation: <span style={{ color: '#888', fontSize: 11 }}>(important)</span></Label>
                <select value={relation} onChange={e => setRelation(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: 4, border: '1px solid #ddd', fontSize: 12 }}>
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
                <NextButton style={{ background: '#fff', color: '#185c37', border: 'none' }}>
                  Complete <span style={{ marginLeft: 8 }}>&rarr;</span>
                </NextButton>
              </BottomRow>
            </>
          )}
        </FormContainer>
        {step === 1 && (
          <Table>
            <thead>
              <tr>
                <Th>Names</Th>
                <Th>ID Number</Th>
                <Th>Relation</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Pulane Thando Malumane</Td>
                <Td>0001234567</Td>
                <Td>Daughter</Td>
                <Td>•••</Td>
              </tr>
              <tr>
                <Td>Pulane Thando Malumane</Td>
                <Td>0001234567</Td>
                <Td>Sister</Td>
                <Td>•••</Td>
              </tr>
            </tbody>
          </Table>
        )}
      </Content>
    </Container>
  );
};

export default CareGiverBeneficiary;