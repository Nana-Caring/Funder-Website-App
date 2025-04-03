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

      <div className="statements-table-wrapper">
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
              {[...Array(20).keys()].map((i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>25-mar-2025 11:05 AM</td>
                  <td>R{(i % 2 === 0 ? 500 : 1000).toFixed(2)}</td>
                  <td>{i % 2 === 0 ? 'Son' : 'Daughter'}</td>
                  <td>{i % 2 === 0 ? 'Savings Account' : 'Medication Account'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statements;
