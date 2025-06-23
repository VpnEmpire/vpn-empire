// src/components/RouletteTab.jsx
import { useState, useEffect, useRef } from 'react';
import './RouletteTab.css';

const RouletteTab = ({ coins, setCoins }) => {
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const winSoundRef = useRef(null);
  const spinSoundRef = useRef(null);

  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    // Звук вращения
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }

    setIsSpinning(true);
    const rewardOptions = [0, 50, 100, 150, 200, 300];
    const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];

    setTimeout(() => {
      const newCoins = coins + reward;
      setCoins(newCoins);
      setSpinResult(reward);
      setCanSpin(false);
      setIsSpinning(false);
      localStorage.setItem('coins', newCoins.toString());
      localStorage.setItem('lastSpinDate', new Date().toDateString());

      // Звук выигрыша
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play();
      }
    }, 3000);
  };

  return (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <p>Крути рулетку и получай случайный приз!</p>

      <div className={`wheel ${isSpinning ? 'spinning' : ''}`}></div>

      <button className="spin-button" onClick={spinWheel} disabled={!canSpin || isSpinning}>
        {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
      </button>

      {spinResult !== null && !isSpinning && (
        <div className="prize-text">
          {spinResult === 0
            ? '😢 Не повезло... Попробуй завтра!'
            : `🎉 Ты выиграл 💰 ${spinResult} монет!`}
        </div>
      )}

      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );
};

export default RouletteTab;

