// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // 

function Profile({ username, setUsername }) {
  const [tempName, setTempName] = useState(username);
  const [userId, setUserId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTempName(username);
  }, [username]);

  useEffect(() => {
    const tgUserId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (tgUserId) {
      setUserId(tgUserId);
    }
  }, []);

  const handleSave = () => {
    const newName = tempName.trim();
    setUsername(newName || 'Игрок');
    alert('Имя сохранено!');
  };

  const handleCopy = () => {
    const referralLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="main-screen" style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '16px' }}>👤 Профиль</h2>

      <label style={{ fontWeight: 'bold' }}>
        Введите имя:
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          style={{
            padding: '10px',
            marginTop: '8px',
            width: '100%',
            maxWidth: '300px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
      </label>

      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Сохранить
      </button>

      {userId && (
        <>
          <div style={{ marginTop: '30px' }}>
            <p><strong>Ваш Telegram ID:</strong> {userId}</p>
            <p><strong>Ваша реферальная ссылка:</strong></p>
            <div className="referral-box">
              <code>{`https://t.me/OrdoHereticus_bot?start=${userId}`}</code>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '✅ Скопировано!' : '📋 Скопировать'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;

