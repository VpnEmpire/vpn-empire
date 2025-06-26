// src/components/Roulette.jsx
import React, { useRef, useState, useEffect } from 'react';
import './Roulette.css';

const sectors = [50, 100, 200, 300, 400, 500, 600, 700];

const Roulette = ({ setCoins }) => {
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const wheelRef = useRef(null);
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastSpin = localStorage.getItem('lastSpinDate');
    if (lastSpin === today) {
      setCanSpin(false);
    }
  }, []);

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    const resultIndex = Math.floor(Math.random() * sectors.length);
    const angle = 3600 + (360 / sectors.length) * resultIndex;

    setIsSpinning(true);
    if (spinSoundRef.current) spinSoundRef.current.play();

    wheelRef.current.style.transition = 'transform 4s ease-out';
    wheelRef.current.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
      const reward = sectors[resultIndex];
      setCoins(prev => prev + reward);
      setSpinResult(reward);
      setIsSpinning(false);
      setCanSpin(false);
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      if (winSoundRef.current) winSoundRef.current.play();
    }, 4200);
  };

  return (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <div className="wheel-container">
        <div className="wheel" ref={wheelRef}>
          {sectors.map((val, i) => (
            <div
              key={i}
              className="sector"
              style={{ transform: `rotate(${(360 / sectors.length) * i}deg)` }}
            >
              {val}
            </div>
          ))}
          <div className="center-logo">
            <img src="/logo.png" alt="logo" />
          </div>
        </div>
        <div className="pointer">▲</div>
      </div>
      <button className="spin-button" onClick={spinWheel} disabled={!canSpin || isSpinning}>
        {canSpin ? 'Крутить' : 'Завтра снова можно'}
      </button>
      {spinResult && <div className="spin-result">+{spinResult} монет!</div>}
      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );
};

export default Roulette;

