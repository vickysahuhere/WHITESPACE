import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';

export const WindowControls: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const desktopApi = (window as any).whiteCollarsDesktop;
    if (desktopApi?.isDesktop) {
      setIsDesktop(true);
      desktopApi.isMaximized?.().then?.(setIsMaximized);
    }
  }, []);

  const handleMinimize = () => {
    (window as any).whiteCollarsDesktop?.minimize();
  };

  const handleMaximize = () => {
    (window as any).whiteCollarsDesktop?.maximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    (window as any).whiteCollarsDesktop?.close();
  };

  if (!isDesktop) {
    return null;
  }

  return (
    <div 
      className="flex items-center h-full border-l border-[#1F1F1F] ml-2 select-none"
      style={{ WebkitAppRegion: 'no-drag' } as any}
    >
      <button
        onClick={handleMinimize}
        title="Minimize"
        className="h-11 w-9 flex items-center justify-center text-[#71717A] hover:text-[#FFFFFF] hover:bg-[#18181B] transition-colors"
      >
        <Minus size={12} />
      </button>

      <button
        onClick={handleMaximize}
        title={isMaximized ? "Restore" : "Maximize"}
        className="h-11 w-9 flex items-center justify-center text-[#71717A] hover:text-[#FFFFFF] hover:bg-[#18181B] transition-colors"
      >
        {isMaximized ? <Copy size={11} /> : <Square size={11} />}
      </button>

      <button
        onClick={handleClose}
        title="Close"
        className="h-11 w-9 flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
};
