import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../store/slices/ui';

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #185c37;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1e6b42;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 13px;
`;

const SearchInput = styled.input`
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  width: 160px;
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  height: calc(100vh - 280px);
  margin-top: 16px;

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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead {
    position: sticky;
    top: 0;
    background: #f3f7f1;
    z-index: 1;
    
    tr {
      th {
        padding: 12px 16px;
        background: #f3f7f1;
      }
    }
  }

  tbody {
    tr {
      &:hover {
        background: #f8f9fa;
      }
    }
  }
`;

const Th = styled.th`
  background: #f3f7f1;
  color: #222;
  font-weight: 500;
  padding: 8px 6px;
  text-align: left;
`;

const Td = styled.td`
  padding: 8px 6px;
  border-top: 1px solid #f0f0f0;
  color: #333;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 80px;
  box-sizing: border-box;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
  flex-direction: column;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-width: 120px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #185c37;
`;

const StatusBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'completed':
      case 'success':
        return 'background: #dcfce7; color: #166534;';
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'failed':
      case 'error':
        return 'background: #fecaca; color: #dc2626;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const RefreshButton = styled.button`
  padding: 4px 8px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #e5e7eb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Statements = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successfulTransactions: 0,
    failedTransactions: 0
  });

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    const token = safeLocalStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      dispatch(showLoading({ message: 'Loading transaction statements...' }));
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching funder transactions...');
      
      // Try the new funder transaction endpoint first
      let response = await fetch(
        'https://nanacaring-backend.onrender.com/api/funder/transactions',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // If new endpoint fails, try fallback to deposit/account endpoint
      if (!response.ok && response.status === 404) {
        console.log('🔄 New transactions endpoint not available, trying fallback...');
        response = await fetch(
          'https://nanacaring-backend.onrender.com/api/funder/deposit/account',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const result = await response.json();
          console.log('📊 Fallback API Response:', result);
          
          if (result.success && result.data && result.data.transactions) {
            // Transform fallback data format
            const transformedTransactions = result.data.transactions.map((t, index) => ({
              id: t.id || index,
              reference: t.id || `TXN-${index}`,
              transferReference: t.id || `TXN-${index}`,
              amount: parseFloat(t.amount) || 0,
              currency: 'ZAR',
              type: t.type || 'transfer',
              status: 'completed',
              description: t.description || 'Transaction',
              beneficiaryName: 'Transfer',
              accountType: 'Main',
              targetAccountType: 'Main',
              createdAt: t.createdAt,
              timestamp: t.createdAt
            }));
            
            setTransactions(transformedTransactions);
            
            // Calculate basic statistics
            const totalAmount = transformedTransactions.reduce((sum, t) => sum + t.amount, 0);
            setStats({
              totalTransactions: transformedTransactions.length,
              totalAmount: totalAmount,
              successfulTransactions: transformedTransactions.length,
              failedTransactions: 0
            });
            
            console.log('✅ Fallback transactions loaded:', transformedTransactions.length);
            return;
          }
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          // No transactions endpoint available, show empty state
          console.log('📝 No transaction endpoints available - showing empty state');
          setTransactions([]);
          setStats({
            totalTransactions: 0,
            totalAmount: 0,
            successfulTransactions: 0,
            failedTransactions: 0
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📊 Transactions API Response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch transactions');
      }

      const transactionsData = result.data || [];
      setTransactions(transactionsData);

      // Use summary from API if available, otherwise calculate
      if (result.summary) {
        setStats({
          totalTransactions: result.summary.totalTransactions || transactionsData.length,
          totalAmount: result.summary.totalAmount || 0,
          successfulTransactions: result.summary.successfulTransactions || 0,
          failedTransactions: result.summary.failedTransactions || 0
        });
      } else {
        // Calculate statistics
        const totalAmount = transactionsData.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const successfulCount = transactionsData.filter(t => 
          t.status === 'completed' || t.status === 'success'
        ).length;
        const failedCount = transactionsData.filter(t => 
          t.status === 'failed' || t.status === 'error'
        ).length;

        setStats({
          totalTransactions: transactionsData.length,
          totalAmount: totalAmount,
          successfulTransactions: successfulCount,
          failedTransactions: failedCount
        });
      }

      console.log('✅ Transactions loaded successfully:', transactionsData.length);

    } catch (err) {
      console.error('❌ Failed to fetch transactions:', err);
      setError(err.message);
      
      // Set empty state on error
      setTransactions([]);
      setStats({
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
        failedTransactions: 0
      });
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on search criteria
  const filteredTransactions = transactions.filter(transaction => {
    const searchMatch = !search || 
      (transaction.beneficiaryName && transaction.beneficiaryName.toLowerCase().includes(search.toLowerCase())) ||
      (transaction.accountType && transaction.accountType.toLowerCase().includes(search.toLowerCase())) ||
      (transaction.description && transaction.description.toLowerCase().includes(search.toLowerCase())) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(search.toLowerCase()));

    // Date filtering (if month/year selected)
    let dateMatch = true;
    if (month || year) {
      const transactionDate = new Date(transaction.createdAt || transaction.timestamp);
      if (month && transactionDate.getMonth() !== parseInt(month)) {
        dateMatch = false;
      }
      if (year && transactionDate.getFullYear() !== parseInt(year)) {
        dateMatch = false;
      }
    }

    return searchMatch && dateMatch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return dateString;
    }
  };

  // Download transactions as CSV
  const handleDownload = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to download');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Date', 'Reference', 'Amount', 'Currency', 'Beneficiary', 'Account Type', 'Status', 'Description'];
      const csvContent = [
        headers.join(','),
        ...filteredTransactions.map(t => [
          `"${formatDate(t.createdAt || t.timestamp)}"`,
          `"${t.reference || t.transferReference || 'N/A'}"`,
          t.amount || '0.00',
          t.currency || 'ZAR',
          `"${t.beneficiaryName || 'Unknown'}"`,
          `"${t.accountType || t.targetAccountType || 'N/A'}"`,
          t.status || 'unknown',
          `"${(t.description || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `funder_statements_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('📥 Downloaded transactions CSV');
    } catch (err) {
      console.error('❌ Download failed:', err);
      alert('Failed to download statements. Please try again.');
    }
  };

  return (
    <MainContent>
      <Container>
        <Content>
          <Title>
            <span>
              Transaction Statements
              {!loading && stats.totalTransactions > 0 && (
                <span style={{ 
                  marginLeft: '8px', 
                  fontSize: '11px', 
                  background: '#f0f9ff', 
                  color: '#0369a1',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'normal'
                }}>
                  {stats.totalTransactions} transactions
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <RefreshButton 
                onClick={fetchTransactions} 
                disabled={loading}
                title="Refresh transactions"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23,4 23,10 17,10"></polyline>
                  <polyline points="1,20 1,14 7,14"></polyline>
                  <path d="m20.49,9a9,9,0,1,1,-2.13-5.36L23,10"></path>
                </svg>
                {loading ? 'Loading...' : 'Refresh'}
              </RefreshButton>
              <DownloadButton 
                onClick={handleDownload} 
                disabled={loading || filteredTransactions.length === 0}
                title="Download statements as CSV"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download CSV
              </DownloadButton>
            </div>
          </Title>

          {/* Statistics Row */}
          <StatsRow>
            <StatCard>
              <StatLabel>Total Transactions</StatLabel>
              <StatValue>{stats.totalTransactions}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Amount</StatLabel>
              <StatValue>R{stats.totalAmount.toFixed(2)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Successful</StatLabel>
              <StatValue style={{ color: '#059669' }}>{stats.successfulTransactions}</StatValue>
            </StatCard>
            {stats.failedTransactions > 0 && (
              <StatCard>
                <StatLabel>Failed</StatLabel>
                <StatValue style={{ color: '#dc2626' }}>{stats.failedTransactions}</StatValue>
              </StatCard>
            )}
          </StatsRow>

          {/* Error Display */}
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          <FilterRow>
            <span>Filter by:</span>
            <Select value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </Select>
            <Select value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </Select>
            <SearchInput
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FilterRow>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Date & Time</Th>
                  <Th>Reference</Th>
                  <Th>Amount</Th>
                  <Th>Beneficiary</Th>
                  <Th>Account Type</Th>
                  <Th>Status</Th>
                  <Th>Description</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <LoadingSpinner>
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          style={{
                            animation: 'spin 1s linear infinite',
                            marginRight: '8px'
                          }}
                        >
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        <div>
                          <div>Loading your transaction history...</div>
                          <div style={{ fontSize: '12px', marginTop: '4px', opacity: '0.7' }}>
                            This may take a few moments
                          </div>
                        </div>
                      </LoadingSpinner>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id || transaction.transferReference || index}>
                      <Td>{formatDate(transaction.createdAt || transaction.timestamp)}</Td>
                      <Td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                        {transaction.reference || transaction.transferReference || 'N/A'}
                      </Td>
                      <Td style={{ color: '#ef4444', fontWeight: '600' }}>
                        -R{parseFloat(transaction.amount || 0).toFixed(2)} {transaction.currency || ''}
                      </Td>
                      <Td>{transaction.beneficiaryName || 'Unknown'}</Td>
                      <Td>
                        <span style={{ 
                          background: '#f0f9ff', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#0369a1'
                        }}>
                          {transaction.accountType || transaction.targetAccountType || 'N/A'}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge status={transaction.status}>
                          {transaction.status || 'unknown'}
                        </StatusBadge>
                      </Td>
                      <Td style={{ fontSize: '11px', maxWidth: '200px', wordWrap: 'break-word' }}>
                        {transaction.description || 'No description'}
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                      {error ? (
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
                            Failed to load transactions
                          </div>
                          <div style={{ fontSize: '13px', marginBottom: '16px' }}>
                            {error}
                          </div>
                          <button
                            onClick={fetchTransactions}
                            style={{
                              padding: '8px 16px',
                              background: '#185c37',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            Try Again
                          </button>
                        </div>
                      ) : stats.totalTransactions === 0 ? (
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                            No transactions yet
                          </div>
                          <div style={{ fontSize: '13px', color: '#666' }}>
                            Your transaction history will appear here once you start sending money to your beneficiaries.
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                            No transactions match your search
                          </div>
                          <div style={{ fontSize: '13px', color: '#666' }}>
                            Try adjusting your search criteria or date filters.
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Content>
      </Container>
    </MainContent>
  );
};

export default Statements;