import React, { useState, useEffect } from 'react';
import './Roulette.css';

const prizes = [50, 100, 200, 300, 400, 500, 600, 700];

const getRandomPrize = () => {
  const randomIndex = Math.floor(Math.random() * prizes.length);
  return prizes[randomIndex];
};

function Roulette({ coins, setCoins }) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [lastSpinDate, setLastSpinDate] = useState(localStorage.getItem('lastSpinDate'));

  const canSpin = () => {
    const today = new Date().toLocaleDateString();
    return lastSpinDate !== today;
  };

  const spin = () => {
    if (spinning || !canSpin()) return;

    setSpinning(true);
    const audio = new Audio('/spin-sound.mp3');
    audio.play();

    setTimeout(() => {
      const result = getRandomPrize();
      setPrize(result);
      setCoins(prev => prev + result);
      localStorage.setItem('lastSpinDate', new Date().toLocaleDateString());
      setLastSpinDate(new Date().toLocaleDateString());
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="roulette-container">
      <h2>🎰 Рулетка</h2>
      <div className="wheel" onClick={spin}>
        <img src="/roulette.gif" alt="Крутить" className={spinning ? 'spinning' : ''} />
        <div className="logo-center">VPN Empire</div>
      </div>
      {prize && <p className="result">Вы выиграли: 🪙 {prize} монет</p>}
      {!canSpin() && <p className="cooldown">Вы уже крутили сегодня. Попробуйте завтра!</p>}
    </div>
  );
}

export default Roulette;
