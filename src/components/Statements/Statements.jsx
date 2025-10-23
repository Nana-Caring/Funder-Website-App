import React, { useState } from 'react';
import styled from 'styled-components';

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

const Statements = () => {
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Mock data for demonstration
  const mockData = [...Array(20).keys()].map((i) => ({
    id: i + 1,
    date: '25-mar-2025 11:05 AM',
    amount: `R${(i % 2 === 0 ? 500 : 1000).toFixed(2)}`,
    beneficiary: i % 2 === 0 ? 'Son' : 'Daughter',
    account: i % 2 === 0 ? 'Savings Account' : 'Medication Account'
  }));

  // Filter data based on search
  const filteredData = mockData.filter(item => {
    const searchMatch = !search || 
      item.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
      item.account.toLowerCase().includes(search.toLowerCase());
    
    return searchMatch;
  });

  const handleDownload = () => {
    // Placeholder for download functionality
    alert('Download functionality to be implemented');
  };

  return (
    <MainContent>
      <Container>
        <Content>
          <Title>
            <span>Latest statements</span>
            <DownloadButton onClick={handleDownload} title="Download statements">
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
                  <Th>Money out</Th>
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
                      <Td style={{ color: '#ef4444', fontWeight: '600' }}>
                        -{row.amount}
                      </Td>
                      <Td>{row.beneficiary}</Td>
                      <Td>{row.account}</Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      No transactions found matching your criteria
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
