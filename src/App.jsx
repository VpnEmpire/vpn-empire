import { useState } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app">
      {!started ? (
        <div className="start-screen">
          <h1>VPN Empire 🚀</h1>
          <p>Стань агентом свободы интернета и зарабатывай $RICH</p>
          <button onClick={() => setStarted(true)}>Начать</button>
        </div>
      ) : (
        <div className="main-screen">
          <h2>💰 $RICH: 0</h2>
          <p>Кликай, чтобы зарабатывать!</p>
        </div>
      )}
    </div>
  );
}

export default App;
