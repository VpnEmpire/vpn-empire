import React from 'react';
import './Withdraw.css';

const Withdraw = ({ coins }) => {
  return (
    <div className="withdraw-screen">
      <h2>💸 Вывод средств</h2>
      <div className="coin-display">
        <span className="coin-icon">🪙</span>
        <span className="coin-amount">{coins} монет</span>
      </div>
      <button className="withdraw-button" disabled>
        Вывести
      </button>
      <p className="note">Вывод временно недоступен</p>
    </div>
  );
};

export default Withdraw;

