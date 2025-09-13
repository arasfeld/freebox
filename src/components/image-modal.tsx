'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ImageModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            setCurrentIndex(prev =>
              prev === 0 ? images.length - 1 : prev - 1
            );
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            setCurrentIndex(prev =>
              prev === images.length - 1 ? 0 : prev + 1
            );
          }
          break;
        case 'z':
          setIsZoomed(!isZoomed);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, images.length, isZoomed, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Zoom toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {isZoomed ? (
          <ZoomOut className="h-6 w-6" />
        ) : (
          <ZoomIn className="h-6 w-6" />
        )}
      </Button>

      {/* Navigation arrows */}
      {hasMultipleImages && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() =>
              setCurrentIndex(prev =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() =>
              setCurrentIndex(prev =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image counter */}
      {hasMultipleImages && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-4 ${
          isZoomed ? 'overflow-auto' : 'overflow-hidden'
        }`}
      >
        <div
          className={`relative ${
            isZoomed
              ? 'w-full h-full cursor-zoom-out'
              : 'max-w-[100vw] max-h-[100vh] cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          style={{
            maxHeight: isZoomed ? '100vh' : '100vh',
            maxWidth: isZoomed ? '100vw' : '100vw',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`Item image ${currentIndex + 1}`}
            className={`w-full h-full object-contain transition-all duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              maxHeight: isZoomed ? 'none' : '100vh',
              maxWidth: isZoomed ? 'none' : '100vw',
            }}
            onError={() => {
              console.error('Image failed to load:', currentImage);
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
        {hasMultipleImages && '← → to navigate • '}Z to zoom • ESC to close
      </div>
    </div>
  );
}
