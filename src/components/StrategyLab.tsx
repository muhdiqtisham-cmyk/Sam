import React from 'react';
import { Calculator, TrendingUp, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const StrategyLab: React.FC = () => {
  // Calculator 1: Debt Compounding
  const [debtInput, setDebtInput] = React.useState<number>(1000);

  // Calculator 2: Investment Simulator
  const [investSimBet, setInvestSimBet] = React.useState<number>(300);
  const [simResults, setSimResults] = React.useState<{
    trials: number;
    wins: number;
    losses: number;
    netGain: number;
    avgReturn: number;
  }>({ trials: 0, wins: 0, losses: 0, netGain: 0, avgReturn: 0 });

  const runSimulation = () => {
    let wins = 0;
    let losses = 0;
    let totalGain = 0;
    const trials = 100;

    for (let i = 0; i < trials; i++) {
      const isWin = Math.random() < 0.55;
      if (isWin) {
        wins++;
        const multiplier = 1.4 + Math.random() * 0.8;
        const gain = Math.round(investSimBet * multiplier) - investSimBet;
        totalGain += gain;
      } else {
        losses++;
        const lossPct = 0.3 + Math.random() * 0.5;
        const loss = Math.round(investSimBet * lossPct);
        totalGain -= loss;
      }
    }

    setSimResults({
      trials,
      wins,
      losses,
      netGain: totalGain,
      avgReturn: Math.round(totalGain / trials),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-mono">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2.5 bg-[#EDE6D6] border border-[#C9A227] rounded-full mb-3 text-[#1B4332]">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332] mb-2">
          Strategy Lab &amp; Calculators
        </h1>
        <p className="text-sm text-[#4C5A7A] max-w-xl mx-auto leading-relaxed">
          Test financial scenarios, forecast debt growth, and simulate market outcomes to maximize
          your winning odds in Money Moves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tool 1: Debt Compound Forecast */}
        <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#A63D40] mb-2">
              <ShieldAlert className="w-5 h-5" />
              Debt Compound Simulator
            </div>
            <p className="text-xs text-[#4C5A7A] mb-4">
              Unpaid debt grows by 8% every time you pass the Start tile. See how quickly liabilities accumulate.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-[#1D2B4F] block mb-1">
                Starting Debt Principal:
              </label>
              <div className="flex gap-2">
                {[500, 1000, 1500, 2000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDebtInput(val)}
                    className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                      debtInput === val
                        ? 'bg-[#A63D40] text-[#FFFDF8] border-[#A63D40] font-bold'
                        : 'bg-[#F7F3E9] text-[#1D2B4F] border-[#D8CFBA] hover:bg-[#EDE6D6]'
                    }`}
                  >
                    RM{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Projection Table */}
            <div className="bg-[#F7F3E9] p-3 rounded border border-[#D8CFBA] text-xs space-y-1.5">
              {[1, 2, 4, 6, 8].map((laps) => {
                const projected = Math.round(debtInput * Math.pow(1.08, laps));
                const accrued = projected - debtInput;
                return (
                  <div key={laps} className="flex justify-between items-center">
                    <span className="text-[#4C5A7A]">{laps} Laps around board:</span>
                    <div className="text-right">
                      <span className="font-bold text-[#A63D40]">RM{projected.toLocaleString()}</span>
                      <span className="text-[10px] text-[#4C5A7A] ml-1.5">(+RM{accrued})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D8CFBA] text-[11px] text-[#A63D40]">
            Takeaway: Clearing debt at The Bank early prevents hundreds in compound losses.
          </div>
        </div>

        {/* Tool 2: Investment Monte Carlo Simulator */}
        <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#1B4332] mb-2">
              <TrendingUp className="w-5 h-5" />
              Investment Monte Carlo (100 Trials)
            </div>
            <p className="text-xs text-[#4C5A7A] mb-4">
              Investments in the game have a 55% win rate (1.4x-2.2x return) and 45% loss rate
              (0.3x-0.8x dip). Simulate 100 rounds.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-[#1D2B4F] block mb-1">
                Select Investment Bet Size:
              </label>
              <div className="flex gap-2">
                {[300, 600].map((bet) => (
                  <button
                    key={bet}
                    onClick={() => setInvestSimBet(bet)}
                    className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                      investSimBet === bet
                        ? 'bg-[#1B4332] text-[#FFFDF8] border-[#1B4332] font-bold'
                        : 'bg-[#F7F3E9] text-[#1D2B4F] border-[#D8CFBA] hover:bg-[#EDE6D6]'
                    }`}
                  >
                    RM{bet} Bet
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={runSimulation}
              className="w-full py-2 bg-[#C9A227] hover:bg-[#B08F1E] text-[#122A22] font-semibold text-xs rounded border border-[#B08F1E] flex items-center justify-center gap-2 cursor-pointer transition-colors mb-4"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate 100 Market Events</span>
            </button>

            {/* Results */}
            {simResults.trials > 0 ? (
              <div className="bg-[#F7F3E9] p-3 rounded border border-[#D8CFBA] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#4C5A7A]">Profitable Runs:</span>
                  <span className="font-bold text-[#1B4332]">{simResults.wins} of 100 ({simResults.wins}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4C5A7A]">Market Pullbacks:</span>
                  <span className="font-bold text-[#A63D40]">{simResults.losses} of 100</span>
                </div>
                <div className="flex justify-between border-t border-[#D8CFBA] pt-1 font-bold">
                  <span className="text-[#1D2B4F]">Cumulative Net Profit:</span>
                  <span className={simResults.netGain >= 0 ? 'text-[#1B4332]' : 'text-[#A63D40]'}>
                    {simResults.netGain >= 0 ? '+' : ''}RM{simResults.netGain.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#4C5A7A] italic bg-[#F7F3E9] rounded border border-[#D8CFBA]">
                Click simulate to execute 100 randomized trials.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D8CFBA] text-[11px] text-[#1B4332]">
            Takeaway: Because the win rate is 55% with 1.4x-2.2x multipliers, long-term expected value is positive!
          </div>
        </div>
      </div>

      {/* Tool 3: Skill Up Payback Table */}
      <div className="bg-[#FFFDF8] border border-[#D8CFBA] rounded-lg p-6 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-[#1D2B4F] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C9A227]" />
          Skill Up Break-Even Matrix
        </h3>
        <p className="text-xs text-[#4C5A7A] mb-4">
          Each Skill Up costs RM250 upfront and adds +RM100 to every future salary. Compare the cumulative net return across different acquisition rounds.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#D8CFBA] text-[#1D2B4F]">
                <th className="py-2 pr-4">Acquired At</th>
                <th className="py-2 px-3">Laps Left</th>
                <th className="py-2 px-3">Cost</th>
                <th className="py-2 px-3">Salary Bonus</th>
                <th className="py-2 pl-4 text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CFBA]/50">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-[#1D2B4F]">Round 1 (Early)</td>
                <td className="py-2.5 px-3">9 Laps</td>
                <td className="py-2.5 px-3 text-[#A63D40]">RM250</td>
                <td className="py-2.5 px-3 text-[#1B4332]">+RM900</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#1B4332]">+RM650 (+260% ROI)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-[#1D2B4F]">Round 4 (Mid)</td>
                <td className="py-2.5 px-3">6 Laps</td>
                <td className="py-2.5 px-3 text-[#A63D40]">RM250</td>
                <td className="py-2.5 px-3 text-[#1B4332]">+RM600</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#1B4332]">+RM350 (+140% ROI)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-[#1D2B4F]">Round 7 (Late)</td>
                <td className="py-2.5 px-3">3 Laps</td>
                <td className="py-2.5 px-3 text-[#A63D40]">RM250</td>
                <td className="py-2.5 px-3 text-[#1B4332]">+RM300</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#1B4332]">+RM50 (Breakeven)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-[#1D2B4F]">Round 9 (Endgame)</td>
                <td className="py-2.5 px-3">1 Lap</td>
                <td className="py-2.5 px-3 text-[#A63D40]">RM250</td>
                <td className="py-2.5 px-3 text-[#1B4332]">+RM100</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#A63D40]">-RM150 (Net Loss)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
