import { BreathingPattern } from '@/components/BreathingCircle';

export const breathingPatterns: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal duration for inhale, hold, exhale, and pause. Great for stress relief and focus.',
    phases: [
      { name: 'inhale', duration: 4, scale: 1.5 },
      { name: 'hold', duration: 4, scale: 1.5 },
      { name: 'exhale', duration: 4, scale: 1 },
      { name: 'pause', duration: 4, scale: 1 }
    ]
  },
  {
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. Helps with anxiety and sleep.',
    phases: [
      { name: 'inhale', duration: 4, scale: 1.5 },
      { name: 'hold', duration: 7, scale: 1.5 },
      { name: 'exhale', duration: 8, scale: 1 },
      { name: 'pause', duration: 0, scale: 1 }
    ]
  },
  {
    name: 'Relaxing Breath',
    description: 'Gentle breathing with longer exhales. Perfect for relaxation.',
    phases: [
      { name: 'inhale', duration: 4, scale: 1.5 },
      { name: 'hold', duration: 2, scale: 1.5 },
      { name: 'exhale', duration: 6, scale: 1 },
      { name: 'pause', duration: 2, scale: 1 }
    ]
  },
  {
    name: 'Energy Boost',
    description: 'Quick, energizing breaths to increase alertness and energy.',
    phases: [
      { name: 'inhale', duration: 2, scale: 1.5 },
      { name: 'hold', duration: 1, scale: 1.5 },
      { name: 'exhale', duration: 2, scale: 1 },
      { name: 'pause', duration: 1, scale: 1 }
    ]
  },
  {
    name: 'Deep Calm',
    description: 'Slow, deep breaths with extended holds. For deep relaxation.',
    phases: [
      { name: 'inhale', duration: 6, scale: 1.5 },
      { name: 'hold', duration: 6, scale: 1.5 },
      { name: 'exhale', duration: 6, scale: 1 },
      { name: 'pause', duration: 6, scale: 1 }
    ]
  }
]; 