import React from 'react';
import { GameView } from '../types';
import { BookOpen, Calculator, Dice5, Share2, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentView: GameView;
  setCurrentView: (view: GameView) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenShare: () => void;
  onResetGame: () => void;
  hasActiveGame: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isMuted,
  onToggleMute,
  onOpenShare,
  onResetGame,
  hasActiveGame,
}) => {
  return (
    <header className="border-b border-[#D8CFBA] bg-[#FFFDF8]/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('game')}
            className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-[#1B4332] text-[#FFFDF8] flex items-center justify-center font-serif text-base sm:text-lg font-bold shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-[#1B4332] group-hover:text-[#122A22] transition-colors leading-none">
                  Money Moves
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-[#EDE6D6] text-[#A63D40] font-semibold border border-[#D8CFBA] leading-none">
                  RM
                </span>
              </div>
              <span className="text-[10px] hidden md:block font-mono text-[#4C5A7A] mt-0.5">
                The Board Game of Real Financial Decisions
              </span>
            </div>
          </button>
        </div>

        {/* View Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-play-btn"
            onClick={() => setCurrentView('game')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-mono rounded transition-colors cursor-pointer ${
              currentView === 'game'
                ? 'bg-[#1B4332] text-[#FFFDF8] font-medium'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
            title="Play Game"
          >
            <Dice5 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Play Game</span>
            <span className="sm:hidden">Play</span>
          </button>

          <button
            id="nav-rules-btn"
            onClick={() => setCurrentView('rules')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-mono rounded transition-colors cursor-pointer ${
              currentView === 'rules'
                ? 'bg-[#1B4332] text-[#FFFDF8] font-medium'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
            title="Rules & Guide"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Rules & Guide</span>
            <span className="sm:hidden">Rules</span>
          </button>

          <button
            id="nav-strategy-btn"
            onClick={() => setCurrentView('strategy')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-mono rounded transition-colors cursor-pointer ${
              currentView === 'strategy'
                ? 'bg-[#1B4332] text-[#FFFDF8] font-medium'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
            title="Strategy Lab"
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Strategy Lab</span>
            <span className="sm:hidden">Lab</span>
          </button>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            id="share-link-btn"
            onClick={onOpenShare}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono border border-[#B9AD8E] bg-[#F7F3E9] text-[#1D2B4F] hover:bg-[#EDE6D6] rounded transition-colors cursor-pointer"
            title="Share & Phone QR Code"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="hidden lg:inline">Share Link</span>
          </button>

          <button
            id="audio-toggle-btn"
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 text-[#4C5A7A] hover:text-[#1D2B4F] hover:bg-[#EDE6D6] rounded transition-colors cursor-pointer"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {hasActiveGame && (
            <button
              id="reset-game-btn"
              onClick={onResetGame}
              className="p-1.5 sm:p-2 text-[#A63D40] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer"
              title="Reset match / New game"
              aria-label="Reset Match"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
