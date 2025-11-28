import React, { useRef, useState } from "react";
import { Image as ImageIcon, Paperclip, X, Send } from "lucide-react";

const ImageUploader = ({ onFileSelect, className = "" }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const handleImageSelect = () => {
    imageInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Validate file type
      if (type === "image") {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
          return;
        }
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewFile({
            file,
            type: "image",
            preview: e.target.result,
            name: file.name,
            size: file.size,
          });
          setShowPreview(true);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewFile({
          file,
          type: "file",
          preview: null,
          name: file.name,
          size: file.size,
        });
        setShowPreview(true);
      }
    }

    // Reset input
    event.target.value = "";
  };

  const handleSendFile = () => {
    if (previewFile) {
      onFileSelect(previewFile.file, previewFile.type);
      setPreviewFile(null);
      setShowPreview(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewFile(null);
    setShowPreview(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📋";
      case "zip":
      case "rar":
        return "📦";
      case "mp3":
      case "wav":
        return "🎵";
      case "mp4":
      case "avi":
        return "🎬";
      default:
        return "📎";
    }
  };

  return (
    <>
      <div className={`relative ${className}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Add media"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-2 min-w-[150px] z-50">
            <button
              onClick={handleImageSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex items-center space-x-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo</span>
            </button>
            <button
              onClick={handleFileSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex items-center space-x-2"
            >
              <Paperclip className="w-4 h-4" />
              <span>File</span>
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "image")}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileChange(e, "file")}
          className="hidden"
        />
      </div>

      {/* File Preview Modal */}
      {showPreview && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl w-80 max-w-[85vw] max-h-[50vh] overflow-hidden shadow-2xl">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Send {previewFile.type === "image" ? "Photo" : "File"}
                </h3>
                <button
                  onClick={handleCancelPreview}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="mb-2 relative group">
                {previewFile.type === "image" ? (
                  <div className="relative">
                    <img
                      src={previewFile.preview}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg cursor-pointer"
                      onClick={handleSendFile}
                    />
                    {/* Send Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={handleSendFile}
                        className="opacity-0 group-hover:opacity-100 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-2 transition-all duration-200 transform scale-75 group-hover:scale-100"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="text-3xl">
                      {getFileIcon(previewFile.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(previewFile.size)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelPreview}
                  className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFile}
                  className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors flex items-center justify-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
