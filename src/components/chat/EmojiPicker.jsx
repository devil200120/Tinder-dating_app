import React, { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

const EmojiPicker = ({ onEmojiSelect, className = "" }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Popular emojis for quick access
  const popularEmojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
  ];

  // Heart emojis category
  const heartEmojis = [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "💌",
    "💋",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "💏",
    "👨‍❤️‍👨",
    "👩‍❤️‍👩",
  ];

  // Fun emojis category
  const funEmojis = [
    "🎉",
    "🎊",
    "🥳",
    "🎈",
    "🎁",
    "🎀",
    "🎂",
    "🍰",
    "🎵",
    "🎶",
    "🎤",
    "🎧",
    "🎮",
    "🕹️",
    "🎯",
    "🎱",
    "🎰",
    "🎲",
    "♠️",
    "♥️",
    "♦️",
    "♣️",
    "🃏",
    "🀄",
    "🎴",
    "🎭",
    "🎨",
    "🖼️",
    "🎪",
    "🎡",
  ];

  const categories = [
    { name: "Popular", emojis: popularEmojis, icon: "😊" },
    { name: "Hearts", emojis: heartEmojis, icon: "❤️" },
    { name: "Fun", emojis: funEmojis, icon: "🎉" },
  ];

  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        aria-label="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showPicker && (
        <div className="absolute bottom-full mb-2 left-0 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50">
          <div className="p-4">
            {/* Category Tabs */}
            <div className="flex space-x-1 mb-3 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeCategory === index
                      ? "bg-white dark:bg-dark-600 shadow-sm text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {categories[activeCategory].emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
