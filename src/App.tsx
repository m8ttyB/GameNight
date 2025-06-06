import React, { useState, useEffect } from 'react';
import './App.css';
import GameWheel from './GameWheel';
import GameListManager from './GameListManager';

// Removed placeholder components for GameWheel and GameListManager

function App() {
  const [games, setGames] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

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
      <GameListManager games={games} setGames={setGames} />
      <GameWheel games={games} onSpin={handleSpin} spinning={spinning} setSpinning={setSpinning} />
      {selectedGame && <h2>Selected Game: {selectedGame}</h2>}
    </div>
  );
}

export default App;
