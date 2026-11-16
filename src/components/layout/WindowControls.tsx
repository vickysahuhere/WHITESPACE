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
    return (
      <div className="flex items-center pl-1 text-[10px] text-[#525252] font-mono select-none">
        <span className="hidden lg:inline border border-[#262626] bg-[#0D0D0D] px-1.5 py-0.5 tracking-wider">
          WEB RUNTIME
        </span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center h-full border-l border-[#262626] ml-2 select-none"
      style={{ WebkitAppRegion: 'no-drag' } as any}
    >
      <button
        onClick={handleMinimize}
        title="Minimize"
        className="h-11 w-10 flex items-center justify-center text-[#737373] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors"
      >
        <Minus size={12} />
      </button>

      <button
        onClick={handleMaximize}
        title={isMaximized ? "Restore" : "Maximize"}
        className="h-11 w-10 flex items-center justify-center text-[#737373] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors"
      >
        {isMaximized ? <Copy size={11} /> : <Square size={11} />}
      </button>

      <button
        onClick={handleClose}
        title="Close"
        className="h-11 w-10 flex items-center justify-center text-[#737373] hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
};
