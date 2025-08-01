import React, { useState, useEffect } from 'react';
import { caregiverService } from '../../services/caregiverService';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  border: 2px solid #185c37;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 12px;
`;

const DebugButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 4px;
  font-size: 12px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
`;

const LogOutput = styled.pre`
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  overflow-x: auto;
  white-space: pre-wrap;
  font-size: 11px;
`;

const ApiDebugger = ({ show, onClose }) => {
  const [debugOutput, setDebugOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setDebugOutput(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + message);
  };

  const clearLogs = () => {
    setDebugOutput('');
  };

  const testTokenDebug = () => {
    setIsRunning(true);
    addLog('🔍 Testing token debug...');
    
    try {
      const validToken = caregiverService.getValidToken();
      if (validToken) {
        const debugResult = caregiverService.debugToken(validToken);
        addLog(`Token debug result: ${JSON.stringify(debugResult, null, 2)}`);
      } else {
        addLog('❌ No valid token found');
      }
    } catch (error) {
      addLog(`❌ Error in token debug: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const testApiConnection = async () => {
    setIsRunning(true);
    addLog('🔄 Testing API connection...');
    
    try {
      const result = await caregiverService.testConnection();
      addLog(`API test result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      addLog(`❌ Error in API test: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const checkStoredTokens = () => {
    addLog('🔍 Checking stored tokens...');
    
    const sources = [
      'token',
      'accessToken', 
      'authToken',
      'jwt',
      'user',
      'role'
    ];

    sources.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        if (key === 'user') {
          try {
            const user = JSON.parse(value);
            addLog(`✅ ${key}: ${JSON.stringify(user, null, 2)}`);
          } catch {
            addLog(`✅ ${key}: ${value.substring(0, 50)}...`);
          }
        } else {
          addLog(`✅ ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
        }
      } else {
        addLog(`❌ ${key}: not found`);
      }
    });
  };

  const testRegistration = async () => {
    setIsRunning(true);
    addLog('🔄 Testing dependent registration...');
    
    try {
      // Test data for registration
      const testData = {
        firstName: 'Test',
        middleName: 'Middle',
        surname: 'Dependent',
        email: `test.dependent.${Date.now()}@example.com`,
        password: 'TestPassword123',
        Idnumber: '9001015678901',
        relation: 'Son'
      };

      const validToken = caregiverService.getValidToken();
      if (!validToken) {
        addLog('❌ No valid token found for registration test');
        return;
      }

      const result = await caregiverService.registerDependent(validToken, testData);
      addLog(`✅ Registration test successful: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      addLog(`❌ Registration test failed: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const testValidation = () => {
    addLog('🔍 Testing data validation...');
    
    const testCases = [
      {
        name: 'Valid data',
        data: {
          firstName: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          Idnumber: '9001015678901',
          relation: 'Son'
        }
      },
      {
        name: 'Missing fields',
        data: {
          firstName: 'John',
          email: 'john.doe@example.com'
        }
      },
      {
        name: 'Invalid email',
        data: {
          firstName: 'John',
          surname: 'Doe',
          email: 'invalid-email',
          password: 'password123',
          Idnumber: '9001015678901',
          relation: 'Son'
        }
      },
      {
        name: 'Invalid ID number',
        data: {
          firstName: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          Idnumber: '12345',
          relation: 'Son'
        }
      }
    ];

    testCases.forEach(testCase => {
      const validation = caregiverService.validateDependentData(testCase.data);
      addLog(`${validation.isValid ? '✅' : '❌'} ${testCase.name}: ${validation.isValid ? 'Valid' : validation.errors.join(', ')}`);
    });
  };

  const testEndpoints = async () => {
    setIsRunning(true);
    addLog('🔄 Testing registration endpoints...');
    
    try {
      const validToken = caregiverService.getValidToken();
      if (!validToken) {
        addLog('❌ No valid token found for endpoint testing');
        return;
      }

      const results = await caregiverService.testRegistrationEndpoints(validToken);
      addLog(`Endpoint test results:`);
      
      Object.entries(results).forEach(([endpoint, result]) => {
        const status = result.available ? '✅' : '❌';
        addLog(`${status} ${endpoint}: ${result.status} - ${result.message || 'Available'}`);
      });
    } catch (error) {
      addLog(`❌ Endpoint testing failed: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  // Debug function to check assignment status
  const debugAssignment = async () => {
    const token = caregiverService.getValidToken();
    if (!token) return;

    try {
      addLog('🔍 Checking caregiver assignment...');
      
      // Check different endpoints to see where the dependent appears
      const endpoints = [
        { name: 'Caregiver Dependents', call: () => caregiverService.getDependents(token, { limit: 10 }) },
        { name: 'General Dependents', call: () => caregiverService.getDependentsGeneral(token) },
        { name: 'All Accounts', call: () => caregiverService.getAllDependentsAccounts(token) }
      ];

      for (const endpoint of endpoints) {
        try {
          const result = await endpoint.call();
          addLog(`✅ ${endpoint.name}: Found ${result.data?.dependents?.length || result.data?.length || 0} items`);
          if (result.data?.dependents?.length > 0) {
            addLog(`   - First dependent: ${result.data.dependents[0].firstName} ${result.data.dependents[0].surname}`);
          }
        } catch (error) {
          addLog(`❌ ${endpoint.name}: ${error.message}`);
        }
      }
    } catch (error) {
      addLog(`❌ Assignment check failed: ${error.message}`);
    }
  };

  if (!show) return null;

  return (
    <DebugContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h4 style={{ margin: '0 0 16px 0', color: '#185c37' }}>API Debugger</h4>
      
      <div>
        <DebugButton onClick={checkStoredTokens} disabled={isRunning}>
          Check Tokens
        </DebugButton>
        <DebugButton onClick={testTokenDebug} disabled={isRunning}>
          Debug Token
        </DebugButton>
        <DebugButton onClick={testApiConnection} disabled={isRunning}>
          Test API
        </DebugButton>
        <DebugButton onClick={testRegistration} disabled={isRunning}>
          Test Registration
        </DebugButton>
        <DebugButton onClick={testValidation} disabled={isRunning}>
          Test Validation
        </DebugButton>
        <DebugButton onClick={testEndpoints} disabled={isRunning}>
          Test Endpoints
        </DebugButton>
        <DebugButton onClick={debugAssignment} disabled={isRunning}>
          Debug Assignment
        </DebugButton>
        <DebugButton onClick={clearLogs}>
          Clear
        </DebugButton>
      </div>

      {isRunning && <div style={{ color: '#185c37', margin: '8px 0' }}>Running...</div>}
      
      <LogOutput>
        {debugOutput || 'Click buttons above to run diagnostics...'}
      </LogOutput>
    </DebugContainer>
  );
};

export default ApiDebugger;
