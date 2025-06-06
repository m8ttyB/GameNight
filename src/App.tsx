import React, { useState, useEffect } from 'react';
import './App.css';
import GameWheel from './GameWheel';
import GameListManager from './GameListManager';

// Removed placeholder components for GameWheel and GameListManager

function App() {
  const [games, setGames] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // Load games from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gameWheelGames');
    if (saved) setGames(JSON.parse(saved));
  }, []);

  // Save games to localStorage when changed
  useEffect(() => {
    localStorage.setItem('gameWheelGames', JSON.stringify(games));
  }, [games]);

  const handleSpin = (selected: string) => {
    setSelectedGame(selected);
  };

  return (
    <div className="App">
      <h1>Game Night Wheel</h1>
      <button
        onClick={() => setShowPanel((v) => !v)}
        style={{
          position: 'fixed',
          top: 30,
          right: 30,
          zIndex: 1001,
          fontSize: 18,
          padding: '10px 20px',
        }}
      >
        {showPanel ? 'Close Game List' : 'Open Game List'}
      </button>
      {showPanel && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 30,
            width: 340,
            maxHeight: '80vh',
            overflowY: 'auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            zIndex: 1000,
            padding: '2rem 1.5rem 1.5rem 1.5rem',
            transition: 'box-shadow 0.2s',
          }}
        >
          <GameListManager games={games} setGames={setGames} />
        </div>
      )}
      <GameWheel games={games} onSpin={handleSpin} spinning={spinning} setSpinning={setSpinning} />
      {selectedGame && <h2>Selected Game: {selectedGame}</h2>}
    </div>
  );
}

export default App;
