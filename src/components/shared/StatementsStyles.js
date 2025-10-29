import styled from 'styled-components';

// Safe localStorage wrapper
export const safeLocalStorage = {
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

// Shared styled components for statements pages
export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DownloadButton = styled.button`
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

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 13px;
`;

export const SearchInput = styled.input`
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  width: 160px;
`;

export const TableWrapper = styled.div`
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

export const Table = styled.table`
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

export const Th = styled.th`
  background: #f3f7f1;
  color: #222;
  font-weight: 500;
  padding: 8px 6px;
  text-align: left;
`;

export const Td = styled.td`
  padding: 8px 6px;
  border-top: 1px solid #f0f0f0;
  color: #333;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 80px;
  box-sizing: border-box;
`;

export const LoadingSpinner = styled.div`
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

export const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-width: 120px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #185c37;
`;

export const StatusBadge = styled.span`
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

export const RefreshButton = styled.button`
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

// Modal components
export const DownloadModal = styled.div`
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

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
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

export const CloseButton = styled.button`
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

export const ModalField = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
`;

export const ModalSelect = styled.select`
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

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const ModalButton = styled.button`
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

// Helper functions for formatting
export const formatDate = (dateString) => {
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

export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to download');
    return;
  }

  try {
    // Create CSV content with enhanced fields
    const headers = [
      'Date', 'Reference', 'Amount', 'Currency', 'Beneficiary', 'Account Type', 
      'Status', 'Merchant', 'Account Balance', 'Sender Account', 'Recipient Account',
      'Transaction Category', 'Description'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(t => [
        `"${formatDate(t.createdAt || t.timestamp || t.date)}"`,
        `"${t.reference || t.transferReference || t.id || 'N/A'}"`,
        t.amount || '0.00',
        t.currency || 'ZAR',
        `"${t.beneficiaryName || t.beneficiary || t.dependent?.name || t.senderName || t.recipientName || 'Unknown'}"`,
        `"${t.accountType || t.targetAccountType || t.account?.accountType || t.account?.name || 'N/A'}"`,
        t.status || 'completed',
        `"${t.merchantName || 'N/A'}"`,
        t.accountBalance !== undefined ? t.accountBalance.toFixed(2) : 'N/A',
        `"${t.senderAccountNumber || 'N/A'}"`,
        `"${t.recipientAccountNumber || 'N/A'}"`,
        `"${t.transactionCategory || t.category || 'N/A'}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('📥 Downloaded CSV with enhanced transaction data:', filename);
  } catch (err) {
    console.error('❌ Download failed:', err);
    alert('Failed to download. Please try again.');
  }
};