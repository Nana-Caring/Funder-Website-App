import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { KeyboardArrowDown } from '@mui/icons-material';
import cardBg from '../../assets/card.jpg';
import accountService from '../../services/accountService';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: -40px;
  height: calc(100vh - 60px); /* Adjust height to fill the viewport minus header */
  overflow: hidden;
  position: relative;
  margin-left: 175px; /* Adjust this value to match the width of the sidebar */
  
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: url(${cardBg});
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  padding: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const CardLogo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #cac8c8;
  font-family: 'Podkova', serif;
`;

const CardDetails = styled.div`
  position: relative;
  z-index: 2;
  text-align: left;
`;

const CardNumber = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
`;

const CardHolder = styled.div`
  font-size: 16px;
  opacity: 0.8;
  margin-top: 5px;
`;

const TransferContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 560px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 18px;
`;

const Select = styled.div`
  position: relative;
  background: #f8f8f8;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;

  &:hover {
    background: #f0f0f0;
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`;

const DropdownItem = styled.div`
  padding: 12px 14px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f8f8;
  }

  .account-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-balance {
    color: #666;
    font-size: 12px;
  }
`;

const ToLabel = styled.div`
  text-align: center;
  color: #999;
  margin: 5px 0;
  font-size: 14px;
`;

const AmountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
  flex-wrap: wrap;
`;

const AmountInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 300px;

  label {
    color: #666;
    font-size: 14px;
    white-space: nowrap;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #000;
    }
  }
`;

const TransferButton = styled.button`
  padding: 13px 20px;
  background: transparent;
  color: #4CAF50;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: underline;
  text-decoration-color: #4CAF50;
  text-underline-offset: 4px;

  &:hover {
    color: #45a049;
    text-decoration-color: #45a049;
  }
`;

const DependentTransfer = () => {
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          return accounts;
        }
      }
    } catch (error) {
      console.warn('Error parsing userAccounts from localStorage:', error);
    }
    return [];
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
    return 'USER';
  };

  // Format account name for display
  const formatAccountName = (accountType) => {
    if (!accountType) return 'Account';
    
    // Capitalize first letter and add "Account" suffix
    const formatted = accountType.charAt(0).toUpperCase() + accountType.slice(1).toLowerCase();
    return `Nana ${formatted} Account`;
  };

  // Load account data
  useEffect(() => {
    const loadAccountData = async () => {
      setIsLoading(true);

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
            // Set default selected account (main account or first account)
            const mainAccount = allAccounts.find(acc => 
              acc.accountType?.toLowerCase() === 'main' || 
              acc.accountType?.toLowerCase() === 'primary'
            );
            setSelectedFromAccount(mainAccount || allAccounts[0]);
            setIsLoading(false);
            return;
          }
        }

        // Try to get from localStorage userAccounts
        const storageAccounts = getUserAccountsFromStorage();
        if (storageAccounts.length > 0) {
          setAccounts(storageAccounts);
          // Set default selected account (main account or first account)
          const mainAccount = storageAccounts.find(acc => 
            acc.accountType?.toLowerCase() === 'main' || 
            acc.accountType?.toLowerCase() === 'primary'
          );
          setSelectedFromAccount(mainAccount || storageAccounts[0]);
          setIsLoading(false);
          return;
        }

        // If no cached or storage data, try to fetch fresh data
        try {
          const accountsData = await accountService.getDependentMyAccounts();
          
          if (accountsData && (accountsData.totalBalance !== undefined || accountsData.accounts)) {
            const allAccounts = [
              ...(accountsData.accounts?.main || []),
              ...(accountsData.accounts?.sub || [])
            ];
            
            setAccounts(allAccounts);
            // Set default selected account (main account or first account)
            const mainAccount = allAccounts.find(acc => 
              acc.accountType?.toLowerCase() === 'main' || 
              acc.accountType?.toLowerCase() === 'primary'
            );
            setSelectedFromAccount(mainAccount || allAccounts[0]);
          }
        } catch (apiError) {
          console.warn('Failed to fetch fresh account data:', apiError);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle from account selection
  const handleFromAccountSelect = (account) => {
    setSelectedFromAccount(account);
    setShowFromDropdown(false);
    // Clear to account if it's the same as from account
    if (selectedToAccount && selectedToAccount.id === account.id) {
      setSelectedToAccount(null);
    }
  };

  // Handle to account selection
  const handleToAccountSelect = (account) => {
    setSelectedToAccount(account);
    setShowToDropdown(false);
  };

  // Get available accounts for "to" dropdown (exclude selected from account)
  const getAvailableToAccounts = () => {
    return accounts.filter(account => account.id !== selectedFromAccount?.id);
  };

  if (isLoading) {
    return (
      <Container>
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
      </Container>
    );
  }
  return (
    <Container>
      <Card>
        <CardDetails>
          <CardHolder>{getUserInitialsAndSurname()?.toUpperCase()}</CardHolder>
          <CardNumber>{selectedFromAccount?.accountNumber || '****-****-****'}</CardNumber>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.8, 
            marginTop: '5px',
            color: '#CAC8C8'
          }}>
            {selectedFromAccount ? formatAccountName(selectedFromAccount.accountType) : 'Select Account'}
          </div>
          <div style={{ 
            fontSize: '14px', 
            marginTop: '8px',
            fontWeight: 'bold'
          }}>
            Balance: {selectedFromAccount ? accountService.formatCurrency(selectedFromAccount.balance) : 'R0.00'}
          </div>
        </CardDetails>
      </Card>

      <TransferContainer>
        <Title>Choose Account</Title>

        <div style={{ position: 'relative' }} data-dropdown>
          <Select onClick={() => setShowFromDropdown(!showFromDropdown)}>
            <span>
              {selectedFromAccount ? formatAccountName(selectedFromAccount.accountType) : 'Select From Account'}
            </span>
            <KeyboardArrowDown fontSize="small" />
          </Select>
          
          {showFromDropdown && (
            <DropdownList>
              {accounts.map(account => (
                <DropdownItem 
                  key={account.id} 
                  onClick={() => handleFromAccountSelect(account)}
                >
                  <div className="account-info">
                    <span>{formatAccountName(account.accountType)}</span>
                    <span className="account-balance">
                      {accountService.formatCurrency(account.balance)}
                    </span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </div>

        <ToLabel>To</ToLabel>

        <div style={{ position: 'relative' }} data-dropdown>
          <Select onClick={() => setShowToDropdown(!showToDropdown)}>
            <span>
              {selectedToAccount ? formatAccountName(selectedToAccount.accountType) : 'Select To Account'}
            </span>
            <KeyboardArrowDown fontSize="small" />
          </Select>
          
          {showToDropdown && (
            <DropdownList>
              {getAvailableToAccounts().length > 0 ? (
                getAvailableToAccounts().map(account => (
                  <DropdownItem 
                    key={account.id} 
                    onClick={() => handleToAccountSelect(account)}
                  >
                    <div className="account-info">
                      <span>{formatAccountName(account.accountType)}</span>
                      <span className="account-balance">
                        {accountService.formatCurrency(account.balance)}
                      </span>
                    </div>
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem style={{ color: '#999', fontStyle: 'italic' }}>
                  No other accounts available
                </DropdownItem>
              )}
            </DropdownList>
          )}
        </div>

        <AmountRow>
          <AmountInputGroup>
            <label>Amount</label>
            <input
              type="number"
              placeholder="R 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </AmountInputGroup>

          <TransferButton 
            disabled={!selectedFromAccount || !selectedToAccount || !amount}
            style={{
              opacity: (!selectedFromAccount || !selectedToAccount || !amount) ? 0.5 : 1,
              cursor: (!selectedFromAccount || !selectedToAccount || !amount) ? 'not-allowed' : 'pointer'
            }}
          >
            Transfer
          </TransferButton>
        </AmountRow>
      </TransferContainer>
    </Container>
  );
};

export default DependentTransfer;

