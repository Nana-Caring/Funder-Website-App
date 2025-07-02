import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';

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
    // Set a flag to remind later (e.g., after 24 hours)
    localStorage.setItem('profileCompletionReminder', Date.now() + (24 * 60 * 60 * 1000));
    onClose();
  };

  const handleDontShowAgain = () => {
    // Set a flag to not show again
    localStorage.setItem('profileCompletionDismissed', 'true');
    onClose();
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p>Loading profile status...</p>
        </div>
      </div>
    );
  }

  // Don't show popup if profile is complete
  if (profileCompletion.percentage === 100) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            lineHeight: 1
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#fff3cd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <h2 style={{ 
            margin: '0 0 10px 0', 
            color: '#856404',
            fontSize: '24px'
          }}>
            Complete Your Profile
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: '16px'
          }}>
            Your profile is {profileCompletion.percentage}% complete
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            width: `${profileCompletion.percentage}%`,
            height: '100%',
            backgroundColor: '#ffc107',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Message */}
        <div style={{ marginBottom: '25px' }}>
          <p style={{ 
            margin: '0 0 15px 0', 
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Complete your profile to unlock all features and improve your account security.
          </p>
          
          {profileCompletion.missingFields?.length > 0 && (
            <div>
              <p style={{ 
                margin: '0 0 10px 0', 
                color: '#856404',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Missing information:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profileCompletion.missingFields.slice(0, 6).map((field, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                ))}
                {profileCompletion.missingFields.length > 6 && (
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    +{profileCompletion.missingFields.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          flexDirection: 'column'
        }}>
          <button
            onClick={onCompleteProfile}
            style={{
              padding: '12px 20px',
              backgroundColor: '#185c37',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Complete Profile Now
          </button>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px'
          }}>
            <button
              onClick={handleRemindLater}
              style={{
                flex: 1,
                padding: '10px 15px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Remind Me Later
            </button>
            
            <button
              onClick={handleDontShowAgain}
              style={{
                flex: 1,
                padding: '10px 15px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Don't Show Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPopup;
