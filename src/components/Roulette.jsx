import { useState, useEffect, useRef } from 'react';

const Roulette = ({ coins, setCoins }) => {
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const winSoundRef = useRef(null);

  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  const spinWheel = () => {
    if (!canSpin) return;
    setIsSpinning(true);
    const rewardOptions = [20, 50, 100, 200, 300, 400];
    const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];

    setTimeout(() => {
      const newCoins = coins + reward;
      setCoins(newCoins);
      setSpinResult(reward);
      setCanSpin(false);
      setIsSpinning(false);
      localStorage.setItem('coins', newCoins.toString());
      localStorage.setItem('lastSpinDate', new Date().toDateString());

      // 🎵 Проиграть звук выигрыша
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play();
      }
    }, 2000);
  };

  return (
    <div className="roulette">
      <h2>🎰 Рулетка</h2>

      <img
        src="/roulette.gif"
        alt="Рулетка"
        className="roulette-image"
        style={{ width: '200px', marginBottom: '20px' }}
      />

      <button className="spin-button" onClick={spinWheel} disabled={!canSpin || isSpinning}>
        {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
      </button>

      {spinResult !== null && !isSpinning && (
        <div className="spin-result">+{spinResult} монет!</div>
      )}

      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );
};

export default Roulette;
