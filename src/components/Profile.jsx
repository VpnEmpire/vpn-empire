import React, { useState, useEffect } from 'react';

function Profile({ username, setUsername }) {
  const [tempName, setTempName] = useState(username);

  useEffect(() => {
    setTempName(username);
  }, [username]);

  const handleSave = () => {
    setUsername(tempName.trim() || 'Игрок');
    alert('Имя сохранено!');
  };

  return (
    <div className="main-screen">
      <h2>👤 Профиль</h2>
      <label>
        Введите имя:
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          style={{ padding: '8px', marginTop: '8px', width: '100%', borderRadius: '8px' }}
        />
      </label>
      <button onClick={handleSave} style={{ marginTop: '16px' }}>Сохранить</button>
    </div>
  );
}

export default Profile;
