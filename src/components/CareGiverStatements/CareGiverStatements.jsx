import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCaregiverTransactions, 
  fetchDependents,
  fetchTransactionAnalytics 
} from '../../store/slices/beneficiaries';
import { caregiverService } from '../../services/caregiverService';
import {
  Container,
  Content, 
  Title,
  DownloadButton,
  FilterRow,
  Select,
  SearchInput,
  TableWrapper,
  Table,
  Th,
  Td,
  MainContent,
  LoadingSpinner,
  ErrorMessage,
  DownloadModal,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalField,
  ModalSelect,
  ModalActions,
  ModalButton,
  formatDate,
  downloadCSV
} from '../shared/StatementsStyles';

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

  // Process transactions for display - supports both old and new API response formats
  const processTransactions = () => {
    // Handle new API response structure: { success: true, data: { dependent, transactions, summary, pagination } }
    let transactionList = [];
    
    if (transactions?.all && Array.isArray(transactions.all)) {
      // Old format - transactions are in transactions.all
      transactionList = transactions.all;
    } else if (transactions?.data?.transactions && Array.isArray(transactions.data.transactions)) {
      // New format - transactions are in transactions.data.transactions
      transactionList = transactions.data.transactions;
    } else if (Array.isArray(transactions)) {
      // Direct array format
      transactionList = transactions;
    }

    if (!transactionList.length) {
      return [];
    }

    return transactionList.map((tx, index) => {
      // Handle both old and new transaction structure
      const dependent = dependents.find(dep => 
        dep.id === tx.userId || 
        dep.userId === tx.userId ||
        dep.id === tx.dependentId ||
        (tx.dependent && dep.id === tx.dependent.id)
      );
      
      const txDate = new Date(tx.timestamp || tx.createdAt || tx.date);
      
      // Handle new transaction fields
      const senderName = tx.senderName || 
                        (tx.type === 'Debit' ? (user?.name || 'You') : '') ||
                        'Unknown Sender';

      const beneficiaryName = tx.dependent?.name || 
                             tx.recipientName ||
                             dependent?.name || 
                             `${dependent?.firstName || ''} ${dependent?.surname || ''}`.trim() ||
                             'Unknown Beneficiary';
      
      const accountName = tx.account?.accountType || 
                         tx.account?.name ||
                         tx.transactionCategory || 
                         tx.category || 
                         tx.description || 
                         'General Account';
      
      const reference = tx.reference || tx.transferReference || tx.id || `TXN-${index + 1}`;
      
      return {
        id: tx.id || index + 1,
        reference: reference,
        date: formatDate(txDate),
        amount: tx.type === 'Credit' ? `+R${Math.abs(tx.amount || 0).toFixed(2)}` : `-R${Math.abs(tx.amount || 0).toFixed(2)}`,
        sender: senderName,
        beneficiary: beneficiaryName,
        account: accountName,
        merchantName: tx.merchantName || tx.recipientName || '',
        status: tx.status || 'completed',
        currency: tx.currency || 'ZAR',
        rawDate: txDate,
        dependentId: tx.userId || tx.dependentId || tx.dependent?.id,
        // Additional fields from new structure
        accountBalance: tx.account?.balance,
        senderAccountNumber: tx.senderAccountNumber,
        recipientAccountNumber: tx.recipientAccountNumber,
        transactionCategory: tx.transactionCategory
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
        tx.sender.toLowerCase().includes(search.toLowerCase()) ||
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
              placeholder="Search by sender, beneficiary, or account"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FilterRow>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Date and time</Th>
                  <Th>Money in/out</Th>
                  <Th>Sender</Th>
                  <Th>Beneficiary</Th>
                  <Th>Account name</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(row => (
                    <tr key={row.id}>
                      <Td>{row.reference}</Td>
                      <Td>{row.date}</Td>
                      <Td style={{ color: row.amount.startsWith('+') ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                        {row.amount}
                        {row.currency && row.currency !== 'ZAR' && (
                          <div style={{ fontSize: '0.8em', color: '#666' }}>{row.currency}</div>
                        )}
                      </Td>
                      <Td>
                        {row.sender}
                        {row.senderAccountNumber && (
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            A/C: {row.senderAccountNumber}
                          </div>
                        )}
                      </Td>
                      <Td>
                        {row.beneficiary}
                        {row.merchantName && row.merchantName !== row.beneficiary && (
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            via {row.merchantName}
                          </div>
                        )}
                        {row.recipientAccountNumber && (
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            A/C: {row.recipientAccountNumber}
                          </div>
                        )}
                      </Td>
                      <Td>
                        {row.account}
                        {row.accountBalance !== undefined && (
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            Balance: R{row.accountBalance.toFixed(2)}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <span 
                          style={{ 
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8em',
                            fontWeight: '500',
                            backgroundColor: row.status === 'completed' ? '#dcfce7' : 
                                           row.status === 'pending' ? '#fef3c7' :
                                           row.status === 'failed' ? '#fecaca' : '#f3f4f6',
                            color: row.status === 'completed' ? '#16a34a' : 
                                   row.status === 'pending' ? '#d97706' :
                                   row.status === 'failed' ? '#dc2626' : '#374151'
                          }}
                        >
                          {row.status || 'completed'}
                        </span>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
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