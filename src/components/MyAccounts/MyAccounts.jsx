import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../Header/Header';
import accountService from '../../services/accountService';
import cardBg from '../../assets/images/card-bg.png';

const Container = styled.div`
  position: relative;
  margin-top: 40px;
  width: calc(100% - 250px);
  margin-left: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
  flex: 1;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 32px;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #185c37, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
`;



const BalanceCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 6px;
  width: 100%;
  align-self: center;


  display: flex;
  flex-direction: column;
  gap: 16px;

  .balance-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
  }

  .balance-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    flex: 1;
    text-align: center;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.03), rgba(34, 197, 94, 0.03));
    border-radius: 12px;
    border: 1px solid rgba(24, 92, 55, 0.08);

    p {
      font-size: 16px;
      margin: 0;
      font-weight: 400;
      font-family: Inter;
      color: #666;
    }

    .balance-label {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
    }

    .balance-amount {
      font-size: 1.8rem;
      font-weight: 700;
      color: #185c37;
      font-family: 'Inter', sans-serif;
    }
  }

  .card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .balance-section {
    text-align: center;
    padding: 24px;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.05), rgba(34, 197, 94, 0.05));
    border-radius: 16px;
    border: 1px solid rgba(24, 92, 55, 0.1);
  }

  .balance-label {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
  }

  .balance-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #185c37;
    font-family: 'Inter', sans-serif;
  }

  .error-message {
    padding: 16px;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1px solid #f59e0b;
    border-radius: 12px;
    font-size: 14px;
    color: #92400e;
    font-weight: 500;
    text-align: center;
  }

  .deposit-section {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .deposit-button {
    background: linear-gradient(135deg, #185c37, #22c55e);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 120px;

    &:hover {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    }
  }
`;

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    margin-bottom: 8px;
  }

  .card-brand-external {
    font-size: 18px;
    font-weight: 700;
    color: #185c37;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.5px;
  }

  .card-type-external {
    background: linear-gradient(135deg, #185c37, #22c55e);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px rgba(24, 92, 55, 0.2);
  }

  .card-details-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    margin-top: 8px;
  }

  .account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .account-number {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .account-holder {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
  }

  .balance-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .balance-label-external {
    font-size: 10px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .balance-amount-external {
    font-size: 20px;
    font-weight: 700;
    color: #185c37;
    font-family: 'Inter', sans-serif;
  }
`;

const NanaCard = styled.div`
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 20px;
  border-radius: 15px;
  aspect-ratio: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 170px;
  width: 100%;
  max-width: 380px;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(24, 92, 55, 0.1), rgba(34, 197, 94, 0.05));
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  .card-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .card-main-brand {
    font-size: 24px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.95);
    font-family: 'Inter', sans-serif;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .card-tagline {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Inter', sans-serif;
    letter-spacing: 1px;
    text-align: center;
  }

  .card-chip {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 24px;
    height: 18px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .card-pattern {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 20px;
    opacity: 0.3;
    
    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      top: 0;
      left: 0;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      top: 0;
      right: 0;
    }
  }
`;







const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

// Add responsive styles
const ResponsiveWrapper = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    ${Container} {
      width: 100%;
      padding: 16px;
      margin-left: 0;
    }
    
    ${Content} {
      gap: 24px;
    }
    
    ${PageTitle} {
      font-size: 28px;
    }
    
    ${PageSubtitle} {
      font-size: 14px;
    }
    
    ${BalanceCard} {
      padding: 24px;
      margin: 0 8px;
      
      .deposit-button {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
    
    .balance-amount {
      font-size: 2rem !important;
    }
    
    ${NanaCard} {
      height: 180px;
      padding: 24px;
      max-width: 320px;
      min-width: 250px;
      
      .card-name {
        font-size: 14px;
      }
      
      .card-number {
        font-size: 16px;
      }
      
      .card-balance .balance-amount {
        font-size: 14px;
      }
    }
  }
  
  @media (max-width: 480px) {
    ${BalanceCard} {
      padding: 20px;
      gap: 24px;
    }
    
    .balance-amount {
      font-size: 1.8rem !important;
    }
    
    ${NanaCard} {
      height: 160px;
      padding: 20px;
      max-width: 280px;
      min-width: 220px;
    }
  }
`;



const MyCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get user information from localStorage (same as Dashboard)
  const userName = localStorage.getItem('userName') || 
                   localStorage.getItem('firstName') || 
                   JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                   'User';
  const userSurname = localStorage.getItem('surname') || JSON.parse(localStorage.getItem('user') || '{}').surname || '';
  const userMiddleName = localStorage.getItem('middleName') || JSON.parse(localStorage.getItem('user') || '{}').middleName || '';
  
  // Get full user display name
  const fullUserName = [localStorage.getItem('firstName'), userMiddleName, userSurname]
    .filter(Boolean)
    .join(' ') || userName;

  // Helper function to get user's initials and surname (same as Dashboard)
  const getUserInitialsAndSurname = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const firstName = userData.firstName || '';
        const surname = userData.surname || '';
        
        // Get first letter of first name
        const firstInitial = firstName.charAt(0).toUpperCase();
        
        // Return initials and surname
        if (firstInitial && surname) {
          return `${firstInitial}. ${surname}`;
        } else if (surname) {
          return surname;
        } else if (firstName) {
          return firstName;
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return '';
  };

  // Helper function to get main account number (same as Dashboard)
  const getMainAccountNumber = () => {
    // First check for quick access main account number from localStorage (stored during login)
    const mainAccountNumber = localStorage.getItem('mainAccountNumber');
    if (mainAccountNumber) {
      return mainAccountNumber;
    }
    
    // Try to get from localStorage userAccounts
    try {
      const userAccounts = localStorage.getItem('userAccounts');
      if (userAccounts) {
        const accounts = JSON.parse(userAccounts);
        const mainAccount = accounts.find(account => 
          account.accountType?.toLowerCase() === 'main' || 
          account.accountType?.toLowerCase() === 'primary'
        );
        if (mainAccount?.accountNumber) {
          return mainAccount.accountNumber;
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts from localStorage:', error);
    }
    
    return '';
  };

  // Load account data on component mount
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay like the Dashboard
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Handle deposit funds via Stripe
  const handleDepositFunds = async () => {
    try {
      setLoading(true);
      
      // Here you would integrate with your Stripe payment processing
      // For now, we'll show a placeholder implementation
      
      // Example Stripe integration would look like this:
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     amount: 10000, // Amount in cents (e.g., $100.00)
      //     currency: 'zar',
      //     payment_method_types: ['card'],
      //   }),
      // });
      
      // const { client_secret } = await response.json();
      
      // Then redirect to Stripe Checkout or use Stripe Elements
      // window.location.href = `https://checkout.stripe.com/pay/${client_secret}`;
      
      // For demo purposes, we'll simulate a successful deposit
      alert('Stripe deposit integration would be implemented here. This would redirect to Stripe Checkout for secure payment processing.');
      
    } catch (error) {
      console.error('Error initiating deposit:', error);
      setError('Failed to initiate deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <ResponsiveWrapper>
      <Header />
      <Container>
        <Content>
          

          {loading ? (
            <LoadingState>
              Loading your card information...
            </LoadingState>
          ) : (
            <BalanceCard>
            {/* Balance Row for Main Account and Money Out */}
            <div className="balance-row">
              <div className="balance-item">
                <div>
                  <div className="balance-label">Main Account Balance</div>
                  <div className="balance-amount">
                    {(() => {
                      // For funder role, display only one balance from localStorage (same logic as Dashboard)
                      const userRole = localStorage.getItem('userRole');
                      if (userRole === 'funder') {
                        // Try to get the funder main balance first
                        const funderMainBalance = localStorage.getItem('funderMainBalance');
                        if (funderMainBalance) {
                          return accountService.formatCurrency(funderMainBalance);
                        }
                        
                        // Try to get from the raw login response
                        try {
                          const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
                          if (loginResponse.balance) {
                            return accountService.formatCurrency(loginResponse.balance);
                          } else if (loginResponse.accounts?.length > 0) {
                            return accountService.formatCurrency(loginResponse.accounts[0].balance);
                          }
                        } catch (e) {
                          console.warn('Error parsing login response', e);
                        }
                      }
                      
                      // Fall back to R0.00 for non-funders or if no specific funder balance found
                      return 'R0.00';
                    })()}
                  </div>
                </div>
              </div>

              <div className="balance-item">
                <div>
                  <div className="balance-label">Money Out Balance</div>
                  <div className="balance-amount">
                    {(() => {
                      // Try to get the money out balance from localStorage
                      const userRole = localStorage.getItem('userRole');
                      if (userRole === 'funder') {
                        // Try to get the funder money out balance
                        const funderMoneyOutBalance = localStorage.getItem('funderMoneyOutBalance');
                        if (funderMoneyOutBalance) {
                          return accountService.formatCurrency(funderMoneyOutBalance);
                        }
                        
                        // Try to get from the raw login response
                        try {
                          const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
                          if (loginResponse.accounts?.length > 1) {
                            // Assuming money out is the second account
                            return accountService.formatCurrency(loginResponse.accounts[1].balance);
                          }
                        } catch (e) {
                          console.warn('Error parsing login response for money out', e);
                        }
                      }
                      
                      // Fall back to R0.00 for non-funders or if no specific money out balance found
                      return 'R0.00';
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Deposit Button */}
            <div className="deposit-section">
              <button className="deposit-button" onClick={() => handleDepositFunds()}>
                Deposit
              </button>
            </div>

            <div className="card-container">
              <NanaCardWrapper>
                {/* Header with brand and card type outside the card */}
                <div className="card-info-header">
                  <div className="card-brand-external">Nana Caring</div>
                  <div className="card-type-external">Funding Card</div>
                </div>

                {/* The simplified card */}
                <NanaCard>
                  
                  <div className="card-pattern"></div>
                  
                  <div className="card-logo">
                    <div className="card-main-brand">NANA</div>
                    <div className="card-tagline">Caring • Funding • Growing</div>
                  </div>
                </NanaCard>

                {/* Footer with account details and balance outside the card */}
                <div className="card-details-footer">
                  <div className="account-info">
                    {getMainAccountNumber() && (
                      <div className="account-number">
                        {getMainAccountNumber().replace(/(\d{4})(?=\d)/g, '$1 ')}
                      </div>
                    )}
                    <div className="account-holder">
                      {getUserInitialsAndSurname()?.toUpperCase() || fullUserName?.toUpperCase() || userName?.toUpperCase() || 'USER'}
                    </div>
                  </div>
                  
                  <div className="balance-info">
                    <div className="balance-label-external">Available Balance</div>
                    <div className="balance-amount-external">
                      {(() => {
                        const userRole = localStorage.getItem('userRole');
                        if (userRole === 'funder') {
                          const funderMainBalance = localStorage.getItem('funderMainBalance');
                          if (funderMainBalance) {
                            return accountService.formatCurrency(funderMainBalance);
                          }
                          
                          try {
                            const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
                            if (loginResponse.balance) {
                              return accountService.formatCurrency(loginResponse.balance);
                            } else if (loginResponse.accounts?.length > 0) {
                              return accountService.formatCurrency(loginResponse.accounts[0].balance);
                            }
                          } catch (e) {
                            console.warn('Error parsing login response', e);
                          }
                        }
                        return 'R0.00';
                      })()}
                    </div>
                  </div>
                </div>
              </NanaCardWrapper>
            </div>
          </BalanceCard>
          )}
        </Content>
      </Container>
    </ResponsiveWrapper>
  );
};

export default MyCards;