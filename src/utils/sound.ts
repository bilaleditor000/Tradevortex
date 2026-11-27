// Web Audio API synthesizer for tactile UI clicks without external asset dependencies

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize sound preference from localStorage
export const initSoundPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('tradevortex_sound_enabled');
  if (stored !== null) {
    soundEnabled = stored === 'true';
  } else {
    soundEnabled = true;
  }
  return soundEnabled;
};

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('tradevortex_sound_enabled', String(enabled));
  }
};

export const getSoundEnabled = (): boolean => soundEnabled;

export const playClickSound = (type: 'click' | 'toggle' | 'calculate' = 'click'): void => {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Subtle crisp tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'calculate') {
      // Ascending success chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      // Toggle sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Fail silently if audio context cannot be initialized
  }
};
