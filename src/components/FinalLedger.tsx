import React from 'react';
import { Player } from '../types';
import { Trophy, Award, ShoppingBag, TrendingUp, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { playFanfareSound } from '../utils/audio';

interface FinalLedgerProps {
  players: Player[];
  onPlayAgain: () => void;
  onRematch: () => void;
}

export const FinalLedger: React.FC<FinalLedgerProps> = ({ players, onPlayAgain, onRematch }) => {
  React.useEffect(() => {
    playFanfareSound();
  }, []);

  // Sort descending by net worth
  const ranked = [...players].sort((a, b) => b.cash - b.debt - (a.cash - a.debt));
  const winner = ranked[0];

  // Badges
  const bigSpender = [...players].sort((a, b) => b.shopCount - a.shopCount)[0];
  const riskTaker = [...players].sort((a, b) => b.investCount - a.investCount)[0];
  const debtDodger = [...players].sort((a, b) => a.debt - b.debt)[0];
  const skillMaster = [...players].sort((a, b) => b.skillCount - a.skillCount)[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-pop">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-[#EDE6D6] border-2 border-[#C9A227] rounded-full mb-3 shadow-xs">
          <Trophy className="w-8 h-8 text-[#C9A227]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332] mb-1">
          Final Ledger & Standings
        </h1>
        <p className="text-sm font-mono text-[#4C5A7A]">
          Ten rounds concluded. Here is how each player's financial strategy performed.
        </p>
      </div>

      {/* Champion Callout */}
      <div className="bg-[#1B4332] text-[#FFFDF8] border-2 border-[#C9A227] rounded-lg p-5 sm:p-6 mb-8 text-center relative overflow-hidden shadow-md">
        <div className="text-xs font-mono uppercase tracking-widest text-[#C9A227] mb-1">
          Crown Champion
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF8] mb-2">
          {winner.name}
        </h2>
        <div className="text-sm font-mono text-[#EDE6D6] flex items-center justify-center gap-4">
          <span>Final Net Worth: <strong className="text-[#C9A227] text-base">RM{Math.round(winner.cash - winner.debt).toLocaleString()}</strong></span>
          <span>&bull;</span>
          <span>Cash: RM{Math.round(winner.cash).toLocaleString()}</span>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg overflow-hidden shadow-xs mb-8">
        <div className="px-4 py-3 bg-[#EDE6D6] border-b border-[#D8CFBA] flex items-center justify-between font-mono text-xs font-bold text-[#1D2B4F]">
          <span>RANK &amp; PLAYER</span>
          <div className="flex gap-6 text-right">
            <span className="w-16">CASH</span>
            <span className="w-16">DEBT</span>
            <span className="w-20">NET WORTH</span>
          </div>
        </div>

        <div className="divide-y divide-[#D8CFBA]/60">
          {ranked.map((p, idx) => {
            const net = p.cash - p.debt;
            return (
              <div
                key={p.id}
                className="px-4 py-3 flex items-center justify-between font-mono text-xs hover:bg-[#F7F3E9] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-serif text-base font-bold w-6 text-center ${
                      idx === 0 ? 'text-[#C9A227]' : 'text-[#4C5A7A]'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-[#1D2B4F]"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-serif font-semibold text-sm text-[#1D2B4F]">
                    {p.name}
                  </span>
                </div>

                <div className="flex gap-6 text-right font-medium">
                  <span className="w-16 text-[#1D2B4F]">RM{Math.round(p.cash).toLocaleString()}</span>
                  <span
                    className={`w-16 ${
                      p.debt > 0 ? 'text-[#A63D40]' : 'text-[#4C5A7A]'
                    }`}
                  >
                    RM{Math.round(p.debt).toLocaleString()}
                  </span>
                  <span
                    className={`w-20 font-bold ${
                      net >= 0 ? 'text-[#1B4332]' : 'text-[#A63D40]'
                    }`}
                  >
                    RM{Math.round(net).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Category Badges */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-5 mb-8 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-[#1D2B4F] mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C9A227]" />
          Financial Superlatives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#A63D40] shrink-0" />
            <div>
              <div className="font-bold text-[#1D2B4F]">Big Spender</div>
              <div className="text-[#4C5A7A]">
                {bigSpender.name} ({bigSpender.shopCount} shopping splurges)
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#1B4332] shrink-0" />
            <div>
              <div className="font-bold text-[#1D2B4F]">Risk Taker</div>
              <div className="text-[#4C5A7A]">
                {riskTaker.name} ({riskTaker.investCount} market bets)
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0" />
            <div>
              <div className="font-bold text-[#1D2B4F]">Debt Dodger</div>
              <div className="text-[#4C5A7A]">
                {debtDodger.name} (RM{debtDodger.debt} unpaid debt)
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C9A227] shrink-0" />
            <div>
              <div className="font-bold text-[#1D2B4F]">Skill Master</div>
              <div className="text-[#4C5A7A]">
                {skillMaster.name} (+RM{skillMaster.incomeBoost} salary bonus)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="btn-play-again"
          onClick={onPlayAgain}
          className="flex-1 py-3.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono font-semibold text-sm rounded border border-[#1B4332] flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Match (Choose Players)</span>
        </button>

        <button
          id="btn-rematch"
          onClick={onRematch}
          className="flex-1 py-3.5 bg-[#FFFDF8] hover:bg-[#EDE6D6] text-[#1D2B4F] font-mono font-semibold text-sm rounded border border-[#1D2B4F] flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <span>Rematch Same Roster</span>
        </button>
      </div>
    </div>
  );
};
