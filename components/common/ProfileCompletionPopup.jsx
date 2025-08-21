import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { profileService } from '../../services/profileService';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #666;
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  animation: ${slideIn} 0.4s ease-out 0.1s both;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #185c37, #22c55e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  box-shadow: 0 6px 16px rgba(24, 92, 55, 0.3);
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
`;

const ProgressSection = styled.div`
  margin-bottom: 20px;
  animation: ${slideIn} 0.4s ease-out 0.2s both;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
`;

const ProgressBar = styled.div`
  width: ${props => props.percentage}%;
  height: 100%;
  background: linear-gradient(135deg, #185c37, #22c55e);
  border-radius: 8px;
  transition: width 0.6s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const PercentageText = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
`;

const Message = styled.div`
  margin-bottom: 20px;
  animation: ${slideIn} 0.4s ease-out 0.3s both;
`;

const MessageText = styled.p`
  margin: 0 0 12px 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.5;
`;

const MissingFieldsLabel = styled.p`
  margin: 0 0 8px 0;
  color: #e53e3e;
  font-weight: 600;
  font-size: 13px;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FieldTag = styled.span`
  padding: 6px 12px;
  background: linear-gradient(135deg, #e53e3e, #fc8181);
  color: white;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
`;

const MoreFieldsTag = styled(FieldTag)`
  background: linear-gradient(135deg, #6c757d, #a0aec0);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${slideIn} 0.4s ease-out 0.4s both;
  margin-top: 8px;
  position: relative;
  z-index: 2;
`;

const PrimaryButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #185c37, #22c55e);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(24, 92, 55, 0.3);
  position: relative;
  z-index: 1;
  width: 100%;

  &:hover {
    background: linear-gradient(135deg, #22c55e, #185c37);
    box-shadow: 0 6px 20px rgba(24, 92, 55, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #185c37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 16px;
`;

const ProfileCompletionPopup = ({ onClose, onCompleteProfile }) => {
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    missingFields: [],
    completedFields: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const completionData = await profileService.getProfileCompletion();
        setProfileCompletion(completionData);
      } catch (error) {
        console.warn('Failed to fetch profile completion:', error.message);
        // Calculate completion locally as fallback
        calculateLocalCompletion();
      } finally {
        setLoading(false);
      }
    };

    const calculateLocalCompletion = () => {
      const storedUser = localStorage.getItem('user');
      let userData = {};
      
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          return;
        }
      }

      const requiredFields = [
        'firstName', 'surname', 'email', 'phoneNumber', 'Idnumber',
        'postalAddressLine1', 'postalCity', 'postalProvince', 'postalCode',
        'homeAddressLine1', 'homeCity', 'homeProvince', 'homeCode'
      ];
      
      const completedFields = requiredFields.filter(field => 
        userData[field] && userData[field].toString().trim() !== ''
      );
      
      const missingFields = requiredFields.filter(field => 
        !userData[field] || userData[field].toString().trim() === ''
      );
      
      const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
      
      setProfileCompletion({
        percentage,
        completedFields,
        missingFields,
        totalFields: requiredFields.length
      });
    };

    fetchProfileCompletion();
  }, []);

  const handleRemindLater = () => {
    // Set a flag to remind later after 10 minutes
    localStorage.setItem('profileCompletionReminder', Date.now() + (10 * 60 * 1000));
    onClose();
  };

  const handleDontShowAgain = () => {
    // Set a flag to not show again
    localStorage.setItem('profileCompletionDismissed', 'true');
    onClose();
  };

  if (loading) {
    return (
      <ModalOverlay>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading profile status...</LoadingText>
        </LoadingContainer>
      </ModalOverlay>
    );
  }

  // Don't show popup if profile is complete
  if (profileCompletion.percentage === 100) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          ×
        </CloseButton>

        <Header>
          <IconWrapper>
            👤
          </IconWrapper>
          <Title>Complete Your Profile</Title>
          <Subtitle>Unlock all features and improve security</Subtitle>
        </Header>

        <ProgressSection>
          <PercentageText>{profileCompletion.percentage}% Complete</PercentageText>
          <ProgressBarContainer>
            <ProgressBar percentage={profileCompletion.percentage} />
          </ProgressBarContainer>
        </ProgressSection>

        <Message>
          <MessageText>
            Complete your profile to access all features, improve account security, and get personalized recommendations.
          </MessageText>
          
          {profileCompletion.missingFields?.length > 0 && (
            <div>
              <MissingFieldsLabel>
                Missing information:
              </MissingFieldsLabel>
              <FieldsContainer>
                {profileCompletion.missingFields.slice(0, 6).map((field, index) => (
                  <FieldTag key={index}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </FieldTag>
                ))}
                {profileCompletion.missingFields.length > 6 && (
                  <MoreFieldsTag>
                    +{profileCompletion.missingFields.length - 6} more
                  </MoreFieldsTag>
                )}
              </FieldsContainer>
            </div>
          )}
        </Message>

        <ButtonSection>
          <PrimaryButton onClick={onCompleteProfile}>
            Complete Profile Now
          </PrimaryButton>
          
          <SecondaryButtonGroup>
            <SecondaryButton onClick={handleRemindLater}>
              Remind Me Later
            </SecondaryButton>
            
            <SecondaryButton onClick={handleDontShowAgain}>
              Don't Show Again
            </SecondaryButton>
          </SecondaryButtonGroup>
        </ButtonSection>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileCompletionPopup;
