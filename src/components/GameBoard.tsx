import React from 'react';
import { BoardTile, Player } from '../types';
import { BOARD_TILES } from '../data/gameData';
import { Play, FastForward, ShieldAlert, Sparkles } from 'lucide-react';

interface GameBoardProps {
  players: Player[];
  currentTurnIndex: number;
  currentRound: number;
  totalRounds: number;
  dice: [number, number];
  isRolling: boolean;
  canRoll: boolean;
  onRollDice: () => void;
  speed: 'normal' | 'fast';
  onToggleSpeed: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentTurnIndex,
  currentRound,
  totalRounds,
  dice,
  isRolling,
  canRoll,
  onRollDice,
  speed,
  onToggleSpeed,
}) => {
  const activePlayer = players[currentTurnIndex] || players[0];

  // Helper to get all player tokens on tile
  const getPlayersOnTile = (tileIndex: number) => {
    return players.filter((p) => p.position === tileIndex);
  };

  return (
    <div className="relative w-full aspect-square max-w-[660px] mx-auto bg-[#D8CFBA] p-1 sm:p-1.5 rounded-lg border-2 border-[#1D2B4F] shadow-sm select-none">
      {/* 7x7 Grid */}
      <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 sm:gap-1.5">
        {/* Perimeter Tiles */}
        {BOARD_TILES.map((tile) => {
          const [row, col] = tile.coord;
          const occupants = getPlayersOnTile(tile.index);
          const isCorner = [0, 6, 12, 18].includes(tile.index);

          return (
            <div
              key={tile.index}
              id={`board-tile-${tile.index}`}
              style={{ gridRow: row, gridColumn: col }}
              className={`relative flex flex-col justify-between p-1 sm:p-1.5 overflow-hidden transition-all duration-150 ${
                isCorner ? 'bg-[#EDE6D6]' : 'bg-[#FFFDF8]'
              } border border-[#D8CFBA] hover:border-[#1D2B4F] rounded-xs group`}
            >
              {/* Type indicator top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: tile.accent }}
              />

              {/* Tile Icon and number */}
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs sm:text-base leading-none" title={tile.title}>
                  {tile.icon}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-[#4C5A7A] opacity-60">
                  {tile.index === 0 ? 'START' : `#${tile.index}`}
                </span>
              </div>

              {/* Label */}
              <div className="my-auto">
                <div
                  className="text-[8px] sm:text-[10px] font-mono uppercase font-bold text-[#1D2B4F] leading-tight line-clamp-2"
                  title={tile.title}
                >
                  {tile.title}
                </div>
              </div>

              {/* Player tokens on tile */}
              <div className="flex items-center justify-end flex-wrap-reverse gap-0.5 sm:gap-1 min-h-[14px]">
                {occupants.map((occ) => (
                  <div
                    key={occ.id}
                    id={`player-token-${occ.id}`}
                    className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-[#1D2B4F] shadow-xs animate-pop transition-transform"
                    style={{ backgroundColor: occ.color }}
                    title={`${occ.name} (RM${occ.cash})`}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Center Panel: Rows 2 to 6, Cols 2 to 6 */}
        <div
          className="col-start-2 col-end-7 row-start-2 row-end-7 bg-[#1B4332] text-[#FFFDF8] rounded p-1.5 sm:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden border border-[#122A22] shadow-inner"
        >
          {/* Subtle background crest / texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center font-serif text-[120px] sm:text-[180px] font-bold">
            RM
          </div>

          {/* Top Status */}
          <div className="w-full flex items-center justify-between text-[9px] sm:text-xs font-mono text-[#EDE6D6] z-10">
            <span className="bg-[#122A22] px-1.5 sm:px-2 py-0.5 rounded border border-[#2F6F62]">
              Rnd {currentRound}/{totalRounds}
            </span>

            <button
              onClick={onToggleSpeed}
              className="flex items-center gap-1 bg-[#122A22] hover:bg-[#122A22]/80 px-1.5 sm:px-2 py-0.5 rounded border border-[#2F6F62] cursor-pointer text-[#C9A227]"
              title="Toggle board animation speed"
            >
              <FastForward className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{speed === 'fast' ? 'Fast' : 'Normal'}</span>
            </button>
          </div>

          {/* Active Turn Showcase */}
          <div className="my-auto z-10 space-y-0.5 sm:space-y-1">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full bg-[#122A22] border border-[#2F6F62] text-[10px] sm:text-xs font-mono">
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: activePlayer?.color }}
              />
              <span className="text-[#C9A227] font-semibold truncate max-w-[120px] sm:max-w-none">{activePlayer?.name}'s Turn</span>
              {activePlayer?.isComputer && (
                <span className="text-[9px] text-[#EDE6D6]/70">(Bot)</span>
              )}
            </div>

            <div className="text-[9px] sm:text-xs text-[#EDE6D6]/80 font-mono">
              Cash: RM{Math.round(activePlayer?.cash || 0).toLocaleString()} &bull; Debt: RM
              {Math.round(activePlayer?.debt || 0).toLocaleString()}
            </div>

            {/* Dice Showcase */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 my-1 sm:my-3">
              <div
                className={`w-9 h-9 sm:w-14 sm:h-14 bg-[#FFFDF8] text-[#1D2B4F] rounded-lg border-2 border-[#1D2B4F] flex items-center justify-center font-serif text-lg sm:text-2xl font-bold shadow-md ${
                  isRolling ? 'animate-die' : ''
                }`}
              >
                {dice[0]}
              </div>
              <div className="font-mono text-xs sm:text-base text-[#C9A227] font-bold">+</div>
              <div
                className={`w-9 h-9 sm:w-14 sm:h-14 bg-[#FFFDF8] text-[#1D2B4F] rounded-lg border-2 border-[#1D2B4F] flex items-center justify-center font-serif text-lg sm:text-2xl font-bold shadow-md ${
                  isRolling ? 'animate-die' : ''
                }`}
              >
                {dice[1]}
              </div>
              <div className="font-mono text-[10px] sm:text-sm text-[#EDE6D6]/70">
                = {dice[0] + dice[1]}
              </div>
            </div>

            {/* Roll Action Button */}
            <div className="pt-0.5 sm:pt-1">
              <button
                id="btn-roll-dice"
                disabled={!canRoll || isRolling}
                onClick={onRollDice}
                className="px-4 sm:px-8 py-1.5 sm:py-3 bg-[#C9A227] hover:bg-[#B08F1E] disabled:opacity-40 disabled:hover:bg-[#C9A227] text-[#122A22] font-mono text-[10px] sm:text-sm font-bold uppercase tracking-wider rounded border border-[#B08F1E] shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                {isRolling
                  ? 'Rolling...'
                  : activePlayer?.isComputer
                  ? 'Bot Rolling...'
                  : 'Roll Dice'}
              </button>
            </div>
          </div>

          {/* Quick tips at bottom */}
          <div className="text-[10px] text-[#EDE6D6]/60 font-mono z-10 hidden sm:block">
            Passing Start triggers an 8% compounding interest charge on all unpaid debt!
          </div>
        </div>
      </div>
    </div>
  );
};
