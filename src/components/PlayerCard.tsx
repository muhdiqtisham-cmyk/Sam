import React from 'react';
import { Player } from '../types';
import { Bot, User, TrendingUp, AlertTriangle } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  rank?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, rank }) => {
  const netWorth = player.cash - player.debt;

  return (
    <div
      id={`player-card-${player.id}`}
      className={`p-3 rounded border transition-all relative ${
        isActive
          ? 'bg-[#EDE6D6] border-[#C9A227] ring-1 ring-[#C9A227] shadow-xs'
          : 'bg-[#FFFDF8] border-[#D8CFBA] hover:border-[#B9AD8E]'
      }`}
    >
      {/* Head */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#1D2B4F]"
            style={{ backgroundColor: player.color }}
          />
          <div className="font-serif font-semibold text-sm sm:text-base text-[#1D2B4F] truncate">
            {player.name}
          </div>
          {player.isComputer && (
            <span
              className="text-[10px] font-mono px-1 rounded bg-[#D8CFBA]/50 text-[#4C5A7A] shrink-0"
              title="Automated player"
            >
              bot
            </span>
          )}
        </div>

        {isActive ? (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A63D40] bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#C9A227]">
            rolling
          </span>
        ) : rank !== undefined ? (
          <span className="text-xs font-mono font-medium text-[#4C5A7A]">#{rank}</span>
        ) : null}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono">
        <div className="text-[#4C5A7A]">Cash:</div>
        <div className="text-right font-medium text-[#1D2B4F]">RM{Math.round(player.cash).toLocaleString()}</div>

        <div className="text-[#4C5A7A]">Debt:</div>
        <div
          className={`text-right font-medium ${
            player.debt > 0 ? 'text-[#A63D40]' : 'text-[#4C5A7A]'
          }`}
        >
          {player.debt > 0 ? `RM${Math.round(player.debt).toLocaleString()}` : 'RM0'}
        </div>

        <div className="text-[#1D2B4F] font-semibold border-t border-[#D8CFBA]/60 pt-1">
          Net Worth:
        </div>
        <div
          className={`text-right font-bold border-t border-[#D8CFBA]/60 pt-1 ${
            netWorth >= 0 ? 'text-[#1B4332]' : 'text-[#A63D40]'
          }`}
        >
          RM{Math.round(netWorth).toLocaleString()}
        </div>
      </div>

      {/* Extra badge indicator for skills or debt risk */}
      {(player.incomeBoost > 0 || player.debt > 1500) && (
        <div className="mt-2 pt-1.5 border-t border-[#D8CFBA]/40 flex items-center justify-between text-[11px] font-mono">
          {player.incomeBoost > 0 && (
            <span className="text-[#1B4332] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Salary +RM{player.incomeBoost}
            </span>
          )}
          {player.debt > 1500 && (
            <span className="text-[#A63D40] flex items-center gap-1 ml-auto">
              <AlertTriangle className="w-3 h-3" />
              High Debt
            </span>
          )}
        </div>
      )}
    </div>
  );
};
