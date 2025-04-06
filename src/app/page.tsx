'use client';

import React, { useState, useEffect, useRef } from 'react';
import BreathingCircle from '@/components/BreathingCircle';
import { PlayIcon, PauseIcon, Cog6ToothIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { breathingPatterns } from '@/data/breathingPatterns';
import { soundOptions, type SoundOption } from '@/data/sounds';
import type { BreathingPattern } from '@/components/BreathingCircle';
import { motion } from 'framer-motion';

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5); // 5 cycles
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState<SoundOption>(soundOptions[0]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playSound = (sound: SoundOption) => {
    if (!audioContextRef.current || !soundEnabled) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, audioContextRef.current.currentTime);

    // Create an envelope for the sound
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + sound.duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + sound.duration);
  };

  // Save preferences to localStorage
  useEffect(() => {
    const savedDuration = localStorage.getItem('duration');
    const savedPatternIndex = localStorage.getItem('patternIndex');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedSoundId = localStorage.getItem('soundId');
    const savedTheme = localStorage.getItem('theme');

    if (savedDuration) setDuration(parseInt(savedDuration, 10));
    if (savedPatternIndex) setSelectedPattern(breathingPatterns[parseInt(savedPatternIndex, 10)]);
    if (savedSoundEnabled) setSoundEnabled(savedSoundEnabled === 'true');
    if (savedSoundId) {
      const sound = soundOptions.find(s => s.id === savedSoundId);
      if (sound) setSelectedSound(sound);
    }
    if (savedTheme) setTheme(savedTheme as 'dark' | 'light');
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('duration', duration.toString());
    localStorage.setItem('patternIndex', breathingPatterns.indexOf(selectedPattern).toString());
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    localStorage.setItem('soundId', selectedSound.id);
    localStorage.setItem('theme', theme);
  }, [duration, selectedPattern, soundEnabled, selectedSound, theme]);

  const handleComplete = () => {
    setIsActive(false);
    playSound(selectedSound);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSoundChange = (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId);
    if (sound) {
      setSelectedSound(sound);
      playSound(sound); // Play a preview of the selected sound
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 vedic-pattern ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-amber-50 to-white text-gray-800'
    }`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-deep-red to-sage-green opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sage-green via-deep-red to-saffron opacity-70"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-saffron opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-deep-red opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 rounded-full bg-sage-green opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={toggleSound}
          className="p-2 rounded-full vedic-button vedic-glow"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <SpeakerWaveIcon className="w-6 h-6" />
          ) : (
            <SpeakerXMarkIcon className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full vedic-button vedic-glow"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full vedic-button vedic-glow"
          aria-label="Settings"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mb-8 vedic-glow">
        <h1 className="text-6xl font-bold mb-2 vedic-hindi">
          <span className="text-deep-red">शांति</span>
        </h1>
        <div className="vedic-divider w-32 mx-auto mb-2"></div>
      </div>
      <p className="text-sm opacity-70 mb-8 max-w-md text-center">{selectedPattern.description}</p>

      <div className="mb-8 vedic-glow">
        <BreathingCircle
          duration={duration}
          isActive={isActive}
          onComplete={handleComplete}
          pattern={selectedPattern}
        />
      </div>

      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={() => setIsActive(!isActive)}
          className="vedic-button vedic-glow flex items-center justify-center w-16 h-16"
          aria-label={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8" />
          )}
        </button>
      </div>

      {showSettings && (
        <div className="w-full max-w-md p-6 rounded-lg vedic-settings">
          <h2 className="text-xl font-serif font-semibold mb-4 vedic-title">Settings</h2>
          
          <div className="vedic-divider mb-4"></div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Breathing Pattern</label>
            <select 
              className="w-full p-2 rounded vedic-select"
              value={breathingPatterns.indexOf(selectedPattern)}
              onChange={(e) => setSelectedPattern(breathingPatterns[parseInt(e.target.value, 10)])}
            >
              {breathingPatterns.map((pattern, index) => (
                <option key={index} value={index}>{pattern.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Duration: {duration} cycles</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full vedic-slider"
            />
          </div>

          <div className="vedic-divider mb-4"></div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Sound Effect</label>
            <select 
              className="w-full p-2 rounded vedic-select mb-2"
              value={selectedSound.id}
              onChange={(e) => handleSoundChange(e.target.value)}
            >
              {soundOptions.map((sound) => (
                <option key={sound.id} value={sound.id}>{sound.name}</option>
              ))}
            </select>
            <p className="text-xs opacity-70">{selectedSound.description}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm mb-2">Sound</label>
              <button
                onClick={toggleSound}
                className="vedic-button vedic-glow p-2 rounded-full"
              >
                {soundEnabled ? (
                  <SpeakerWaveIcon className="w-6 h-6" />
                ) : (
                  <SpeakerXMarkIcon className="w-6 h-6" />
                )}
              </button>
            </div>
            <div>
              <label className="block text-sm mb-2">Theme</label>
              <button
                onClick={toggleTheme}
                className="vedic-button vedic-glow p-2 rounded-full"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Golden lotus button */}
      <div className="fixed bottom-4 right-4 z-10">
        <motion.div
          className="flex items-center space-x-2 px-3 py-2 rounded-full vedic-button vedic-glow"
          style={{
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--turmeric) 100%)',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 rounded-full" style={{
              background: 'radial-gradient(circle, var(--gold) 0%, var(--turmeric) 100%)',
            }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full" style={{
                background: 'radial-gradient(circle, var(--deep-red) 0%, var(--saffron) 100%)',
              }}></div>
            </div>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,0 L14,9 L23,12 L14,15 L12,24 L10,15 L1,12 L10,9 Z' fill='%23FFD700'/%3E%3C/svg%3E")`,
              backgroundSize: '12px 12px',
              animation: 'patternFloat 20s linear infinite',
            }}></div>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--deep-red)' }}>
            Made for eheladi
          </span>
        </motion.div>
      </div>
    </main>
  );
} 