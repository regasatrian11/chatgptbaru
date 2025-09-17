import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      let stream: MediaStream;
      
      try {
        // First try with specific facingMode
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode }
          },
          audio: false
        });
      } catch (facingModeError) {
        // If specific facingMode fails, try with any available camera
        console.warn('Specific camera not found, trying any available camera:', facingModeError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      let errorMessage = 'Tidak dapat mengakses kamera.';
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotFoundError':
            errorMessage = 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.';
            break;
          case 'NotAllowedError':
            errorMessage = 'Akses kamera ditolak. Silakan berikan izin kamera.';
            break;
          case 'NotReadableError':
            errorMessage = 'Kamera sedang digunakan aplikasi lain.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Kamera tidak mendukung pengaturan yang diminta.';
            break;
          default:
            errorMessage = 'Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        onCapture(file);
        stopCamera();
        onClose();
      }
    }, 'image/jpeg', 0.8);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-medium">Kamera Langsung</h2>
        <button
          onClick={switchCamera}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          disabled={isLoading}
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Membuka kamera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-center p-4">
              <p className="mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="bg-black p-6">
        <div className="flex items-center justify-center">
          <button
            onClick={capturePhoto}
            disabled={isLoading || !!error}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={32} className="text-black" />
          </button>
        </div>
        <p className="text-white text-center text-sm mt-4">
          Ketuk tombol untuk mengambil foto
        </p>
      </div>
    </div>
  );
}