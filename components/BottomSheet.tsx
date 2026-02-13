
import React, { useState, useRef, useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, height = 'h-auto' }) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - startYRef.current;
    if (deltaY > 0) setDragOffset(deltaY);
    else setDragOffset(0);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 120; 
    if (dragOffset > threshold) onClose();
    else setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: isOpen 
            ? `translateY(${dragOffset}px)` 
            : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800 rounded-t-[2.5rem] overflow-hidden ${height} min-h-[30%] max-h-[92%] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] will-change-transform flex flex-col`}
      >
        <div className="w-full flex justify-center py-5 shrink-0">
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full" />
        </div>
        <div 
          className="flex-grow overflow-y-auto px-6 pb-safe no-scrollbar"
          onScroll={(e) => {
            if (e.currentTarget.scrollTop > 0) setIsDragging(false);
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
