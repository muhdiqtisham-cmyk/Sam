import React from 'react';
import { Player } from '../types';
import { PLAYER_COLORS, BOT_PROFILES } from '../data/gameData';
import { Users, Play, Sparkles, UserCheck, Bot } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (players: Player[]) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = React.useState<number>(5);
  const [playerConfigs, setPlayerConfigs] = React.useState<
    Array<{ name: string; isComputer: boolean; playStyle: 'conservative' | 'aggressive' | 'balanced' | 'gambler' }>
  >([
    { name: 'Player 1', isComputer: false, playStyle: 'balanced' },
    { name: 'Player 2', isComputer: false, playStyle: 'balanced' },
    { name: 'Player 3', isComputer: false, playStyle: 'balanced' },
    { name: 'Player 4', isComputer: false, playStyle: 'balanced' },
    { name: 'Player 5', isComputer: false, playStyle: 'balanced' },
    { name: 'Player 6', isComputer: false, playStyle: 'balanced' },
  ]);

  const updateName = (index: number, name: string) => {
    setPlayerConfigs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name };
      return next;
    });
  };

  const toggleComputer = (index: number) => {
    setPlayerConfigs((prev) => {
      const next = [...prev];
      const nextIsComputer = !next[index].isComputer;
      let defaultName = next[index].name;
      if (nextIsComputer) {
        const botName = BOT_PROFILES[index % BOT_PROFILES.length].name;
        defaultName = botName;
      } else if (defaultName === BOT_PROFILES[index % BOT_PROFILES.length].name) {
        defaultName = `Player ${index + 1}`;
      }
      next[index] = {
        ...next[index],
        isComputer: nextIsComputer,
        name: defaultName,
        playStyle: BOT_PROFILES[index % BOT_PROFILES.length].style,
      };
      return next;
    });
  };

  const setPreset = (type: 'all-human' | 'solo-rivals' | 'high-rollers') => {
    if (type === 'all-human') {
      setPlayerCount(5);
      setPlayerConfigs([
        { name: 'Player 1', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 2', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 3', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 4', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 5', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 6', isComputer: false, playStyle: 'balanced' },
      ]);
    } else if (type === 'solo-rivals') {
      setPlayerCount(4);
      setPlayerConfigs([
        { name: 'You (Host)', isComputer: false, playStyle: 'balanced' },
        { name: 'Taylor', isComputer: true, playStyle: 'conservative' },
        { name: 'Jordan', isComputer: true, playStyle: 'gambler' },
        { name: 'Morgan', isComputer: true, playStyle: 'balanced' },
        { name: 'Casey', isComputer: true, playStyle: 'aggressive' },
        { name: 'Riley', isComputer: true, playStyle: 'balanced' },
      ]);
    } else if (type === 'high-rollers') {
      setPlayerCount(2);
      setPlayerConfigs([
        { name: 'High Roller 1', isComputer: false, playStyle: 'aggressive' },
        { name: 'High Roller 2', isComputer: false, playStyle: 'aggressive' },
        { name: 'Player 3', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 4', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 5', isComputer: false, playStyle: 'balanced' },
        { name: 'Player 6', isComputer: false, playStyle: 'balanced' },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activePlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const cfg = playerConfigs[i];
      const finalName = cfg.name.trim() || `Player ${i + 1}`;
      activePlayers.push({
        id: i,
        name: finalName,
        color: PLAYER_COLORS[i].hex,
        isComputer: cfg.isComputer,
        playStyle: cfg.playStyle,
        cash: 2000,
        debt: 0,
        position: 0,
        incomeBoost: 0,
        shopCount: 0,
        investCount: 0,
        skillCount: 0,
      });
    }
    onStartGame(activePlayers);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1B4332]">
            Money Moves
          </span>
          <span className="text-sm font-mono px-2 py-0.5 rounded bg-[#EDE6D6] text-[#A63D40] font-bold border border-[#D8CFBA]">
            RM
          </span>
        </div>
        <p className="text-[#4C5A7A] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          A board game about the small decisions that build — or wreck — a bank account. Roll the
          dice, choose your financial path, and survive 10 rounds. Highest net worth wins.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs text-[#4C5A7A] uppercase tracking-wider font-semibold">
            Quick setups:
          </span>
          <button
            type="button"
            onClick={() => setPreset('all-human')}
            className="px-2.5 py-1 text-xs font-mono bg-[#FFFDF8] hover:bg-[#EDE6D6] border border-[#D8CFBA] rounded text-[#1D2B4F] transition-colors"
          >
            Classic 5 Friends
          </button>
          <button
            type="button"
            onClick={() => setPreset('solo-rivals')}
            className="px-2.5 py-1 text-xs font-mono bg-[#FFFDF8] hover:bg-[#EDE6D6] border border-[#D8CFBA] rounded text-[#1D2B4F] transition-colors"
          >
            Solo vs 3 Rivals
          </button>
          <button
            type="button"
            onClick={() => setPreset('high-rollers')}
            className="px-2.5 py-1 text-xs font-mono bg-[#FFFDF8] hover:bg-[#EDE6D6] border border-[#D8CFBA] rounded text-[#1D2B4F] transition-colors"
          >
            1v1 High Rollers
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#FFFDF8] border border-[#D8CFBA] p-6 sm:p-8 rounded-lg shadow-xs">
        {/* Step 1: Player Count */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="font-serif text-lg font-semibold text-[#1D2B4F] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1B4332]" />
              How many players?
            </label>
            <span className="text-xs font-mono text-[#4C5A7A]">Standard table: 5 to 6</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                id={`player-count-${num}`}
                onClick={() => setPlayerCount(num)}
                className={`py-3 px-2 text-center rounded border font-serif text-lg transition-all ${
                  playerCount === num
                    ? 'bg-[#C9A227] text-[#122A22] border-[#C9A227] font-bold shadow-xs'
                    : 'bg-[#FFFDF8] text-[#1D2B4F] border-[#D8CFBA] hover:bg-[#EDE6D6]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Player Profiles */}
        <div className="mb-8">
          <label className="font-serif text-lg font-semibold text-[#1D2B4F] block mb-3">
            Player Roster & Controls
          </label>

          <div className="space-y-2.5">
            {Array.from({ length: playerCount }).map((_, idx) => {
              const cfg = playerConfigs[idx];
              const colorInfo = PLAYER_COLORS[idx];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 bg-[#F7F3E9] border border-[#D8CFBA] rounded"
                >
                  {/* Color dot */}
                  <div
                    className="w-5 h-5 rounded-full shrink-0 border-2 border-[#1D2B4F]"
                    style={{ backgroundColor: colorInfo.hex }}
                    title={colorInfo.name}
                  />

                  {/* Player Name Input */}
                  <input
                    type="text"
                    id={`player-name-input-${idx}`}
                    value={cfg.name}
                    onChange={(e) => updateName(idx, e.target.value)}
                    maxLength={18}
                    placeholder={`Player ${idx + 1}`}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-[#1D2B4F] text-sm font-mono text-[#1D2B4F] px-1 py-1 focus:outline-none"
                  />

                  {/* Human / Computer toggle */}
                  <button
                    type="button"
                    id={`toggle-computer-${idx}`}
                    onClick={() => toggleComputer(idx)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                      cfg.isComputer
                        ? 'bg-[#EDE6D6] text-[#6E7B3A] border-[#B9AD8E] font-medium'
                        : 'bg-[#FFFDF8] text-[#4C5A7A] border-[#D8CFBA] hover:text-[#1D2B4F]'
                    }`}
                    title={cfg.isComputer ? 'Automated computer player' : 'Human player'}
                  >
                    {cfg.isComputer ? (
                      <>
                        <Bot className="w-3.5 h-3.5" />
                        <span>Bot</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Human</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Game Button */}
        <button
          type="submit"
          id="btn-start-game"
          className="w-full py-4 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] font-mono text-base font-semibold rounded border border-[#1B4332] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Match (10 Rounds)</span>
        </button>

        {/* Rules Summary Pill */}
        <div className="mt-6 pt-5 border-t border-[#D8CFBA] text-xs text-[#4C5A7A] leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-[#1D2B4F] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            Game Rules Snapshot
          </div>
          Everyone starts with <strong className="text-[#1D2B4F]">RM2,000 cash</strong> and{' '}
          <strong className="text-[#1D2B4F]">RM0 debt</strong>. Fixed monthly bills are{' '}
          <strong className="text-[#A63D40]">RM400</strong>. Passing Start collects{' '}
          <strong className="text-[#1B4332]">+RM500 salary</strong> but debt charges an aggressive{' '}
          <strong className="text-[#A63D40]">8% compound interest</strong>. Survive 10 rounds to crown the highest net worth.
        </div>
      </form>
    </div>
  );
};
