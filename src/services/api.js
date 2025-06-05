import axios from 'axios';

const BASE_URL = 'https://nanacaring-backend.onrender.com/api/auth';

// Add validation helper
const validateDependentData = (data) => {
  // First ensure all fields are present and not empty strings after trimming
  const requiredFields = [
    'firstName',
    'lastName',
    'surname',
    'email',
    'idNumber',
    'relation',
    'password'
  ];

  const missingOrEmptyFields = requiredFields.filter(field => {
    const value = data[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });

  if (missingOrEmptyFields.length > 0) {
    console.error('Validation failed - missing or empty fields:', missingOrEmptyFields);
    throw new Error(`Required fields missing or empty: ${missingOrEmptyFields.join(', ')}`);
  }

  // Log validated data
  console.log('All required fields present:', {
    firstName: 'present',
    lastName: 'present',
    surname: 'present',
    email: 'present',
    idNumber: 'present',
    relation: 'present',
    password: 'present'
  });

  // Enhanced email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new Error('Invalid email format');
  }

  // Enhanced ID number validation
  const idNumber = data.idNumber.trim();
  if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
    throw new Error('ID Number must be exactly 13 digits');
  }

  // Enhanced password validation
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  return true;
};

export const registerDependent = async (dependentData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    // Ensure data matches exactly what API expects
    const requestBody = {
      firstName: dependentData.firstName,
      lastName: dependentData.lastName,
      surname: dependentData.surname,
      email: dependentData.email,
      password: dependentData.password,
      Idnumber: dependentData.Idnumber,
      relation: dependentData.relation
    };

    console.log('Making API request:', {
      url: `${BASE_URL}/register-dependent`,
      headers: config.headers,
      body: { ...requestBody, password: '[HIDDEN]' }
    });

    const response = await axios.post(
      `${BASE_URL}/register-dependent`,
      requestBody,
      config
    );

    return response.data;
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data
    });
    throw error;
  }
};