// components/PhotoUpload.jsx
import React, { useState, useRef } from "react";
import { Camera, X, Upload, Star } from "lucide-react";

const PhotoUpload = ({
  photos = [],
  onPhotoAdd,
  onPhotoDelete,
  onSetPrimary,
  maxPhotos = 6,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onPhotoAdd?.(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const renderPhotoSlot = (photo, index) => {
    const isPrimary = photo?.isPrimary || index === 0;

    return (
      <div
        key={index}
        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
          isPrimary ? "border-pink-500" : "border-gray-200"
        } ${photo ? "" : "border-dashed"}`}
      >
        {photo ? (
          <>
            {/* Photo */}
            <img
              src={photo.url || URL.createObjectURL(photo)}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />

            {/* Primary Badge */}
            {isPrimary && (
              <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Primary</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              {!isPrimary && (
                <button
                  onClick={() => onSetPrimary?.(photo.id || index)}
                  className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100"
                >
                  Set Primary
                </button>
              )}

              <button
                onClick={() => onPhotoDelete?.(photo.id || index)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Empty Slot */
          <div
            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors ${
              dragOver ? "bg-pink-50 text-pink-600" : ""
            }`}
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Camera className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add Photo</span>
            <span className="text-xs">Tap or drag</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
        <span className="text-sm text-gray-500">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: maxPhotos }, (_, index) =>
          renderPhotoSlot(photos[index], index)
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Upload up to {maxPhotos} photos. The first photo will be your primary
          photo.
        </p>
        <p>Drag and drop or click to upload. Supported formats: JPG, PNG</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Bulk Upload Button */}
      {photos.length < maxPhotos && (
        <div className="flex justify-center">
          <button
            onClick={openFileDialog}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
