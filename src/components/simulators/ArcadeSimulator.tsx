import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem } from '../../types';

interface Props {
  app: AppItem;
  onTxSuccess?: (txHash: string) => void;
}

export function ArcadeSimulator({ app, onTxSuccess }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1420);
  const [isJumping, setIsJumping] = useState(false);
  const [playerY, setPlayerY] = useState(0); // 0 is ground
  const [obstacleX, setObstacleX] = useState(300);
  const [submittedTx, setSubmittedTx] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const requestRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);

  // Jump handler
  const handleJump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    if (playerY === 0) {
      velocityRef.current = 14;
      setIsJumping(true);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setPlayerY(0);
    setObstacleX(320);
    setSubmittedTx(null);
    velocityRef.current = 0;
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameInterval = setInterval(() => {
      // Move obstacle
      setObstacleX((prev) => {
        if (prev <= -20) {
          setScore((s) => s + 50);
          return 340 + Math.random() * 80;
        }
        return prev - 6;
      });

      // Physics (jump)
      setPlayerY((currY) => {
        let newY = currY + velocityRef.current;
        if (newY <= 0) {
          velocityRef.current = 0;
          setIsJumping(false);
          return 0;
        }
        velocityRef.current -= 1.2; // gravity
        return newY;
      });
    }, 25);

    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver]);

  // Collision detection
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    // Obstacle is around X = 40px to 80px where player is
    if (obstacleX > 30 && obstacleX < 75 && playerY < 25) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    }
  }, [obstacleX, playerY, isPlaying, gameOver, score, highScore]);

  // Submit high score to Base L2
  const submitScoreOnchain = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const mockTx = '0x' + Math.random().toString(16).slice(2) + 'd8c9';
      setSubmittedTx(mockTx);
      setIsSubmitting(false);
      if (onTxSuccess) onTxSuccess(mockTx);
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      {/* Top Game Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-purple-500/30 text-xs font-mono">
        <div className="flex items-center space-x-1 text-purple-300">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>SCORE: <strong className="text-white text-sm">{score}</strong></span>
        </div>
        <div className="flex items-center space-x-1 text-cyan-300">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>BEST: <strong className="text-white">{highScore}</strong></span>
        </div>
      </div>

      {/* Cyber Canvas Area */}
      <div 
        onClick={handleJump}
        className="relative w-full h-56 bg-[#090d1f] overflow-hidden border border-purple-500/30 cursor-pointer flex flex-col justify-end"
        style={{
          backgroundImage: 'radial-gradient(ellipse at bottom, rgba(168,85,247,0.2) 0%, rgba(7,9,19,0.95) 75%)',
        }}
      >
        {/* Neon Cityscape / Grid Horizon */}
        <div className="absolute inset-0 opacity-20 pointer-events-none cyber-grid" />
        
        {/* Flash Scanline */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse" />

        {/* Player (Cyber Runner) */}
        <div 
          className="absolute left-8 w-10 h-10 transition-transform duration-75 flex items-center justify-center"
          style={{
            bottom: `${20 + playerY}px`,
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.8)] border border-white/40">
            <span className="text-lg">🤖</span>
          </div>
          {/* Neon Thruster trails */}
          {playerY > 5 && (
            <div className="absolute -bottom-3 left-2 right-2 h-3 bg-gradient-to-b from-cyan-400 to-transparent blur-[2px]" />
          )}
        </div>

        {/* Moving Neon Obstacle */}
        {isPlaying && (
          <div 
            className="absolute bottom-5 w-7 h-10 rounded-t-lg bg-gradient-to-t from-red-600 to-orange-400 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-t border-l border-r border-orange-300 flex items-center justify-center text-xs"
            style={{
              left: `${obstacleX}px`,
            }}
          >
            <span className="text-xs">⚡</span>
          </div>
        )}

        {/* Floor Neon Bar */}
        <div className="w-full h-5 bg-slate-950 border-t-2 border-purple-500 shadow-[0_-4px_15px_rgba(168,85,247,0.5)] flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 animate-pulse" />
        </div>

        {/* Start / Game Over Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 mb-2 font-display">
              {app.name.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-300 mb-4 max-w-xs">
              Tap screen or click button to jump over cyber hazards. Earn {app.token?.symbol || '$DASH'} tokens!
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center space-x-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START PLAYING</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 mb-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              💥
            </div>
            <h3 className="text-base font-bold text-red-400 font-display mb-1">CIRCUIT BREACH!</h3>
            <p className="text-xs text-slate-300 mb-2 font-mono">Final Score: <strong className="text-white text-sm">{score}</strong></p>

            <div className="flex items-center space-x-2 mt-2">
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); submitScoreOnchain(); }}
                disabled={isSubmitting || !!submittedTx}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Recording...' : submittedTx ? 'Recorded on Base!' : 'Record on Base L2'}</span>
              </button>
            </div>

            {submittedTx && (
              <div className="mt-2 text-[10px] text-green-400 font-mono flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span>Tx: {submittedTx.slice(0, 10)}... (Base Leaderboard)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Touch Jump Button for Mobile */}
      <div className="w-full p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
        <button 
          onClick={handleJump}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
        >
          TAP TO JUMP 🚀
        </button>
      </div>
    </div>
  );
}
