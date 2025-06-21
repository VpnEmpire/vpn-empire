import React, { useState, useEffect } from 'react';
import '../App.css'; // если нужно, можно заменить на отдельный профиль-стиль

function Profile({ username, setUsername }) {
  const [tempName, setTempName] = useState(username);

  useEffect(() => {
    setTempName(username);
  }, [username]);

  const handleSave = () => {
    const newName = tempName.trim();
    setUsername(newName || 'Игрок');
    alert('Имя сохранено!');
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
    </div>
  );
}

export default Profile;
