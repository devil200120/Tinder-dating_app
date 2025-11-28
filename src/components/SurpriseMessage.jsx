import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Gift, Sparkles } from "lucide-react";

const SurpriseMessage = ({ message, onReveal, isOwnMessage }) => {
  const [isRevealed, setIsRevealed] = useState(message.isRevealed || false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerConfetti = () => {
    // Heart-shaped confetti
    const heartConfetti = () => {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff69b4", "#ff1493", "#dc143c", "#b22222"],
        shapes: ["heart"],
        scalar: 1.2,
      });
    };

    // Rainbow confetti burst
    const rainbowConfetti = () => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
        colors: [
          "#ff0080",
          "#ff8000",
          "#ffff00",
          "#80ff00",
          "#00ff80",
          "#0080ff",
          "#8000ff",
        ],
      });
    };

    // Stars confetti
    const starsConfetti = () => {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#ffd700", "#ffff00", "#ffa500"],
        shapes: ["star"],
        scalar: 0.8,
      });
    };

    // Trigger confetti sequence
    heartConfetti();
    setTimeout(rainbowConfetti, 200);
    setTimeout(starsConfetti, 400);

    // Additional bursts
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff69b4", "#ff1493", "#dc143c"],
      });
    }, 600);

    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff69b4", "#ff1493", "#dc143c"],
      });
    }, 800);
  };

  const handleReveal = async () => {
    if (isRevealed || isAnimating || isOwnMessage) return;

    setIsAnimating(true);

    // Trigger confetti animation
    triggerConfetti();

    // Wait for animation to start
    setTimeout(() => {
      setIsRevealed(true);
      if (onReveal) {
        onReveal(message._id);
      }
    }, 500);

    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  useEffect(() => {
    setIsRevealed(message.isRevealed || false);
  }, [message.isRevealed]);

  if (isRevealed) {
    return (
      <div className="relative">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border-2 border-pink-300 dark:border-pink-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
              Surprise Message
            </span>
            <span className="text-lg">{message.surpriseEmoji || "🎉"}</span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`
          bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 
          border-2 border-dashed border-pink-400 dark:border-pink-500 
          rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
          ${isAnimating ? "animate-pulse scale-105" : ""}
          ${isOwnMessage ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}
        `}
        onClick={handleReveal}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Gift
              className={`w-8 h-8 text-pink-500 ${
                isAnimating ? "animate-bounce" : "animate-pulse"
              }`}
            />
            {!isOwnMessage && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">
              {isOwnMessage ? "Your Surprise Message" : "Surprise Message"}
            </p>
            {!isOwnMessage && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tap to reveal with confetti! 🎊
              </p>
            )}
          </div>

          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurpriseMessage;
