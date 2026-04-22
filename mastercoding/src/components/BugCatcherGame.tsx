import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Play, Trophy, Timer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BugProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

export function BugCatcherGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bugs, setBugs] = useState<BugProps[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnerRef = useRef<NodeJS.Timeout | null>(null);
  const moverRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
  };

  const spawnBug = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Spawn within safe bounds
    const safeMargin = 40;
    const newBug: BugProps = {
      id: Math.random().toString(36).substr(2, 9),
      x: safeMargin + Math.random() * (clientWidth - safeMargin * 2),
      y: safeMargin + Math.random() * (clientHeight - safeMargin * 2),
      rotation: Math.random() * 360
    };
    
    setBugs(prev => {
      // Keep max 8 bugs on screen
      if (prev.length >= 8) return prev;
      return [...prev, newBug];
    });
  }, []);

  const moveBugs = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const safeMargin = 40;
    
    setBugs(prev => prev.map(bug => {
      // Random walk
      let newX = bug.x + (Math.random() * 100 - 50);
      let newY = bug.y + (Math.random() * 100 - 50);
      
      // Clamp to bounds
      newX = Math.max(safeMargin, Math.min(newX, clientWidth - safeMargin));
      newY = Math.max(safeMargin, Math.min(newY, clientHeight - safeMargin));
      
      return { ...bug, x: newX, y: newY, rotation: bug.rotation + (Math.random() * 90 - 45) };
    }));
  }, []);

  const catchBug = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying) return;
    
    setScore(s => s + 1);
    setBugs(prev => prev.filter(b => b.id !== id));
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsPlaying(false);
            setIsGameOver(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      
      spawnerRef.current = setInterval(spawnBug, 800);
      moverRef.current = setInterval(moveBugs, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
      if (moverRef.current) clearInterval(moverRef.current);
    };
  }, [isPlaying, spawnBug, moveBugs]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl shadow-primary/5">
      {/* Game Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-primary" />
          <h3 className="font-mono text-sm font-semibold tracking-wider text-foreground">DEBUG_MODE.exe</h3>
        </div>
        
        <div className="flex gap-6 font-mono text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span className={timeLeft <= 10 && isPlaying ? "text-destructive font-bold animate-pulse" : "text-foreground"}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="w-4 h-4" />
            <span className="text-primary font-bold text-base">{score}</span>
          </div>
        </div>
      </div>

      {/* Game Arena */}
      <div 
        ref={containerRef}
        className="relative h-[400px] w-full bg-[#0a0a0a] cursor-crosshair overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(22, 163, 74, 0.05) 0%, transparent 50%)',
          backgroundSize: '100% 100%'
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <AnimatePresence>
          {isPlaying && bugs.map(bug => (
            <motion.div
              key={bug.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                x: bug.x - 20, 
                y: bug.y - 20, 
                rotate: bug.rotation,
                scale: 1, 
                opacity: 1 
              }}
              exit={{ scale: 0, opacity: 0, filter: "brightness(2) drop-shadow(0 0 10px rgba(22,163,74,1))" }}
              transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
              className="absolute w-10 h-10 flex items-center justify-center text-primary hover:text-green-300 transition-colors z-10"
              onMouseDown={(e) => catchBug(bug.id, e)}
            >
              <Bug size={32} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Start / Game Over Overlay */}
        <AnimatePresence>
          {(!isPlaying) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h2 className="text-4xl font-bold font-mono text-foreground mb-2">SESSION ENDED</h2>
                    <p className="text-muted-foreground font-mono">Bugs eliminated: <span className="text-primary font-bold text-2xl ml-2">{score}</span></p>
                  </motion.div>
                  <Button onClick={startGame} size="lg" className="font-mono mt-4 gap-2">
                    <RotateCcw className="w-4 h-4" /> PLAY AGAIN
                  </Button>
                </div>
              ) : (
                <div className="text-center max-w-md px-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bug className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Sharpen your JS reflexes</h2>
                  <p className="text-muted-foreground mb-8">
                    Coding requires sharp eyes and fast fingers. How many bugs can you squash in 30 seconds?
                  </p>
                  <Button onClick={startGame} size="lg" className="font-mono text-lg px-8 gap-2 group">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" /> INITIALIZE
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
