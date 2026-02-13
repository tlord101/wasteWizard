
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraScannerProps {
  onCapture: (base64: string) => void;
  isProcessing: boolean;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-black group">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Scanner overlay */}
      <div className="absolute inset-0 border-[2px] border-emerald-500/30 m-8 rounded-2xl flex items-center justify-center">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
        
        {isProcessing && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-[scan_2s_linear_infinite]" />
        )}
      </div>

      <button 
        onClick={capture}
        disabled={isProcessing}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
          {isProcessing ? (
            <i className="fa-solid fa-circle-notch animate-spin text-white text-xl"></i>
          ) : (
            <i className="fa-solid fa-camera text-white text-xl"></i>
          )}
        </div>
      </button>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(220px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraScanner;
