import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Send, Trash2 } from "lucide-react";

const VoiceRecorder = ({ onVoiceMessage, className = "" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRecordingUI, setShowRecordingUI] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        setRecordedBlob(blob);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowRecordingUI(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const audioUrl = URL.createObjectURL(recordedBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);

        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    }
  };

  const sendVoiceMessage = () => {
    if (recordedBlob) {
      onVoiceMessage(recordedBlob, recordingTime);
      resetRecording();
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setShowRecordingUI(false);
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showRecordingUI) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <audio ref={audioRef} />

        {isRecording ? (
          <>
            {/* Recording in progress */}
            <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-full">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
            <button
              onClick={stopRecording}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="Stop recording"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        ) : recordedBlob ? (
          <>
            {/* Recording finished - show playback and send options */}
            <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-full">
              <button
                onClick={playRecording}
                className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {formatTime(recordingTime)}
              </span>
            </div>

            <button
              onClick={sendVoiceMessage}
              className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
              title="Send voice message"
            >
              <Send className="w-4 h-4" />
            </button>

            <button
              onClick={resetRecording}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      className={`p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors ${className}`}
      aria-label="Record voice message"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
};

export default VoiceRecorder;
