import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ExpandMore } from '@mui/icons-material';
import cardBg from '../../assets/card.jpg';
import accountService from '../../services/accountService';

// Updated: Fixed AccountService.getUserDisplayName error - using local getUserInitialsAndSurname function

const Container = styled.div`
display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: -40px;
  height: calc(100vh - 60px); /* Adjust height to fill the viewport minus header */
  overflow: hidden;
  position: relative;
  margin-left: 175px; /* Adjust this value to match the width of the sidebar */
  
`;

const Content = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const AccountCard = styled.div`
  background-color: #e0e0e0;
  padding: 12px 24px;
  min-height: 64px; /* consistent item height to allow predictable scrolling */
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 16px;
    font-weight: 400;
    color: #333;
  }
`;

const AccountNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  color: #666;
  font-size: 14px;
  white-space: nowrap;

  span {
    min-width: 120px;
    text-align: right;
  }
`;

const NanaCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto 12px auto;
`;

const NanaCardShadow = styled.div`
  position: absolute;
  top: 35px;
  left: 40px;
  width: calc(100% + 30px);
  height: 197px;
  background-color: gray;
  border-radius: 15px;
  z-index: 0;
  filter: blur(1px);
`;

const NanaCard = styled.div`
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 16px;
  border-radius: 15px;
  aspect-ratio: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 150px;
  width: 100%;
  max-width: 380px;
  z-index: 1;

  .card-name {
    font-size: 18px;
    font-weight: bold;
    margin-left: 9px;
    margin-top: 4px;
    font-family: 'Podkova', serif;
    color: #CAC8C8;
  }
`;

const AccountsListWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 8px 8px 28px 8px; /* add bottom padding so last item isn't hidden behind scrollbar/border */
  /* Show 4 items, then scroll. Each item: min-height (64px) + margin-bottom (12px) = 76px per item */
  max-height: calc((64px + 12px) * 4 + 12px); /* extra 12px for top padding */
  overflow-y: auto;
  box-sizing: border-box;
  padding-right: 12px; /* give some room for scrollbar */
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a1a1a1;
    }
  }

  /* Ensure last child has enough space to be fully visible when scrolled */
  > *:last-child {
    margin-bottom: 20px;
  }
`;

const DependentMyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState('R0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // Helper function to get cached account data
  const getCachedAccountData = () => {
    try {
      const cachedItem = localStorage.getItem('cachedAccountData');
      if (!cachedItem) return null;
      
      const { data, timestamp } = JSON.parse(cachedItem);
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      // Check if cache is still valid
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error reading cached account data:', error);
      return null;
    }
  };

  // Helper function to get user accounts from localStorage
  const getUserAccountsFromStorage = () => {
    try {
      const userAccounts = localStorage.getItem('userAccounts');
      if (userAccounts) {
        const accounts = JSON.parse(userAccounts);
        if (Array.isArray(accounts)) {
          return {
            totalBalance: accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0).toString(),
            currency: accounts[0]?.currency || "ZAR",
            allAccounts: accounts
          };
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts from localStorage:', error);
    }
    return null;
  };

  // Helper function to get user's initials and surname
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

  // Helper function to get main account number for selected account
  const getSelectedAccountNumber = () => {
    const selectedAccount = getSelectedAccount();
    return selectedAccount?.accountNumber || '';
  };

  // Helper function to get selected account
  const getSelectedAccount = () => {
    if (!selectedAccountId) return accounts[0] || null;
    return accounts.find(account => account.id === selectedAccountId) || accounts[0] || null;
  };

  // Load account data
  useEffect(() => {
    const loadAccountData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // First try to get from cache
        const cachedData = getCachedAccountData();
        if (cachedData) {
          const allAccounts = [
            ...(cachedData.accounts?.main || []),
            ...(cachedData.accounts?.sub || [])
          ];
          if (allAccounts.length > 0) {
            setAccounts(allAccounts);
            setTotalBalance(accountService.formatCurrency(cachedData.totalBalance || 0));
            // Set default selected account (main account or first account)
            const mainAccount = allAccounts.find(acc => 
              acc.accountType?.toLowerCase() === 'main' || 
              acc.accountType?.toLowerCase() === 'primary'
            );
            setSelectedAccountId(mainAccount?.id || allAccounts[0]?.id);
            setIsLoading(false);
            return;
          }
        }

        // Try to get from localStorage userAccounts
        const storageData = getUserAccountsFromStorage();
        if (storageData && storageData.allAccounts.length > 0) {
          setAccounts(storageData.allAccounts);
          setTotalBalance(accountService.formatCurrency(storageData.totalBalance || 0));
          // Set default selected account (main account or first account)
          const mainAccount = storageData.allAccounts.find(acc => 
            acc.accountType?.toLowerCase() === 'main' || 
            acc.accountType?.toLowerCase() === 'primary'
          );
          setSelectedAccountId(mainAccount?.id || storageData.allAccounts[0]?.id);
          setIsLoading(false);
          return;
        }

        // If no cached or storage data, try to fetch fresh data
        try {
          // Use the new endpoint for dependent accounts
          const response = await fetch('/api/accounts/dependent/my-accounts', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Optionally add auth headers if needed
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          let accountsData;
          try {
            accountsData = await response.json();
          } catch (jsonError) {
            // If response is not JSON, show a clear error
            throw new Error('Server returned invalid JSON. This may indicate a misconfigured endpoint or a server error.');
          }
          if (accountsData && (accountsData.totalBalance !== undefined || accountsData.accounts)) {
            const allAccounts = [
              ...(accountsData.accounts?.main || []),
              ...(accountsData.accounts?.sub || [])
            ];
            setAccounts(allAccounts);
            setTotalBalance(accountService.formatCurrency(accountsData.totalBalance || 0));
            // Set default selected account (main account or first account)
            const mainAccount = allAccounts.find(acc => 
              acc.accountType?.toLowerCase() === 'main' || 
              acc.accountType?.toLowerCase() === 'primary'
            );
            setSelectedAccountId(mainAccount?.id || allAccounts[0]?.id);
            // Persist to localStorage for future instant loads
            localStorage.setItem('userAccounts', JSON.stringify(allAccounts));
            localStorage.setItem('cachedAccountData', JSON.stringify({
              data: accountsData,
              timestamp: Date.now()
            }));
          } else {
            throw new Error('No account data received');
          }
        } catch (apiError) {
          // If 404, show a friendlier message
          if (apiError.message && apiError.message.includes('404')) {
            setError('No dependent accounts found.');
          } else if (apiError.message && apiError.message.includes('invalid JSON')) {
            setError('Server returned invalid JSON. Please check the backend endpoint or contact support.');
          } else {
            console.warn('Failed to fetch fresh account data:', apiError);
            setError('Unable to load account data. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        setError('Failed to load accounts');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, []);

  // Restore selected account from localStorage when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const savedAccountId = localStorage.getItem('selectedMyAccountId');
      if (savedAccountId && accounts.find(acc => acc.id === savedAccountId)) {
        setSelectedAccountId(savedAccountId);
      } else {
        // Default to main account or first account
        const mainAccount = accounts.find(acc => 
          acc.accountType?.toLowerCase() === 'main' || 
          acc.accountType?.toLowerCase() === 'primary'
        );
        setSelectedAccountId(mainAccount?.id || accounts[0]?.id);
      }
    }
  }, [accounts, selectedAccountId]);

  // Format account name for display
  const formatAccountName = (accountType) => {
    if (!accountType) return 'Account';
    
    // Capitalize first letter and add "Account" suffix
    const formatted = accountType.charAt(0).toUpperCase() + accountType.slice(1).toLowerCase();
    return `Nana ${formatted} Account`;
  };

  // Format account number for display (show first 4 and last 4 digits)
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return '****...****';
    
    const numStr = accountNumber.toString();
    if (numStr.length >= 8) {
      return `${numStr.slice(0, 4)}...${numStr.slice(-4)}`;
    }
    return numStr;
  };

  if (isLoading) {
    return (
      <Container>
        <Content>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading accounts...
          </div>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px',
            fontSize: '16px',
            color: '#e74c3c'
          }}>
            {error}
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <div style={{ fontSize: '16px', color: '#333', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '8px', width: '100%', maxWidth: '540px', textAlign: 'left', margin: '0 auto 8px auto' }}>
          Balance: {getSelectedAccount() ? accountService.formatCurrency(getSelectedAccount().balance) : totalBalance}
        </div>
        <NanaCardWrapper>
          <NanaCard>
            <div style={{ fontSize: '12px', marginTop: '4px', marginLeft: '9px', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              {getUserInitialsAndSurname()?.toUpperCase() || 'USER'}
            </div>
            <div style={{ fontSize: '12px', marginTop: '2px', marginLeft: '9px', color: '#CAC8C8', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              {getSelectedAccount() ? formatAccountName(getSelectedAccount().accountType) : 'Select Account'}
            </div>
            <div style={{ fontSize: '16px', marginTop: '4px', marginLeft: '9px', letterSpacing: '2px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {getSelectedAccountNumber() || '****-****-****'}
            </div>
          </NanaCard>
        </NanaCardWrapper>
        <AccountsListWrapper>
          {accounts.length > 0 ? (
            accounts.map((account, index) => (
              <AccountCard 
                key={account.id || index} 
                onClick={() => {
                  setSelectedAccountId(account.id);
                  // Optionally store selected account in localStorage
                  localStorage.setItem('selectedMyAccountId', account.id);
                }}
                style={{ 
                  margin: index === 0 ? '12px 0 0 0' : '0',
                  background: selectedAccountId === account.id ? '#FD3E6E' : 
                             account.accountType?.toLowerCase() === 'main' ? '#f0f8ff' : '#f7f7f7',
                  color: selectedAccountId === account.id ? 'white' : '#333',
                  boxShadow: selectedAccountId === account.id ? '0 2px 6px rgba(253,62,110,0.12)' : 
                            account.accountType?.toLowerCase() === 'main' ? '0 1px 3px rgba(0,100,200,0.1)' : 'none',
                  fontWeight: selectedAccountId === account.id ? 600 : 
                             account.accountType?.toLowerCase() === 'main' ? 500 : 400,
                  border: selectedAccountId === account.id ? 'none' : 
                         account.accountType?.toLowerCase() === 'main' ? '1px solid #e3f2fd' : 'none',
                  transform: selectedAccountId === account.id ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                }}>
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    maxWidth: '260px' 
                  }}>
                    {account.emergencyFund ? '🚨 ' : ''}{account.accountName || formatAccountName(account.accountType)}
                  </span>
                </div>
                <AccountNumber>
                  <span>{formatAccountNumber(account.accountNumber)}</span>
                  <span>{accountService.formatCurrency(account.balance)}</span>
                  <ExpandMore style={{ 
                    color: selectedAccountId === account.id ? 'white' : '#333', 
                    marginLeft: '8px' 
                  }} />
                </AccountNumber>
              </AccountCard>
            ))
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '16px'
            }}>
              No accounts found
            </div>
          )}
        </AccountsListWrapper>
      </Content>
    </Container>
  );
};

export default DependentMyAccounts;