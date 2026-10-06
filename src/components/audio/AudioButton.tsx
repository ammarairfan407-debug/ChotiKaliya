'use client';

import React from 'react';
import { Volume2, VolumeX, Turtle } from 'lucide-react';
import { useAudio } from './AudioProvider';

interface AudioButtonProps {
  audioUrl?: string;
  audioSlowUrl?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showSlowButton?: boolean;
  className?: string;
}

export function AudioButton({
  audioUrl,
  audioSlowUrl,
  label,
  size = 'md',
  showSlowButton = false,
  className = '',
}: AudioButtonProps) {
  const { play, stop, isPlaying, currentUrl } = useAudio();

  const isCurrentlyPlaying = isPlaying && currentUrl === audioUrl;
  const isSlowPlaying = isPlaying && currentUrl === audioSlowUrl;

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      stop();
    } else if (audioUrl) {
      play(audioUrl);
    }
  };

  const handlePlaySlow = () => {
    if (isSlowPlaying) {
      stop();
    } else if (audioSlowUrl) {
      play(audioSlowUrl);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlay}
        className={`audio-btn ${sizeClasses[size]} ${
          isCurrentlyPlaying
            ? 'bg-pastel-green/30 border-pastel-green/50 ring-2 ring-pastel-green/30'
            : ''
        }`}
        aria-label={label || (isCurrentlyPlaying ? 'Stop audio' : 'Play audio')}
        title={isCurrentlyPlaying ? 'Stop' : 'Play'}
      >
        {isCurrentlyPlaying ? (
          <VolumeX size={iconSizes[size]} className="text-pastel-green-dark" />
        ) : (
          <Volume2 size={iconSizes[size]} className="text-dark" />
        )}
      </button>

      {showSlowButton && audioSlowUrl && (
        <button
          onClick={handlePlaySlow}
          className={`audio-btn ${sizeClasses[size]} ${
            isSlowPlaying
              ? 'bg-pastel-yellow/30 border-pastel-yellow/50 ring-2 ring-pastel-yellow/30'
              : ''
          }`}
          aria-label="Play slow audio"
          title="Slow"
        >
          <Turtle
            size={iconSizes[size]}
            className={isSlowPlaying ? 'text-pastel-yellow' : 'text-dark-light'}
          />
        </button>
      )}
    </div>
  );
}
