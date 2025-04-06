export interface SoundOption {
  id: string;
  name: string;
  description: string;
  frequency: number;
  duration: number;
  type: 'sine' | 'triangle' | 'square' | 'sawtooth';
}

export const soundOptions: SoundOption[] = [
  {
    id: 'bell',
    name: 'Gentle Bell',
    description: 'A soft, calming bell sound',
    frequency: 880,
    duration: 1.5,
    type: 'sine'
  },
  {
    id: 'chime',
    name: 'Wind Chime',
    description: 'Peaceful wind chime sound',
    frequency: 440,
    duration: 2,
    type: 'triangle'
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Calming nature sounds',
    frequency: 220,
    duration: 3,
    type: 'sine'
  },
  {
    id: 'crystal',
    name: 'Crystal Bowl',
    description: 'Resonating crystal bowl sound',
    frequency: 110,
    duration: 4,
    type: 'sine'
  }
]; 