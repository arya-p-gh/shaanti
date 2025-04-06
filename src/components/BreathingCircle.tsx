'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BreathingPattern {
  name: string;
  description: string;
  phases: {
    name: string;
    duration: number;
    scale: number;
  }[];
}

interface BreathingCircleProps {
  duration: number;
  isActive: boolean;
  onComplete: () => void;
  pattern: BreathingPattern;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  duration,
  isActive,
  onComplete,
  pattern,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalCycles, setTotalCycles] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [showMandala, setShowMandala] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate total duration of one cycle
  const cycleDuration = pattern.phases.reduce((total, phase) => total + phase.duration, 0);
  
  // Calculate total session duration
  const totalDuration = cycleDuration * duration;
  
  // Get current phase
  const currentPhase = pattern.phases[currentPhaseIndex];
  
  // Define colors for different phases
  const phaseColors = {
    inhale: 'var(--saffron)',
    hold: 'var(--deep-red)',
    exhale: 'var(--sage-green)',
    pause: 'var(--indigo)',
  };
  
  // Get color for current phase
  const getPhaseColor = () => {
    const phaseName = currentPhase.name.toLowerCase();
    if (phaseName.includes('inhale')) return phaseColors.inhale;
    if (phaseName.includes('hold')) return phaseColors.hold;
    if (phaseName.includes('exhale')) return phaseColors.exhale;
    if (phaseName.includes('pause')) return phaseColors.pause;
    return phaseColors.inhale; // default
  };
  
  // Handle phase transitions
  useEffect(() => {
    if (!isActive || isPaused) return;
    
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Set timer for next phase
    timerRef.current = setTimeout(() => {
      setCurrentPhaseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % pattern.phases.length;
        
        // If we've completed a cycle
        if (nextIndex === 0) {
          setCurrentCycle((prevCycle) => {
            const newCycle = prevCycle + 1;
            
            // If we've completed all cycles
            if (newCycle > duration) {
              setIsPaused(true);
              return prevCycle;
            }
            
            return newCycle;
          });
        }
        
        return nextIndex;
      });
      
      setProgress(0);
    }, currentPhase.duration * 1000);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, currentPhaseIndex, pattern.phases, duration, isPaused]);
  
  // Handle progress updates
  useEffect(() => {
    if (!isActive || isPaused) return;
    
    // Clear any existing progress timer
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    
    // Set interval for progress updates
    progressTimerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / (currentPhase.duration * 10));
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isActive, currentPhaseIndex, currentPhase.duration, isPaused]);
  
  // Handle session completion
  useEffect(() => {
    if (!isActive) return;
    
    // Clear any existing session timer
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    
    // Set timer for session completion
    sessionTimerRef.current = setTimeout(() => {
      onComplete();
    }, totalDuration * 1000);
    
    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
  }, [isActive, totalDuration, onComplete]);
  
  // Reset state when pattern changes
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCurrentCycle(1);
    setIsPaused(false);
  }, [pattern]);
  
  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Show mandala on hover
  const handleMouseEnter = () => {
    setShowMandala(true);
  };
  
  const handleMouseLeave = () => {
    setShowMandala(false);
  };
  
  return (
    <div 
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Lotus petals background */}
      <div className="absolute inset-0 vedic-pattern opacity-10"></div>
      
      {/* Mandala pattern that appears on hover */}
      <AnimatePresence>
        {showMandala && (
          <motion.div 
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: `radial-gradient(circle, transparent 30%, ${getPhaseColor()} 70%)`,
              backgroundSize: '200% 200%',
              animation: 'mandalaSpin 20s linear infinite',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Main breathing circle */}
      <motion.div
        className="relative w-64 h-64 rounded-full vedic-border vedic-glow"
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)`,
        }}
        animate={{
          scale: isActive && !isPaused ? currentPhase.scale : 1,
        }}
        transition={{
          duration: currentPhase.duration,
          ease: "easeInOut",
        }}
      >
        {/* Inner circle with phase color */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getPhaseColor()} 0%, rgba(0,0,0,0.2) 100%)`,
            opacity: 0.7,
          }}
          animate={{
            scale: isActive && !isPaused ? 1 : 0.9,
          }}
          transition={{
            duration: 1,
            repeat: isActive && !isPaused ? Infinity : 0,
            repeatType: "reverse",
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z' fill='${getPhaseColor().replace('#', '%23')}'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
            animation: 'patternFloat 30s linear infinite',
          }}></div>
        </div>
        
        {/* Progress indicator */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke={getPhaseColor()}
            strokeWidth="2"
            strokeDasharray={`${progress * 3.02} 302`}
            initial={{ strokeDasharray: "0 302" }}
            transition={{ duration: 0.1 }}
          />
        </svg>
        
        {/* Phase name and duration */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.h3 
            className="text-xl font-bold mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentPhase.name}
          </motion.h3>
          <motion.p 
            className="text-sm opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {currentPhase.duration}s
          </motion.p>
          
          {/* Cycle counter */}
          <motion.div 
            className="absolute bottom-4 text-xs opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {currentCycle}/{duration}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Pause button */}
      {isActive && (
        <button
          onClick={togglePause}
          className="mt-4 px-4 py-2 rounded-full vedic-button vedic-glow"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      
      {/* CSS for mandala animation */}
      <style jsx>{`
        @keyframes mandalaSpin {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </div>
  );
};

export default BreathingCircle; 