import React, { useState } from "react";
import { X, Download, Play, Pause, Volume2, VolumeX } from "lucide-react";

const MediaViewer = ({ media, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen || !media) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.name || "media";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMedia = () => {
    switch (media.type) {
      case "image":
        return (
          <img
            src={media.url}
            alt={media.name}
            className="max-w-full max-h-[80vh] object-contain"
          />
        );

      case "video":
        return (
          <video
            src={media.url}
            controls
            className="max-w-full max-h-[80vh]"
            muted={isMuted}
          >
            Your browser does not support video playback.
          </video>
        );

      case "audio":
      case "voice":
        return (
          <div className="bg-white dark:bg-dark-800 p-8 rounded-lg max-w-md">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {media.type === "voice" ? "Voice Message" : "Audio File"}
              </h3>
              {media.name && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {media.name}
                </p>
              )}
            </div>

            <audio src={media.url} controls className="w-full">
              Your browser does not support audio playback.
            </audio>
          </div>
        );

      case "gif":
        return (
          <img
            src={media.url}
            alt="GIF"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        );

      default:
        return (
          <div className="bg-white dark:bg-dark-800 p-8 rounded-lg max-w-md text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📎</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {media.name || "File"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {media.size && formatFileSize(media.size)}
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[200] p-4">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="text-white">
          <h3 className="font-semibold">{media.name || "Media"}</h3>
          {media.timestamp && (
            <p className="text-sm text-gray-300">
              {new Date(media.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Media Content */}
      <div className="flex items-center justify-center w-full h-full pt-16 pb-8">
        {renderMedia()}
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default MediaViewer;
