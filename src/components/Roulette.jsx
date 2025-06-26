// src/components/Roulette.jsx
import React, { useRef, useState } from 'react';
import './Roulette.css';

const rewards = [50, 100, 200, 300, 400, 500, 600, 700];

function getRandomRewardIndex() {
  return Math.floor(Math.random() * rewards.length);
}

const Roulette = ({ coins, setCoins }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(() => {
    const lastSpin = localStorage.getItem('lastSpinDate');
    return lastSpin !== new Date().toDateString();
  });
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  const spin = () => {
    if (!canSpin || isSpinning) return;
    setIsSpinning(true);
    const rewardIndex = getRandomRewardIndex();
    const rotation = 360 * 5 + (360 / rewards.length) * rewardIndex;

    wheelRef.current.style.transition = 'transform 5s ease-out';
    wheelRef.current.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      const reward = rewards[rewardIndex];
      setCoins(prev => prev + reward);
      setResult(reward);
      setCanSpin(false);
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      setIsSpinning(false);
    }, 5200);
  };

  return (
    <div className="roulette-container">
      <h2>🎰 Рулетка</h2>
      <div className="wheel-wrapper">
        <div className="wheel" ref={wheelRef}>
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="sector"
              style={{
                transform: `rotate(${index * 45}deg)`,
              }}
            >
              <span>{reward}</span>
            </div>
          ))}
          <div className="center-circle">VPN Empire</div>
        </div>
        <div className="pointer" />
      </div>
      <button className="spin-button" onClick={spin} disabled={!canSpin || isSpinning}>
        {canSpin ? 'Крутить' : 'Завтра снова'}
      </button>
      {result && <div className="spin-result">+{result} монет!</div>}
    </div>
  );
};

export default Roulette;

