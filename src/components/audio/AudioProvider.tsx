'use client';

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface AudioContextType {
  play: (url: string) => void;
  stop: () => void;
  isPlaying: boolean;
  currentUrl: string | null;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentUrl(null);
  }, []);

  const play = useCallback((url: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (!soundsEnabled || !url) {
      return;
    }

    try {
      const audio = new Audio(url);
      audio.volume = isMuted ? 0 : volume;
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentUrl(null);
      };
      audio.onerror = () => {
        // Fail gracefully if audio file is missing
        console.warn(`Audio file not found: ${url}`);
        setIsPlaying(false);
        setCurrentUrl(null);
      };
      audioRef.current = audio;
      setCurrentUrl(url);
      setIsPlaying(true);
      audio.play().catch(() => {
        // Handle autoplay restrictions gracefully
        setIsPlaying(false);
        setCurrentUrl(null);
      });
    } catch {
      console.warn('Audio playback failed');
      setIsPlaying(false);
      setCurrentUrl(null);
    }
  }, [isMuted, volume, soundsEnabled]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = newMuted ? 0 : volume;
      }
      return newMuted;
    });
  }, [volume]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = v;
    }
  }, [isMuted]);

  return (
    <AudioContext.Provider value={{
      play, stop, isPlaying, currentUrl,
      isMuted, toggleMute, volume, setVolume,
      soundsEnabled, setSoundsEnabled,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
