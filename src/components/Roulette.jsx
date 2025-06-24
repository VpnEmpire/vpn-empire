// src/components/Roulette.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import './Roulette.css';

const data = [
  { option: '50', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '100', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '200', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '300', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '400', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '300', style: { backgroundColor: '#292929', textColor: '#ffe600' } },
  { option: '200', style: { backgroundColor: '#1e1e1e', textColor: '#00ffcc' } },
  { option: '100', style: { backgroundColor: '#292929', textColor: '#ffe600' } }
];

const RouletteTab = ({ coins, setCoins }) => {
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
