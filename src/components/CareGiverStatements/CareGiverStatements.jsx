import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { 
  fetchCaregiverTransactions, 
  fetchDependents,
  fetchTransactionAnalytics 
} from '../../store/slices/beneficiaries';
import { caregiverService } from '../../services/caregiverService';

const mockData = [
  { id: 1, date: '25-mar-2025 11:05 AM', amount: 'R500.00', beneficiary: 'Son', account: 'Savings Account' },
  { id: 2, date: '25-mar-2025 11:05 AM', amount: 'R600.00', beneficiary: 'Daughter', account: 'Medication Account' },
  { id: 3, date: '25-mar-2025 11:05 AM', amount: 'R800.00', beneficiary: 'Son', account: 'Savings Account' },
  { id: 4, date: '25-mar-2025 11:05 AM', amount: 'R900.00', beneficiary: 'Daughter', account: 'Medication Account' },
  { id: 5, date: '25-mar-2025 11:05 AM', amount: 'R600.00', beneficiary: 'Son', account: 'Savings Account' },
  { id: 6, date: '25-mar-2025 11:05 AM', amount: 'R600.00', beneficiary: 'Daughter', account: 'Medication Account' },
  { id: 7, date: '25-mar-2025 11:05 AM', amount: 'R800.00', beneficiary: 'Son', account: 'Savings Account' },
  { id: 8, date: '25-mar-2025 11:05 AM', amount: 'R900.00', beneficiary: 'Daughter', account: 'Medication Account' },
];

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px); /* Adjust for header margin */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
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

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #ef4444;
  font-size: 14px;
  text-align: center;
`;

const DownloadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #222;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalField = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #185c37;
    box-shadow: 0 0 0 3px rgba(24, 92, 55, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #185c37;
    color: white;
    
    &:hover {
      background: #1e6b42;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #333;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e9ecef;
    }
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Reduced from 16px */
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 4px 8px; /* Reduced padding */
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 13px;
`;

const SearchInput = styled.input`
  margin-left: auto;
  padding: 4px 8px; /* Reduced padding */
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  width: 160px; /* Reduced from 180px */
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  height: calc(100vh - 280px); /* Fixed height for scrolling */
  margin-top: 16px;

  /* Custom scrollbar styling */
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
        background: #f3f7f1; /* Ensure header background is solid */
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
  padding: 8px 6px; /* Reduced padding */
  text-align: left;
`;

const Td = styled.td`
  padding: 8px 6px; /* Reduced padding */
  border-top: 1px solid #f0f0f0;
  color: #333;
`;

const Page = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: #f7faf7;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 80px; /* Add margin to move content below header */
  box-sizing: border-box;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CareGiverStatements = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedDependent, setSelectedDependent] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    dependentId: '',
    month: '',
    year: '',
    format: 'csv'
  });

  // Get data from Redux store
  const { 
    list: dependents, 
    isLoading, 
    error,
    transactions 
  } = useSelector(state => state.beneficiaries);
  const { user } = useSelector(state => state.authentication);
  
  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchDependents({ token, params: { limit: 50 } }));
      dispatch(fetchCaregiverTransactions({ 
        token, 
        params: { 
          limit: 100, 
          sortBy: 'createdAt', 
          sortOrder: 'DESC' 
        } 
      }));
      dispatch(fetchTransactionAnalytics({ token, params: { period: 'month' } }));
    }
  }, [dispatch, token]);

  // Process transactions for display
  const processTransactions = () => {
    if (!transactions?.all || !Array.isArray(transactions.all)) {
      return [];
    }

    return transactions.all.map((tx, index) => {
      const dependent = dependents.find(dep => dep.id === tx.userId || dep.userId === tx.userId);
      const txDate = new Date(tx.timestamp || tx.createdAt || tx.date);
      
      return {
        id: tx.id || index + 1,
        date: txDate.toLocaleDateString('en-ZA', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        amount: tx.type === 'Credit' ? `+R${tx.amount?.toFixed(2) || '0.00'}` : `-R${tx.amount?.toFixed(2) || '0.00'}`,
        beneficiary: dependent ? 
          (dependent.name || `${dependent.firstName || ''} ${dependent.surname || ''}`.trim()) : 
          'Unknown',
        account: tx.category || tx.description || 'General Account',
        rawDate: txDate,
        dependentId: tx.userId
      };
    });
  };

  // Filter transactions based on search and date filters
  const getFilteredTransactions = () => {
    const processed = processTransactions();
    
    return processed.filter(tx => {
      // Search filter
      const searchMatch = !search || 
        tx.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
        tx.account.toLowerCase().includes(search.toLowerCase());
      
      // Dependent filter
      const dependentMatch = !selectedDependent || tx.dependentId === selectedDependent;
      
      // Month filter
      const monthMatch = !month || tx.rawDate.getMonth() === parseInt(month);
      
      // Year filter
      const yearMatch = !year || tx.rawDate.getFullYear() === parseInt(year);
      
      return searchMatch && dependentMatch && monthMatch && yearMatch;
    });
  };

  // Download statements function
  const handleDownload = async (format = 'csv') => {
    try {
      setIsDownloading(true);
      
      const params = {
        format,
        startDate: downloadOptions.year && downloadOptions.month ? 
          new Date(parseInt(downloadOptions.year), parseInt(downloadOptions.month), 1).toISOString() : 
          undefined,
        endDate: downloadOptions.year && downloadOptions.month ? 
          new Date(parseInt(downloadOptions.year), parseInt(downloadOptions.month) + 1, 0).toISOString() : 
          undefined,
        dependentId: downloadOptions.dependentId || undefined
      };

      await caregiverService.downloadStatements(token, params);
      setShowDownloadModal(false);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download statements: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Open download modal
  const openDownloadModal = () => {
    setDownloadOptions({
      dependentId: selectedDependent || '',
      month: month || '',
      year: year || new Date().getFullYear().toString(),
      format: 'csv'
    });
    setShowDownloadModal(true);
  };

  // Close download modal
  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setIsDownloading(false);
  };

  // Handle download option changes
  const handleDownloadOptionChange = (field, value) => {
    setDownloadOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get months array for dropdown
  const getMonthsArray = () => [
    { value: '', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ];

  // Get years array for dropdown
  const getYearsArray = () => {
    const currentYear = new Date().getFullYear();
    return [
      { value: '', label: 'All Years' },
      { value: currentYear.toString(), label: currentYear.toString() },
      { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
      { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() }
    ];
  };

  const filteredData = getFilteredTransactions();

  if (isLoading) {
    return (
      <MainContent>
        <Container>
          <Content>
            <LoadingSpinner>Loading statements...</LoadingSpinner>
          </Content>
        </Container>
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        <Container>
          <Content>
            <ErrorMessage>
              Error loading statements: {error}
              <br />
              <button 
                onClick={() => window.location.reload()} 
                style={{ marginTop: '10px', padding: '8px 16px', background: '#185c37', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Retry
              </button>
            </ErrorMessage>
          </Content>
        </Container>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Container>
        <Content>
          <Title>
            <span>Latest statements</span>
            <DownloadButton 
              onClick={openDownloadModal} 
              disabled={isDownloading}
              title="Download statements"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </DownloadButton>
          </Title>
          <FilterRow>
            <span>Filter by:</span>
            <Select value={selectedDependent} onChange={e => setSelectedDependent(e.target.value)}>
              <option value="">All Dependents</option>
              {dependents.map(dep => (
                <option key={dep.id} value={dep.id}>
                  {dep.name || `${dep.firstName || ''} ${dep.surname || ''}`.trim() || 'Dependent'}
                </option>
              ))}
            </Select>
            <Select value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">All Months</option>
              <option value="0">Jan</option>
              <option value="1">Feb</option>
              <option value="2">Mar</option>
              <option value="3">Apr</option>
              <option value="4">May</option>
              <option value="5">Jun</option>
              <option value="6">Jul</option>
              <option value="7">Aug</option>
              <option value="8">Sep</option>
              <option value="9">Oct</option>
              <option value="10">Nov</option>
              <option value="11">Dec</option>
            </Select>
            <Select value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </Select>
            <SearchInput
              type="text"
              placeholder="Search by name or account"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FilterRow>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Date and time</Th>
                  <Th>Money in/out</Th>
                  <Th>Beneficiary</Th>
                  <Th>Account name</Th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(row => (
                    <tr key={row.id}>
                      <Td>{row.id}</Td>
                      <Td>{row.date}</Td>
                      <Td style={{ color: row.amount.startsWith('+') ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                        {row.amount}
                      </Td>
                      <Td>{row.beneficiary}</Td>
                      <Td>{row.account}</Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      {isLoading ? 'Loading transactions...' : 'No transactions found matching your criteria'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Content>
      </Container>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal onClick={closeDownloadModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Download Statements</h3>
              <CloseButton onClick={closeDownloadModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <ModalField>
              <label>Select Dependent:</label>
              <ModalSelect 
                value={downloadOptions.dependentId} 
                onChange={(e) => handleDownloadOptionChange('dependentId', e.target.value)}
              >
                <option value="">All Dependents</option>
                {dependents.map(dep => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name || `${dep.firstName || ''} ${dep.surname || ''}`.trim() || 'Dependent'}
                  </option>
                ))}
              </ModalSelect>
            </ModalField>

            <ModalField>
              <label>Select Month:</label>
              <ModalSelect 
                value={downloadOptions.month} 
                onChange={(e) => handleDownloadOptionChange('month', e.target.value)}
              >
                {getMonthsArray().map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </ModalSelect>
            </ModalField>

            <ModalField>
              <label>Select Year:</label>
              <ModalSelect 
                value={downloadOptions.year} 
                onChange={(e) => handleDownloadOptionChange('year', e.target.value)}
              >
                {getYearsArray().map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </ModalSelect>
            </ModalField>

            <ModalField>
              <label>File Format:</label>
              <ModalSelect 
                value={downloadOptions.format} 
                onChange={(e) => handleDownloadOptionChange('format', e.target.value)}
              >
                <option value="csv">CSV Format</option>
                <option value="pdf">PDF Format</option>
              </ModalSelect>
            </ModalField>

            <ModalActions>
              <ModalButton type="button" className="secondary" onClick={closeDownloadModal}>
                Cancel
              </ModalButton>
              <ModalButton 
                type="button" 
                className="primary" 
                onClick={() => handleDownload(downloadOptions.format)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div style={{ 
                      width: '14px', 
                      height: '14px', 
                      border: '2px solid transparent', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                    Downloading...
                  </>
                ) : (
                  'Download'
                )}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </DownloadModal>
      )}
    </MainContent>
  );
};

export default CareGiverStatements;