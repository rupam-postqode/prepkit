"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface CelebrationProps {
  achievements: Achievement[];
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function Celebration({ achievements, onClose, autoClose = true, autoCloseDelay = 5000 }: CelebrationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentAchievement = achievements[currentIndex];

  useEffect(() => {
    if (autoClose && achievements.length > 0) {
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setIsVisible(false);
          setTimeout(onClose, 300); // Allow fade out animation
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, achievements.length, autoClose, autoCloseDelay, onClose]);

  if (!isVisible || !currentAchievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative max-w-md w-full">
        {/* Celebration animation background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>

        {/* Main celebration card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center transform animate-bounce">
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Achievement counter */}
          {achievements.length > 1 && (
            <div className="absolute top-4 left-4 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} of {achievements.length}
            </div>
          )}

          {/* Celebration emoji */}
          <div className="text-8xl mb-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
            {currentAchievement.emoji}
          </div>

          {/* Achievement title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Achievement Unlocked!
          </h2>

          {/* Achievement name */}
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">
            {currentAchievement.title}
          </h3>

          {/* Achievement description */}
          <p className="text-gray-600 mb-6">
            {currentAchievement.description}
          </p>

          {/* Progress indicator for multiple achievements */}
          {achievements.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              {achievements.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Encouragement text */}
          <p className="text-sm text-gray-500">
            Keep up the amazing work! 🎉
          </p>
        </div>

        {/* Confetti animation (CSS only) */}
        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
          }

          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #ff6b6b;
            animation: confetti 3s linear infinite;
          }

          .confetti:nth-child(2) { background: #4ecdc4; animation-delay: 0.2s; }
          .confetti:nth-child(3) { background: #45b7d1; animation-delay: 0.4s; }
          .confetti:nth-child(4) { background: #f9ca24; animation-delay: 0.6s; }
          .confetti:nth-child(5) { background: #f0932b; animation-delay: 0.8s; }
        `}</style>

        {/* Confetti elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="confetti absolute top-0 left-1/4"></div>
          <div className="confetti absolute top-0 left-1/2"></div>
          <div className="confetti absolute top-0 left-3/4"></div>
          <div className="confetti absolute top-0 right-1/4"></div>
          <div className="confetti absolute top-0 right-1/2"></div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing celebration state
export function useCelebration() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const showCelebration = (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
    setIsCelebrating(true);
  };

  const hideCelebration = () => {
    setIsCelebrating(false);
    setAchievements([]);
  };

  return {
    achievements,
    isCelebrating,
    showCelebration,
    hideCelebration,
  };
}
