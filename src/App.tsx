import React from 'react';
import { THEME, DEFAULT_MEMBERS, DEFAULT_SPACES } from './constants/theme';

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-[#000000] text-[#FFFFFF] font-mono select-none overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center border border-[#262626] m-4 bg-[#0A0A0A]">
        <div className="border border-[#FFFFFF] px-4 py-2 font-bold tracking-widest text-lg mb-4">
          WHITESPACE // AUTONOMOUS OS
        </div>
        <p className="text-xs text-[#A3A3A3] max-w-md mb-6 uppercase tracking-wider">
          Strict Monochrome Discipline / Zero Emojis / Discord + Notion 3.0 + OpenClaw Triple-Paradigm
        </p>
        <div className="flex gap-4">
          {DEFAULT_SPACES.map(space => (
            <div key={space.id} className="border border-[#262626] bg-[#121212] px-3 py-2 text-xs">
              <span className="font-bold border border-[#404040] px-1 mr-2">{space.badge}</span>
              {space.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
