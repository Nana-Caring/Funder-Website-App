import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 24px;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto; /* Center the content */
  padding: 0 12px;
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
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
`;

const CareGiverStatements = () => {
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('Month');
  const [year, setYear] = useState('Year');

  const filteredData = mockData.filter(row =>
    row.beneficiary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainContent>
      <Container>
        <Content>
          <Title>Latest statements</Title>
          <FilterRow>
            <span>Filter by:</span>
            <Select value={month} onChange={e => setMonth(e.target.value)}>
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </Select>
            <Select value={year} onChange={e => setYear(e.target.value)}>
              <option>Year</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </Select>
            <SearchInput
              type="text"
              placeholder="Search by name"
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
                {filteredData.map(row => (
                  <tr key={row.id}>
                    <Td>{row.id}</Td>
                    <Td>{row.date}</Td>
                    <Td>{row.amount}</Td>
                    <Td>{row.beneficiary}</Td>
                    <Td>{row.account}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Content>
      </Container>
    </MainContent>
  );
};

export default CareGiverStatements;