import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState('****4343');

  const accounts = [
    { number: '****4343', balance: 'R 5000' },
    { number: '****7007', balance: 'R 5000' },
    { number: '****3355', balance: 'R 5000' }
  ];

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <button className="back-button" onClick={onClose}>
          <span>←</span>
        </button>

        <div className="beneficiary-section">
          <div className="beneficiary-avatar">
            <img src="/src/assets/avatars/avatar1.png" alt="Beneficiary" />
          </div>
          <h2 className="beneficiary-name">Beneficiary name</h2>
        </div>

        <div className="account-section">
          <div className="from-section">
            <p>From</p>
            <div className="account-select">
              <span>Capitec Account</span>
            </div>
          </div>

          <div className="to-section">
            <p>To</p>
            <div className="account-dropdown">
              <button className="dropdown-button">
                Baby Care Account
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="account-list">
                {accounts.map((account) => (
                  <div
                    key={account.number}
                    className={`account-option ${selectedAccount === account.number ? 'selected' : ''}`}
                    onClick={() => setSelectedAccount(account.number)}
                  >
                    <div className="account-info">
                      <div className="account-icon"><img src="/src/assets/icons/account-icon.png" alt="Account" /></div>
                      <span className="account-number">{account.number}</span>
                    </div>
                    <div className="account-right">
                      <span className="account-balance">{account.balance}</span>
                      <div className={`selection-indicator ${selectedAccount === account.number ? 'checked' : ''}`}>
                        {selectedAccount === account.number && <span className="checkmark">✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button className="pay-button">
          Pay R5000
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;