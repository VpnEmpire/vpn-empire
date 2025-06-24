import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import from './Roulette.css';

const data = [
  { option: '50', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '100', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '200', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '300', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '400', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '500', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '300', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '100', style: { backgroundColor: '#292929', textColor: '#ffe600' } }
];

const Roulette = ({ coins, setCoins }) => {
  const [canSpin, setCanSpin] = useState(true);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState(null);
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  const handleSpinClick = () => {
    if (!canSpin || mustSpin) return;

    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const onStopSpinning = () => {
    const rewardValue = parseInt(data[prizeNumber].option);
    setReward(rewardValue);
    setMustSpin(false);
    setCoins(prev => prev + rewardValue);
    setCanSpin(false);
    localStorage.setItem('lastSpinDate', new Date().toDateString());

    if (winSoundRef.current) {
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play();
    }
  };

  return (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <p>Крути рулетку и получай случайный приз!</p>

      <div className="wheel-wrapper">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor={'#ffd700'}
          outerBorderWidth={8}
          innerRadius={20}
          radiusLineColor={'#444'}
          radiusLineWidth={2}
          textDistance={60}
          fontSize={18}
          onStopSpinning={onStopSpinning}
        />
      </div>

      <button className="spin-button" onClick={handleSpinClick} disabled={!canSpin || mustSpin}>
        {mustSpin ? 'Крутится...' : 'Крутить рулетку'}
      </button>

      {reward !== null && !mustSpin && (
        <div className="prize-text">
          {reward === 0
            ? '😢 Не повезло... Попробуй завтра!'
            : `🎉 Ты выиграл 💰 ${reward} монет!`}
        </div>
      )}

      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );
};

export default Roulette;
