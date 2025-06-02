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
  height: 100vh;
  background: #f3f7f1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px 0 0 0;
`;

const Content = styled.div`
  width: 90vw;
  max-width: 900px;
  margin: 0 auto;
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
  gap: 16px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 14px;
`;

const SearchInput = styled.input`
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  width: 180px;
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #f3f7f1;
  color: #222;
  font-weight: 500;
  padding: 10px 8px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px 8px;
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
  overflow: hidden;
  width: 100%;
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