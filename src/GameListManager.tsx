import React, { useState } from 'react';

interface GameListManagerProps {
  games: string[];
  setGames: (games: string[]) => void;
}

const GameListManager: React.FC<GameListManagerProps> = ({ games, setGames }) => {
  const [newGame, setNewGame] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const addGame = () => {
    if (newGame.trim() && !games.includes(newGame.trim())) {
      setGames([...games, newGame.trim()]);
      setNewGame('');
    }
  };

  const removeGame = (idx: number) => {
    setGames(games.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValue(games[idx]);
  };

  const saveEdit = () => {
    if (editIdx !== null && editValue.trim()) {
      const updated = [...games];
      updated[editIdx] = editValue.trim();
      setGames(updated);
      setEditIdx(null);
      setEditValue('');
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Games</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {games.map((game, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            {editIdx === idx ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  autoFocus
                />
                <button onClick={saveEdit} style={{ marginLeft: 8 }}>Save</button>
                <button onClick={() => setEditIdx(null)} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <span>{game}</span>
                <button onClick={() => startEdit(idx)} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => removeGame(idx)} style={{ marginLeft: 4 }}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input
        value={newGame}
        onChange={e => setNewGame(e.target.value)}
        placeholder="Add new game"
        onKeyDown={e => e.key === 'Enter' && addGame()}
        style={{ marginRight: 8 }}
      />
      <button onClick={addGame}>Add</button>
    </div>
  );
};

export default GameListManager; 