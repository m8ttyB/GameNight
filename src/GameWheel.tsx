import React, { useRef, useState } from 'react';

interface GameWheelProps {
  games: string[];
  onSpin: (selected: string) => void;
  spinning: boolean;
  setSpinning: (s: boolean) => void;
}

const WHEEL_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FF6384', '#36A2EB', '#FFCE56'
];

const GameWheel: React.FC<GameWheelProps> = ({ games, onSpin, spinning, setSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [lastFinalAngle, setLastFinalAngle] = useState<number>(0);

  // Draw the wheel
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    const numGames = games.length;
    const angle = (2 * Math.PI) / numGames;
    for (let i = 0; i < numGames; i++) {
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.arc(
        size / 2,
        size / 2,
        size / 2 - 10,
        i * angle,
        (i + 1) * angle
      );
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(i * angle + angle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#222';
      ctx.font = '18px sans-serif';
      ctx.fillText(games[i], size / 2 - 30, 10);
      ctx.restore();
    }
  }, [games]);

  // Spin logic
  const spinWheel = () => {
    if (spinning || games.length === 0) return;
    // Reset wheel to 0deg before starting a new spin
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
    setTimeout(() => {
      setSpinning(true);
      const numGames = games.length;
      const idx = Math.floor(Math.random() * numGames);
      setSelectedIdx(idx);
      const anglePerGame = 360 / numGames;
      const extraSpins = 10; // for visual effect
      // Calculate final angle so that the center of the winning segment is at the bottom (270°)
      const finalAngle = 360 * extraSpins + 270 - (idx * anglePerGame + anglePerGame / 2);
      setLastFinalAngle(finalAngle);
      if (wheelRef.current) {
        // Allow a reflow for the transition to take effect
        void wheelRef.current.offsetWidth;
        wheelRef.current.style.transition = 'transform 10s cubic-bezier(0.33, 1, 0.68, 1)';
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
      }
      setTimeout(() => {
        setSpinning(false);
        onSpin(games[idx]);
        // Do NOT reset the wheel here; keep it at the final position until next spin
      }, 10000);
    }, 20); // short delay to ensure reset before spin
  };

  // Fixed pointer style at the bottom of the wheel
  const pointerBaseStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: 40, // 40px up from the bottom edge, inside the wheel
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '16px solid transparent',
    borderRight: '16px solid transparent',
    borderTop: '36px solid #e74c3c', // arrow points up
    zIndex: 2,
    pointerEvents: 'none',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          ref={wheelRef}
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '6px solid #333',
            boxShadow: '0 0 10px #888',
            position: 'relative',
            margin: '0 auto',
            transition: 'transform 0s',
          }}
        >
          <canvas ref={canvasRef} width={400} height={400} style={{ borderRadius: '50%' }} />
        </div>
        {/* Fixed Bottom Pointer */}
        <div style={pointerBaseStyle} />
      </div>
      <br />
      <button onClick={spinWheel} disabled={spinning || games.length === 0} style={{ marginTop: 20, fontSize: 20, padding: '10px 30px' }}>
        {spinning ? 'Spinning...' : 'Spin Wheel'}
      </button>
    </div>
  );
};

export default GameWheel; 