import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';
import logo from '../../assets/logo.jpg';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Header = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-top: 80px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 8px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #185c37;
    box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const PasswordToggleBtn = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #185c37;
  color: white;
  border: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #1e6b42;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const BackToLogin = styled(Link)`
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-top: 20px;
  transition: color 0.2s ease;

  &:hover {
    color: #185c37;
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get token and email from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Redirect to login if no token or email
    if (!token || !email) {
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { newPassword, confirmPassword } = formData;

      // Validation
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      setLoading(true);

      // Call the reset password API
      const response = await fetch('https://nanacaring-backend.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          token, 
          newPassword 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Reset failed. Please try again.');
      }

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(data.message || 'Reset failed. Please try again.');
      }
      
    } catch (err) {
      console.error('Reset Password Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (success) {
    return (
      <Container>
        <Header>
          <Logo src={logo} alt="Nana Logo" />
          <BackToLogin to="/login">Back to Login</BackToLogin>
        </Header>
        
        <FormContainer>
          <Title>Password Reset Successful!</Title>
          <SuccessMessage>
            Your password has been reset successfully. You can now log in with your new password.
            You will be redirected to the login page in a few seconds.
          </SuccessMessage>
          <BackToLogin to="/login">Go to Login Page →</BackToLogin>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="Nana Logo" />
        <BackToLogin to="/login">Back to Login</BackToLogin>
      </Header>
      
      <FormContainer>
        <Title>Reset Your Password</Title>
        <Description>
          Enter your new password below. Make sure it's secure and easy to remember.
        </Description>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>New Password:</Label>
            <PasswordInputContainer>
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                className={error && formData.newPassword === formData.confirmPassword ? '' : 'error'}
                required
              />
              <PasswordToggleBtn
                type="button"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggleBtn>
            </PasswordInputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Confirm New Password:</Label>
            <PasswordInputContainer>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                className={error && formData.newPassword !== formData.confirmPassword ? 'error' : ''}
                required
              />
              <PasswordToggleBtn
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggleBtn>
            </PasswordInputContainer>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </SubmitButton>
        </form>

        <BackToLogin to="/login">← Back to Login</BackToLogin>
      </FormContainer>
    </Container>
  );
};

export default ResetPasswordPage;
