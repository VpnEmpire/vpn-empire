// src/components/roulette.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Roulette.css';

const sectors = [50, 100, 200, 300, 400, 500, 600, 700];
const Roulette = ({ setCoins }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinResult, setSpinResult] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastSpin = localStorage.getItem('lastSpinDate');
    if (lastSpin === today) {
      setCanSpin(false);
    }
  }, []);

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;

    const resultIndex = Math.floor(Math.random() * sectors.length);
    const reward = sectors[resultIndex];
    const angle = 3600 + (360 / sectors.length) * resultIndex;

    setIsSpinning(true);
    if (spinSoundRef.current) spinSoundRef.current.play();

    setSpinAngle(angle);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(reward);
      setCoins(prev => prev + reward);
      setCanSpin(false);
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      if (winSoundRef.current) winSoundRef.current.play();
    }, 4500);
  };

    return (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <div className="roulette-container">
        <img
          src="/wheel.png"
          alt="Рулетка"
          className={`wheel ${isSpinning ? 'spinning' : ''}`}
          onClick={handleSpin}
          style={{ transform: `rotate(${spinAngle}deg)` }}
        />
      </div>

      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={!canSpin || isSpinning}
      >
        {canSpin ? 'Крутить' : 'Завтра снова можно'}
      </button>

      {spinResult && (
        <div className="spin-result">+{spinResult} монет!</div>
      )}

      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );
};

export default Roulette;

