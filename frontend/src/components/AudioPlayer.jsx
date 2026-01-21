import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaRandom, FaRedo } from 'react-icons/fa';

/**
 * AudioPlayer Component
 * A beautiful audio player with waveform visualization, controls, and playlist support
 */
const AudioPlayer = ({
  src,
  title = 'Unknown Track',
  artist = 'Unknown Artist',
  cover,
  autoplay = false,
  loop = false,
  shuffle = false,
  playlist = [],
  onTrackEnd,
  onTrackChange,
  className = '',
  ...props
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(shuffle);
  const [isLooped, setIsLooped] = useState(loop);

  const currentTrack = playlist.length > 0 
    ? playlist[currentTrackIndex] 
    : { src, title, artist, cover };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isLooped) {
        audio.play();
      } else if (playlist.length > 0) {
        handleNext();
      } else {
        setIsPlaying(false);
        onTrackEnd?.();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooped, playlist, onTrackEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    if (isPlaying) {
      audio.play();
    }
    onTrackChange?.(currentTrackIndex);
  }, [currentTrackIndex, currentTrack.src, isPlaying, onTrackChange]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (audio) {
      audio.volume = newVolume;
      audio.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      setVolume(1);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 0) {
      const newIndex = currentTrackIndex > 0 
        ? currentTrackIndex - 1 
        : playlist.length - 1;
      setCurrentTrackIndex(newIndex);
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
      }
    }
  };

  const handleNext = () => {
    if (playlist.length > 0) {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * playlist.length)
        : (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(newIndex);
    }
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-2xl p-6 shadow-2xl ${className}`} {...props}>
      <audio ref={audioRef} />
      
      <div className="flex items-center space-x-6">
        {/* Cover Art */}
        {currentTrack.cover && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{currentTrack.title}</h3>
          <p className="text-pink-200 text-sm truncate">{currentTrack.artist}</p>
          
          {/* Progress Bar */}
          <div
            className="mt-3 h-1 bg-white bg-opacity-20 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Time */}
          <div className="flex items-center justify-between mt-2 text-white text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${
              isShuffle
                ? 'bg-purple-500 text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            <FaRandom className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
          >
            <FaStepBackward className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            {isPlaying ? (
              <FaPause className="w-5 h-5" />
            ) : (
              <FaPlay className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
          >
            <FaStepForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsLooped(!isLooped)}
            className={`p-2 rounded-full transition-colors ${
              isLooped
                ? 'bg-purple-500 text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            <FaRedo className="w-4 h-4" />
          </button>

          {/* Volume */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <FaVolumeMute className="w-4 h-4" />
              ) : (
                <FaVolumeUp className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-purple-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
// Style improvement
// Performance optimization
// Refactor improvement
