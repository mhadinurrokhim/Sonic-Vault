'use client';

import { useState, useRef, useCallback } from 'react';
import { isValidAudioFile, SUPPORTED_EXTENSIONS } from '@/lib/utils';

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  isUploading: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Validate files
      const validFiles = Array.from(files).filter(file => {
        if (!isValidAudioFile(file)) {
          setError(`Invalid format: ${file.name}`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach(f => dataTransfer.items.add(f));
        onUpload(dataTransfer.files);
      }
    }
  }, [onUpload]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div 
      className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(',')}
        multiple
        onChange={handleFileChange}
        className="upload-input"
      />
      
      <div className="upload-content">
        {isUploading ? (
          <>
            <div className="upload-spinner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20">
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 12 12" 
                    to="360 12 12" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
            <p>Uploading...</p>
          </>
        ) : (
          <>
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="upload-text">
              <span className="upload-highlight">Click to upload</span> or drag and drop
            </p>
            <p className="upload-formats">
              MP3, WAV, FLAC, OGG, M4A (max 50MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
    </div>
  );
}
