import { useState, useEffect } from 'react';

const Roulette = ({ coins, setCoins }) => {
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

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
    }, 2000);
  };

  return (
    <div className="roulette">
      <h2>🎰 Рулетка</h2>
      <img
        src="/roulette.gif"
        alt="Рулетка"
        style={{ width: '200px', marginBottom: '20px' }}
      />
      <button className="spin-button" onClick={spinWheel} disabled={!canSpin || isSpinning}>
        {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
      </button>
      {spinResult !== null && !isSpinning && (
        <div className="spin-result">+{spinResult} монет!</div>
      )}
    </div>
  );
};

export default Roulette;

