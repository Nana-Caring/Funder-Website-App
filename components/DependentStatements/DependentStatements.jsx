import React, { useState } from 'react';
import '../Statements/Statements.css';

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

const Money = ({ children }) => <span style={{ fontWeight: 600, color: '#0d9488' }}>{children}</span>;

const DependentStatements = () => {
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('Month');
  const [year, setYear] = useState('Year');

  const filteredData = mockData.filter(row =>
    row.beneficiary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="statements-container">
      <h2>Latest statements</h2>
      <div className="statements-header">
        <div className="filter-section">
          <span>Filter by:</span>
          <select className="filter-dropdown" value={month} onChange={e => setMonth(e.target.value)}>
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
          </select>
          <select className="filter-dropdown" value={year} onChange={e => setYear(e.target.value)}>
            <option>Year</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="statements-table-wrapper">
        <div className="statements-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date and time</th>
                <th>Money in/out</th>
                <th>Beneficiary</th>
                <th>Account name</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.date}</td>
                  <td><Money>{row.amount}</Money></td>
                  <td>{row.beneficiary}</td>
                  <td>{row.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DependentStatements; 