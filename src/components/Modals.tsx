import React from 'react';
import { Player, TileType, ChanceEvent } from '../types';
import {
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Building,
  GraduationCap,
  ShoppingBag,
  Sparkles,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

interface TileModalProps {
  type: TileType;
  player: Player;
  onClose: () => void;
  onPayBills: (amount: number, emergencyLoan: boolean) => void;
  onCollectPayday: (amount: number) => void;
  onInvest: (amount: number) => void;
  onSkipInvest: () => void;
  onBankAction: (action: 'pay' | 'loan' | 'skip', amount?: number) => void;
  onSkillAction: (accept: boolean) => void;
  onShopAction: (buy: boolean) => void;
  chanceEvent?: ChanceEvent | null;
  onResolveChance: (event: ChanceEvent) => void;
}

export const TileModal: React.FC<TileModalProps> = ({
  type,
  player,
  onClose,
  onPayBills,
  onCollectPayday,
  onInvest,
  onSkipInvest,
  onBankAction,
  onSkillAction,
  onShopAction,
  chanceEvent,
  onResolveChance,
}) => {
  // Common container
  const renderContainer = (
    badgeText: string,
    badgeColor: string,
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <div className="fixed inset-0 z-50 bg-[#122A22]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FFFDF8] border border-[#1D2B4F] max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-xl animate-pop relative">
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className={`text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${badgeColor}`}
          >
            {badgeText}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#4C5A7A]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: player.color }}
            />
            <span>{player.name}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2 text-[#1B4332]">
          {icon}
          <h3 className="font-serif text-xl sm:text-2xl font-bold">{title}</h3>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );

  switch (type) {
    case 'START':
      return renderContainer(
        'Home Base',
        'bg-[#EDE6D6] text-[#C9A227] border-[#C9A227]',
        'Back at Start',
        <Building className="w-5 h-5 text-[#C9A227]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-4">
            You completed a loop around the board. Your regular salary (+RM
            {500 + player.incomeBoost}) was credited as you crossed Start.
          </p>
          {player.debt > 0 && (
            <div className="p-3 bg-[#EDE6D6]/60 border border-[#D8CFBA] rounded text-xs text-[#A63D40] mb-4">
              <strong>Interest Alert:</strong> Your debt has compounded by 8% this lap. Consider
              paying it down next time you hit The Bank!
            </div>
          )}
          <button
            id="modal-continue-btn"
            onClick={onClose}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
          >
            Continue Momentum
          </button>
        </div>
      );

    case 'BILLS': {
      const billAmount = 400;
      const canAfford = player.cash >= billAmount;
      const shortage = billAmount - player.cash;
      const loanNeeded = shortage + 200; // emergency loan penalty

      return renderContainer(
        'Mandatory Expense',
        'bg-[#EDE6D6] text-[#A63D40] border-[#A63D40]',
        'Bills Due',
        <AlertOctagon className="w-5 h-5 text-[#A63D40]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-4">
            Rent and utilities are due: <strong className="text-[#A63D40]">RM400</strong>.
          </p>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded text-xs font-mono mb-4 space-y-1">
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Cash on hand:</span>
              <span className="font-semibold text-[#1D2B4F]">RM{player.cash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Bill requirement:</span>
              <span className="font-semibold text-[#A63D40]">-RM400</span>
            </div>
            {!canAfford && (
              <div className="pt-2 border-t border-[#D8CFBA] text-[#A63D40]">
                ⚠️ Insufficient cash! The bank will cover this with an emergency loan of{' '}
                <strong>RM{loanNeeded}</strong> (RM{shortage} shortage + RM200 bank penalty fee).
              </div>
            )}
          </div>

          <button
            id="modal-pay-bills-btn"
            onClick={() => onPayBills(billAmount, !canAfford)}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
          >
            {canAfford ? 'Pay RM400 Bills' : `Accept RM${loanNeeded} Emergency Loan`}
          </button>
        </div>
      );
    }

    case 'PAYDAY': {
      // Random side income RM200 - RM400
      const earned = 200 + Math.floor(Math.random() * 200);
      return renderContainer(
        'Side Hustle',
        'bg-[#EDE6D6] text-[#1B4332] border-[#1B4332]',
        'Side Income Payout',
        <DollarSign className="w-5 h-5 text-[#1B4332]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-4">
            An extracurricular gig or dividend distribution paid out this week!
          </p>
          <div className="p-4 bg-[#EDE6D6] border border-[#C9A227] rounded text-center mb-4">
            <span className="text-xs font-mono uppercase text-[#4C5A7A] block mb-1">
              Received Earnings
            </span>
            <span className="font-serif text-3xl font-bold text-[#1B4332]">+RM{earned}</span>
          </div>
          <button
            id="modal-collect-payday-btn"
            onClick={() => onCollectPayday(earned)}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
          >
            Deposit into Account
          </button>
        </div>
      );
    }

    case 'INVEST':
      return renderContainer(
        'Financial Market',
        'bg-[#EDE6D6] text-[#1B4332] border-[#1B4332]',
        'Investment Corner',
        <TrendingUp className="w-5 h-5 text-[#1B4332]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-3">
            Put capital to work. 55% chance to hit a market bull run (40% to 120% gain); 45% chance of a market pullback.
          </p>

          <div className="text-xs font-mono text-[#4C5A7A] mb-4">
            Available Cash: <strong className="text-[#1D2B4F]">RM{player.cash}</strong>
          </div>

          <div className="space-y-2">
            <button
              id="modal-invest-300-btn"
              disabled={player.cash < 300}
              onClick={() => onInvest(300)}
              className="w-full py-2.5 px-3 bg-[#FFFDF8] hover:bg-[#EDE6D6] disabled:opacity-40 disabled:hover:bg-[#FFFDF8] border border-[#1D2B4F] text-[#1D2B4F] font-mono text-sm font-medium rounded flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Invest RM300 (Moderate)</span>
              <span className="text-xs text-[#1B4332] font-semibold">High upside</span>
            </button>

            <button
              id="modal-invest-600-btn"
              disabled={player.cash < 600}
              onClick={() => onInvest(600)}
              className="w-full py-2.5 px-3 bg-[#FFFDF8] hover:bg-[#EDE6D6] disabled:opacity-40 disabled:hover:bg-[#FFFDF8] border border-[#1D2B4F] text-[#1D2B4F] font-mono text-sm font-medium rounded flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Invest RM600 (Aggressive)</span>
              <span className="text-xs text-[#1B4332] font-semibold">Maximum growth</span>
            </button>

            <button
              id="modal-invest-skip-btn"
              onClick={onSkipInvest}
              className="w-full py-2 px-3 text-[#4C5A7A] hover:text-[#1D2B4F] font-mono text-xs text-center block cursor-pointer"
            >
              Pass & Keep Cash Liquid
            </button>
          </div>
        </div>
      );

    case 'BANK': {
      const payableDebt = Math.min(player.debt, player.cash, 1000);
      return renderContainer(
        'Commercial Institution',
        'bg-[#EDE6D6] text-[#C9A227] border-[#C9A227]',
        'The Bank',
        <Building className="w-5 h-5 text-[#C9A227]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-3">
            Visit the branch counter to clear compounding debt or request working capital.
          </p>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded text-xs font-mono space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Current Debt:</span>
              <span className="font-semibold text-[#A63D40]">RM{player.debt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Cash on hand:</span>
              <span className="font-semibold text-[#1D2B4F]">RM{player.cash}</span>
            </div>
          </div>

          <div className="space-y-2">
            {player.debt > 0 && payableDebt > 0 && (
              <button
                id="modal-bank-pay-btn"
                onClick={() => onBankAction('pay', payableDebt)}
                className="w-full py-2.5 px-3 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
              >
                Pay Down RM{payableDebt} Debt
              </button>
            )}

            <button
              id="modal-bank-loan-btn"
              onClick={() => onBankAction('loan', 1000)}
              className="w-full py-2.5 px-3 bg-[#FFFDF8] hover:bg-[#EDE6D6] border border-[#1D2B4F] text-[#1D2B4F] font-mono text-sm font-medium rounded cursor-pointer transition-colors"
            >
              Take RM1,000 Bank Loan
            </button>

            <button
              id="modal-bank-skip-btn"
              onClick={() => onBankAction('skip')}
              className="w-full py-2 px-3 text-[#4C5A7A] hover:text-[#1D2B4F] font-mono text-xs text-center block cursor-pointer"
            >
              Leave Accounts As Is
            </button>
          </div>
        </div>
      );
    }

    case 'SKILL': {
      const cost = 250;
      const canAfford = player.cash >= cost;
      return renderContainer(
        'Self Development',
        'bg-[#EDE6D6] text-[#1B4332] border-[#1B4332]',
        'Skill Up Certification',
        <GraduationCap className="w-5 h-5 text-[#1B4332]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-3">
            Invest in career training! Pay <strong className="text-[#1D2B4F]">RM{cost}</strong> today
            to permanently add <strong className="text-[#1B4332]">+RM100</strong> to your salary
            every single time you pass Start.
          </p>

          <div className="p-3 bg-[#F7F3E9] border border-[#D8CFBA] rounded text-xs font-mono space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Current boost:</span>
              <span className="font-semibold text-[#1B4332]">+RM{player.incomeBoost}/salary</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4C5A7A]">Boost after course:</span>
              <span className="font-semibold text-[#1B4332]">+RM{player.incomeBoost + 100}/salary</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="modal-skill-enroll-btn"
              disabled={!canAfford}
              onClick={() => onSkillAction(true)}
              className="flex-1 py-2.5 bg-[#1B4332] hover:bg-[#122A22] disabled:opacity-40 text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
            >
              {canAfford ? 'Enroll (RM250)' : 'Cannot Afford (RM250)'}
            </button>
            <button
              id="modal-skill-skip-btn"
              onClick={() => onSkillAction(false)}
              className="px-4 py-2.5 border border-[#B9AD8E] bg-[#FFFDF8] hover:bg-[#EDE6D6] text-[#4C5A7A] font-mono text-sm rounded cursor-pointer transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      );
    }

    case 'SHOP': {
      const cost = 150;
      const canAfford = player.cash >= cost;
      return renderContainer(
        'Lifestyle Choice',
        'bg-[#EDE6D6] text-[#A63D40] border-[#A63D40]',
        'Shopping Temptation',
        <ShoppingBag className="w-5 h-5 text-[#A63D40]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-4">
            A flashy gadget or luxury dining experience catches your eye. Costs{' '}
            <strong className="text-[#A63D40]">RM150</strong>. Pure personal enjoyment with zero financial return.
          </p>

          <div className="flex gap-2">
            <button
              id="modal-shop-buy-btn"
              disabled={!canAfford}
              onClick={() => onShopAction(true)}
              className="flex-1 py-2.5 bg-[#A63D40] hover:bg-[#702527] disabled:opacity-40 text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
            >
              {canAfford ? 'Treat Yourself (-RM150)' : 'No Cash for Splurge'}
            </button>
            <button
              id="modal-shop-skip-btn"
              onClick={() => onShopAction(false)}
              className="flex-1 py-2.5 border border-[#1B4332] bg-[#FFFDF8] hover:bg-[#EDE6D6] text-[#1B4332] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
            >
              Resist & Save
            </button>
          </div>
        </div>
      );
    }

    case 'CHANCE':
    case 'CHANCEHUB': {
      const isHub = type === 'CHANCEHUB';
      const event = chanceEvent;
      return renderContainer(
        isHub ? "Fortune's Corner" : 'Chance Card',
        isHub ? 'bg-[#EDE6D6] text-[#122A22] border-[#122A22]' : 'bg-[#EDE6D6] text-[#4C5A7A] border-[#4C5A7A]',
        isHub ? 'Major Financial Twist' : 'Unexpected Event',
        <Sparkles className="w-5 h-5 text-[#C9A227]" />,
        <div>
          <div className="p-4 bg-[#EDE6D6]/50 border border-[#D8CFBA] rounded my-4 text-center">
            <p className="font-serif text-lg text-[#1D2B4F] leading-snug">
              {event ? event.text : 'A financial twist unfolds...'}
            </p>
          </div>

          <button
            id="modal-chance-ok-btn"
            onClick={() => event && onResolveChance(event)}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      );
    }

    case 'REST':
      return renderContainer(
        'Weekend Pause',
        'bg-[#EDE6D6] text-[#4C5A7A] border-[#4C5A7A]',
        'Payday Weekend',
        <Coffee className="w-5 h-5 text-[#4C5A7A]" />,
        <div>
          <p className="text-[#4C5A7A] text-sm leading-relaxed mb-4">
            Nothing owed, nothing gained. Take a deep breath and review your balance sheet before
            the next lap begins.
          </p>
          <button
            id="modal-rest-continue-btn"
            onClick={onClose}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-sm font-semibold rounded cursor-pointer transition-colors"
          >
            Enjoy the Weekend
          </button>
        </div>
      );

    default:
      return null;
  }
};
