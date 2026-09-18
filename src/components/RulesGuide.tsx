import React from 'react';
import { BOARD_TILES, TILE_METADATA } from '../data/gameData';
import { BookOpen, ShieldAlert, Sparkles, TrendingUp, CheckCircle, HelpCircle } from 'lucide-react';

export const RulesGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-mono">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2.5 bg-[#EDE6D6] border border-[#C9A227] rounded-full mb-3 text-[#1B4332]">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332] mb-2">
          Money Moves Official Rulebook
        </h1>
        <p className="text-sm text-[#4C5A7A] max-w-xl mx-auto leading-relaxed">
          Everything you need to understand the mechanics, risks, returns, and strategies
          behind Money Moves.
        </p>
      </div>

      {/* Core Objective Card */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-6 mb-8 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-[#1D2B4F] mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#1B4332]" />
          Core Objective & Win Condition
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#4C5A7A] leading-relaxed">
          <p>
            Money Moves simulates the compounding impact of real-world personal finance decisions.
            The match lasts exactly <strong className="text-[#1D2B4F]">10 rounds</strong> for all players.
          </p>
          <div className="p-4 bg-[#EDE6D6] border border-[#B9AD8E] rounded text-[#122A22]">
            <div className="font-bold text-xs uppercase tracking-wider mb-1 text-[#A63D40]">
              The Golden Formula
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[#1B4332]">
              Net Worth = Total Cash On Hand &minus; Unpaid Debt
            </div>
            <p className="text-xs text-[#4C5A7A] mt-1.5">
              The player with the highest final Net Worth after 10 rounds is crowned the winner.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Rules: Debt & Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-5 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#A63D40] mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#A63D40]" />
            The 8% Debt Trap
          </h3>
          <p className="text-xs text-[#4C5A7A] leading-relaxed mb-3">
            Debt is not benign in Money Moves. Every single time you pass or land on the{' '}
            <strong className="text-[#1D2B4F]">Start</strong> tile, any outstanding debt balance
            accrues <strong className="text-[#A63D40]">8% compound interest</strong>.
          </p>
          <div className="text-xs bg-[#F7F3E9] p-3 rounded border border-[#D8CFBA] space-y-1">
            <div className="flex justify-between">
              <span>RM1,000 Debt after 1 Lap:</span>
              <span className="font-semibold text-[#A63D40]">RM1,080</span>
            </div>
            <div className="flex justify-between">
              <span>After 3 Laps:</span>
              <span className="font-semibold text-[#A63D40]">RM1,260</span>
            </div>
            <div className="flex justify-between">
              <span>After 6 Laps:</span>
              <span className="font-semibold text-[#A63D40]">RM1,587</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-5 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#1B4332] mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1B4332]" />
            Salary & Skill Up ROI
          </h3>
          <p className="text-xs text-[#4C5A7A] leading-relaxed mb-3">
            Every pass through Start credits a base salary of{' '}
            <strong className="text-[#1B4332]">+RM500</strong>. When you land on{' '}
            <strong className="text-[#1D2B4F]">Skill Up</strong>, you can invest RM250 to
            permanently raise all future salaries by <strong className="text-[#1B4332]">+RM100</strong>.
          </p>
          <div className="text-xs bg-[#F7F3E9] p-3 rounded border border-[#D8CFBA] space-y-1">
            <div className="flex justify-between">
              <span>Course Cost:</span>
              <span className="font-semibold text-[#1D2B4F]">RM250</span>
            </div>
            <div className="flex justify-between">
              <span>Breakeven Point:</span>
              <span className="font-semibold text-[#1B4332]">Pass Start 3 times (+RM300)</span>
            </div>
            <div className="flex justify-between">
              <span>10-Round Value:</span>
              <span className="font-semibold text-[#1B4332]">Up to +RM700 pure profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Board Tile Directory */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-6 shadow-xs mb-8">
        <h2 className="font-serif text-xl font-bold text-[#1D2B4F] mb-4">
          Tile Directory & Probabilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(TILE_METADATA).map(([key, meta]) => (
            <div
              key={key}
              className="p-3.5 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-start gap-3"
            >
              <div
                className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-base"
                style={{ backgroundColor: `${meta.accent}20`, color: meta.accent }}
              >
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-sm text-[#1D2B4F] mb-0.5">
                  {meta.label}
                </div>
                <p className="text-xs text-[#4C5A7A] leading-relaxed">{meta.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ / Pro Tips */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-[#1D2B4F] mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#C9A227]" />
          Grandmaster Financial Tips
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#4C5A7A] leading-relaxed">
          <li>
            <strong className="text-[#1D2B4F]">Keep an emergency fund:</strong> Always maintain at
            least RM400 in cash. Landing on Bills Due with less forces an emergency loan with an
            instant RM200 penalty charge!
          </li>
          <li>
            <strong className="text-[#1D2B4F]">Pay off debt early at The Bank:</strong> Since debt
            compounds at 8% each lap, stopping by The Bank to wipe out debt delivers an immediate
            guaranteed return on your capital.
          </li>
          <li>
            <strong className="text-[#1D2B4F]">Compound your human capital:</strong> Take Skill Up
            early in the match. The more laps remaining, the higher the ROI on that initial RM250
            investment.
          </li>
          <li>
            <strong className="text-[#1D2B4F]">Mind the shopping trap:</strong> Splurges (RM150)
            deplete liquidity without boosting net worth. If you are trailing in the final rounds,
            skip splurges to preserve your lead.
          </li>
        </ul>
      </div>
    </div>
  );
};
