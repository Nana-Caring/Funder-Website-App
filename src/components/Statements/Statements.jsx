import React from 'react';
import './Statements.css';

const Statements = () => {
  return (
    <div className="statements-container">
        <h2>Latest statements</h2>
      <div className="statements-header">
        <div className="filter-section">
          <span>Filter by:</span>
          <select className="filter-dropdown">
            <option value="">Month</option>
            {/* Add month options */}
          </select>
          <select className="filter-dropdown">
            <option value="">Year</option>
            {/* Add year options */}
          </select>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name"
            className="search-input"
          />
        </div>
      </div>

    

      <div className="statements-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date and time</th>
              <th>Money out</th>
              <th>Beneficiary</th>
              <th>Account name</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 1,
                date: '25-mar-2025 11:05 AM',
                amount: 'R500.00',
                beneficiary: 'Son',
                account: 'Savings Account'
              },
              {
                id: 2,
                date: '25-mar-2025 11:05 AM',
                amount: 'R1000.00',
                beneficiary: 'Daughter',
                account: 'Medication Account'
              },
              {
                id: 3,
                date: '25-mar-2025 11:05 AM',
                amount: 'R500.00',
                beneficiary: 'Son',
                account: 'Savings Account'
              },
              {
                id: 4,
                date: '25-mar-2025 11:05 AM',
                amount: 'R1000.00',
                beneficiary: 'Daughter',
                account: 'Medication Account'
              },
              {
                id: 5,
                date: '25-mar-2025 11:05 AM',
                amount: 'R500.00',
                beneficiary: 'Son',
                account: 'Savings Account'
              },
              {
                id: 6,
                date: '25-mar-2025 11:05 AM',
                amount: 'R1000.00',
                beneficiary: 'Daughter',
                account: 'Medication Account'
              },
              {
                id: 7,
                date: '25-mar-2025 11:05 AM',
                amount: 'R500.00',
                beneficiary: 'Son',
                account: 'Savings Account'
              },
              {
                id: 8,
                date: '25-mar-2025 11:05 AM',
                amount: 'R1000.00',
                beneficiary: 'Daughter',
                account: 'Medication Account'
              }
            ].map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.amount}</td>
                <td>{item.beneficiary}</td>
                <td>{item.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statements;