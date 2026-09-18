import React from 'react';
import { Player, TileType, LogEntry, ChanceEvent, GameView } from './types';
import { BOARD_TILES, CHANCE_EVENTS, CHANCEHUB_EVENTS, TILE_METADATA } from './data/gameData';
import { Navbar } from './components/Navbar';
import { SetupScreen } from './components/SetupScreen';
import { GameBoard } from './components/GameBoard';
import { PlayerCard } from './components/PlayerCard';
import { ActivityLog } from './components/ActivityLog';
import { TileModal } from './components/Modals';
import { FinalLedger } from './components/FinalLedger';
import { RulesGuide } from './components/RulesGuide';
import { StrategyLab } from './components/StrategyLab';
import { ShareModal } from './components/ShareModal';
import {
  playDiceRollSound,
  playCashSound,
  playDebtWarningSound,
  playStepSound,
  toggleAudioMute,
  getIsAudioMuted,
} from './utils/audio';

const TOTAL_ROUNDS = 10;
const DEBT_INTEREST_RATE = 0.08;

export default function App() {
  const [currentView, setCurrentView] = React.useState<GameView>('game');
  const [isSetup, setIsSetup] = React.useState<boolean>(true);
  const [isShareOpen, setIsShareOpen] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(false);
  const [speed, setSpeed] = React.useState<'normal' | 'fast'>('normal');

  // Game state
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = React.useState<number>(0);
  const [currentRound, setCurrentRound] = React.useState<number>(1);
  const [totalTurnsTaken, setTotalTurnsTaken] = React.useState<number>(0);
  const [dice, setDice] = React.useState<[number, number]>([1, 1]);
  const [isRolling, setIsRolling] = React.useState<boolean>(false);
  const [canRoll, setCanRoll] = React.useState<boolean>(true);
  const [activeModal, setActiveModal] = React.useState<{
    type: TileType;
    chanceEvent?: ChanceEvent;
  } | null>(null);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);

  // Sound mute toggle
  const handleToggleMute = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
  };

  // Add a log entry helper
  const addLog = (
    text: string,
    type: LogEntry['type'] = 'neutral',
    playerName?: string,
    playerId?: number
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        round: currentRound,
        timestamp,
        playerId,
        playerName,
        text,
        type,
      },
    ]);
  };

  // Start new game from setup
  const handleStartGame = (initialPlayers: Player[]) => {
    setPlayers(initialPlayers);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
    setTotalTurnsTaken(0);
    setDice([1, 1]);
    setIsRolling(false);
    setCanRoll(true);
    setActiveModal(null);
    setIsGameOver(false);
    setIsSetup(false);
    setLogs([]);

    addLog(
      `Match initiated with ${initialPlayers.length} players. Starting fund: RM2,000 each. 10 rounds to establish net worth champion.`,
      'gain'
    );
  };

  // Reset or rematch
  const handleResetGame = () => {
    setIsSetup(true);
    setIsGameOver(false);
  };

  const handleRematch = () => {
    if (players.length === 0) {
      setIsSetup(true);
      return;
    }
    const freshPlayers: Player[] = players.map((p) => ({
      ...p,
      cash: 2000,
      debt: 0,
      position: 0,
      incomeBoost: 0,
      shopCount: 0,
      investCount: 0,
      skillCount: 0,
    }));
    handleStartGame(freshPlayers);
  };

  // Roll dice
  const handleRollDice = () => {
    if (!canRoll || isRolling || isGameOver) return;

    setCanRoll(false);
    setIsRolling(true);
    playDiceRollSound();

    let ticks = 0;
    const maxTicks = speed === 'fast' ? 4 : 8;
    const intervalTime = speed === 'fast' ? 40 : 70;

    const spin = setInterval(() => {
      const tempD1 = 1 + Math.floor(Math.random() * 6);
      const tempD2 = 1 + Math.floor(Math.random() * 6);
      setDice([tempD1, tempD2]);
      ticks++;

      if (ticks >= maxTicks) {
        clearInterval(spin);
        setIsRolling(false);

        const d1 = 1 + Math.floor(Math.random() * 6);
        const d2 = 1 + Math.floor(Math.random() * 6);
        setDice([d1, d2]);

        const totalSteps = d1 + d2;
        const activePlayer = players[currentTurnIndex];

        addLog(
          `Rolled ${d1} + ${d2} = ${totalSteps} spaces.`,
          'turn',
          activePlayer.name,
          activePlayer.id
        );

        animatePlayerMovement(activePlayer.id, totalSteps);
      }
    }, intervalTime);
  };

  // Step by step animation around 24 tiles
  const animatePlayerMovement = (playerId: number, stepsRemaining: number) => {
    const stepDelay = speed === 'fast' ? 65 : 130;

    const stepOnce = (remaining: number) => {
      if (remaining <= 0) {
        // Land on tile
        setPlayers((prev) => {
          const p = prev.find((item) => item.id === playerId);
          if (p) {
            handleTileLanding(p);
          }
          return prev;
        });
        return;
      }

      setPlayers((prev) => {
        return prev.map((p) => {
          if (p.id !== playerId) return p;

          const oldPos = p.position;
          const newPos = (oldPos + 1) % 24;

          playStepSound();

          // Check if passed Start (pos 0)
          if (newPos === 0) {
            const salary = 500 + p.incomeBoost;
            let updatedDebt = p.debt;
            let debtNote = '';

            if (p.debt > 0) {
              const prevDebt = p.debt;
              updatedDebt = Math.round(p.debt * (1 + DEBT_INTEREST_RATE));
              debtNote = ` Unpaid debt accrued 8% interest: RM${prevDebt} -> RM${updatedDebt}.`;
              playDebtWarningSound();
            } else {
              playCashSound();
            }

            addLog(
              `Passed Start: Collected +RM${salary} salary.${debtNote}`,
              p.debt > 0 ? 'debt' : 'gain',
              p.name,
              p.id
            );

            return {
              ...p,
              position: newPos,
              cash: p.cash + salary,
              debt: updatedDebt,
            };
          }

          return { ...p, position: newPos };
        });
      });

      setTimeout(() => stepOnce(remaining - 1), stepDelay);
    };

    stepOnce(stepsRemaining);
  };

  // Land on tile
  const handleTileLanding = (player: Player) => {
    const tile = BOARD_TILES[player.position];
    const tileType = tile.type;

    if (!player.isComputer) {
      // Human turn: open interactive decision modal
      if (tileType === 'CHANCE') {
        const ev = CHANCE_EVENTS[Math.floor(Math.random() * CHANCE_EVENTS.length)];
        setActiveModal({ type: 'CHANCE', chanceEvent: ev });
      } else if (tileType === 'CHANCEHUB') {
        const ev = CHANCEHUB_EVENTS[Math.floor(Math.random() * CHANCEHUB_EVENTS.length)];
        setActiveModal({ type: 'CHANCEHUB', chanceEvent: ev });
      } else {
        setActiveModal({ type: tileType });
      }
    } else {
      // Automated computer turn: apply algorithmic decision based on bot playStyle
      handleBotDecision(player, tileType);
    }
  };

  // Bot logic
  const handleBotDecision = (bot: Player, tileType: TileType) => {
    const botDelay = speed === 'fast' ? 400 : 700;

    setTimeout(() => {
      switch (tileType) {
        case 'START':
          addLog(`Landed squarely on Start. Maintaining current momentum.`, 'neutral', bot.name, bot.id);
          finishTurn();
          break;

        case 'BILLS': {
          const bill = 400;
          if (bot.cash >= bill) {
            setPlayers((prev) =>
              prev.map((p) => (p.id === bot.id ? { ...p, cash: p.cash - bill } : p))
            );
            addLog(`Paid monthly overhead bills: -RM${bill}.`, 'loss', bot.name, bot.id);
          } else {
            const short = bill - bot.cash;
            const emergencyLoan = short + 200;
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === bot.id ? { ...p, cash: 0, debt: p.debt + emergencyLoan } : p
              )
            );
            playDebtWarningSound();
            addLog(
              `Could not cover RM${bill} bills — forced to take emergency bank loan of RM${emergencyLoan}.`,
              'debt',
              bot.name,
              bot.id
            );
          }
          finishTurn();
          break;
        }

        case 'PAYDAY': {
          const earned = 200 + Math.floor(Math.random() * 200);
          setPlayers((prev) =>
            prev.map((p) => (p.id === bot.id ? { ...p, cash: p.cash + earned } : p))
          );
          playCashSound();
          addLog(`Earned extra freelance income: +RM${earned}.`, 'gain', bot.name, bot.id);
          finishTurn();
          break;
        }

        case 'INVEST': {
          // Check willingness based on playStyle
          const shouldInvest =
            bot.playStyle === 'gambler'
              ? bot.cash >= 300
              : bot.playStyle === 'conservative'
              ? bot.cash >= 1200
              : bot.cash >= 600;

          if (shouldInvest) {
            const bet = bot.cash >= 600 && bot.playStyle !== 'conservative' ? 600 : 300;
            executeInvestment(bot, bet);
          } else {
            addLog(`Passed on investment opportunity to keep cash liquid.`, 'neutral', bot.name, bot.id);
            finishTurn();
          }
          break;
        }

        case 'BANK': {
          // If debt exists and cash is comfortable, pay down
          if (bot.debt > 0 && bot.cash >= 600) {
            const payAmt = Math.min(bot.debt, bot.cash - 300, 1000);
            if (payAmt > 0) {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === bot.id ? { ...p, cash: p.cash - payAmt, debt: p.debt - payAmt } : p
                )
              );
              playCashSound();
              addLog(`Visited The Bank: Paid down RM${payAmt} of debt.`, 'gain', bot.name, bot.id);
              finishTurn();
              return;
            }
          }
          addLog(`Checked in at The Bank; kept balances as is.`, 'neutral', bot.name, bot.id);
          finishTurn();
          break;
        }

        case 'SKILL': {
          const cost = 250;
          if (bot.cash >= 500) {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === bot.id
                  ? {
                      ...p,
                      cash: p.cash - cost,
                      incomeBoost: p.incomeBoost + 100,
                      skillCount: p.skillCount + 1,
                    }
                  : p
              )
            );
            playCashSound();
            addLog(
              `Enrolled in Skill Up course (-RM${cost}). Permanent salary raised by +RM100!`,
              'gain',
              bot.name,
              bot.id
            );
          } else {
            addLog(`Skipped Skill Up to preserve cash reserve.`, 'neutral', bot.name, bot.id);
          }
          finishTurn();
          break;
        }

        case 'SHOP': {
          const cost = 150;
          const willShop =
            (bot.playStyle === 'gambler' || bot.playStyle === 'aggressive') && bot.cash >= 800;
          if (willShop) {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === bot.id ? { ...p, cash: p.cash - cost, shopCount: p.shopCount + 1 } : p
              )
            );
            addLog(`Gave in to Shopping Temptation: Splurged RM${cost}.`, 'loss', bot.name, bot.id);
          } else {
            addLog(`Resisted Shopping Temptation and preserved cash.`, 'neutral', bot.name, bot.id);
          }
          finishTurn();
          break;
        }

        case 'CHANCE': {
          const ev = CHANCE_EVENTS[Math.floor(Math.random() * CHANCE_EVENTS.length)];
          resolveChanceEffect(bot, ev);
          break;
        }

        case 'CHANCEHUB': {
          const ev = CHANCEHUB_EVENTS[Math.floor(Math.random() * CHANCEHUB_EVENTS.length)];
          resolveChanceEffect(bot, ev);
          break;
        }

        case 'REST':
          addLog(`Rested peacefully on Payday Weekend.`, 'neutral', bot.name, bot.id);
          finishTurn();
          break;

        default:
          finishTurn();
      }
    }, botDelay);
  };

  // Investment execution
  const executeInvestment = (p: Player, bet: number) => {
    const isWin = Math.random() < 0.55;
    if (isWin) {
      const mult = 1.4 + Math.random() * 0.8;
      const returned = Math.round(bet * mult);
      const profit = returned - bet;

      setPlayers((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? {
                ...item,
                cash: item.cash + profit,
                investCount: item.investCount + 1,
              }
            : item
        )
      );
      playCashSound();
      addLog(
        `Invested RM${bet} in the market: Bull run netted +RM${profit} profit (+RM${returned} back)!`,
        'gain',
        p.name,
        p.id
      );
    } else {
      const lossPct = 0.3 + Math.random() * 0.5;
      const loss = Math.round(bet * lossPct);
      const returned = bet - loss;

      setPlayers((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? {
                ...item,
                cash: item.cash - loss,
                investCount: item.investCount + 1,
              }
            : item
        )
      );
      playDebtWarningSound();
      addLog(
        `Invested RM${bet} in the market: Dip caused a loss of -RM${loss} (salvaged RM${returned}).`,
        'loss',
        p.name,
        p.id
      );
    }
    finishTurn();
  };

  // Resolve chance cards
  const resolveChanceEffect = (p: Player, ev: ChanceEvent) => {
    setPlayers((prev) =>
      prev.map((item) => {
        if (item.id !== p.id) return item;

        let nextCash = item.cash;
        let nextDebt = item.debt;

        if (ev.cashDelta) {
          nextCash = Math.max(0, nextCash + ev.cashDelta);
        }
        if (ev.debtDelta) {
          nextDebt += ev.debtDelta;
        }

        return {
          ...item,
          cash: nextCash,
          debt: nextDebt,
        };
      })
    );

    if (ev.cashDelta && ev.cashDelta > 0) {
      playCashSound();
    } else if (ev.cashDelta && ev.cashDelta < 0) {
      playDebtWarningSound();
    } else if (ev.debtDelta) {
      playDebtWarningSound();
    }

    addLog(`Chance card: "${ev.text}"`, ev.cashDelta && ev.cashDelta > 0 ? 'gain' : 'loss', p.name, p.id);
    finishTurn();
  };

  // Finish turn and advance
  const finishTurn = () => {
    setActiveModal(null);

    const nextTotalTurns = totalTurnsTaken + 1;
    setTotalTurnsTaken(nextTotalTurns);

    // Check game over
    if (nextTotalTurns >= TOTAL_ROUNDS * players.length) {
      setIsGameOver(true);
      addLog(`All ${TOTAL_ROUNDS} rounds completed! Compiling Final Ledger...`, 'gain');
      return;
    }

    const nextIndex = (currentTurnIndex + 1) % players.length;
    if (nextIndex === 0) {
      setCurrentRound((r) => r + 1);
      addLog(`Entering Round ${currentRound + 1} of ${TOTAL_ROUNDS}.`, 'warning');
    }

    setCurrentTurnIndex(nextIndex);
    setCanRoll(true);

    // If next player is computer, auto roll after short delay
    const nextPlayer = players[nextIndex];
    if (nextPlayer && nextPlayer.isComputer) {
      const autoRollDelay = speed === 'fast' ? 500 : 900;
      setTimeout(() => {
        handleRollDice();
      }, autoRollDelay);
    }
  };

  const activePlayer = players[currentTurnIndex] || players[0];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1D2B4F] flex flex-col selection:bg-[#C9A227] selection:text-[#122A22]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenShare={() => setIsShareOpen(true)}
        onResetGame={handleResetGame}
        hasActiveGame={!isSetup && !isGameOver}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'rules' ? (
          <RulesGuide />
        ) : currentView === 'strategy' ? (
          <StrategyLab />
        ) : isSetup ? (
          <SetupScreen onStartGame={handleStartGame} />
        ) : isGameOver ? (
          <FinalLedger
            players={players}
            onPlayAgain={handleResetGame}
            onRematch={handleRematch}
          />
        ) : (
          /* Active Game View */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left/Center: 7x7 Interactive Board */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <GameBoard
                  players={players}
                  currentTurnIndex={currentTurnIndex}
                  currentRound={currentRound}
                  totalRounds={TOTAL_ROUNDS}
                  dice={dice}
                  isRolling={isRolling}
                  canRoll={canRoll}
                  onRollDice={handleRollDice}
                  speed={speed}
                  onToggleSpeed={() => setSpeed((s) => (s === 'normal' ? 'fast' : 'normal'))}
                />

                {/* Ledger Log underneath board */}
                <ActivityLog logs={logs} />
              </div>

              {/* Right: Player Roster & Ledger */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="px-3 py-2 bg-[#EDE6D6] border border-[#D8CFBA] rounded flex items-center justify-between font-mono text-xs text-[#1D2B4F]">
                  <span className="font-bold">Player Standings</span>
                  <span className="text-[#4C5A7A]">10 Rounds Max</span>
                </div>

                <div className="space-y-2.5">
                  {players.map((p, idx) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      isActive={idx === currentTurnIndex}
                      rank={
                        [...players]
                          .sort((a, b) => b.cash - b.debt - (a.cash - a.debt))
                          .findIndex((x) => x.id === p.id) + 1
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal && activePlayer && (
        <TileModal
          type={activeModal.type}
          player={activePlayer}
          onClose={() => finishTurn()}
          onPayBills={(amt, emergency) => {
            if (!emergency) {
              setPlayers((prev) =>
                prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - amt } : p))
              );
              addLog(`Paid RM${amt} monthly bills.`, 'loss', activePlayer.name, activePlayer.id);
            } else {
              const shortage = amt - activePlayer.cash;
              const loan = shortage + 200;
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === activePlayer.id ? { ...p, cash: 0, debt: p.debt + loan } : p
                )
              );
              playDebtWarningSound();
              addLog(
                `Insufficient cash! Took emergency loan of RM${loan} to cover bills.`,
                'debt',
                activePlayer.name,
                activePlayer.id
              );
            }
            finishTurn();
          }}
          onCollectPayday={(amt) => {
            setPlayers((prev) =>
              prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash + amt } : p))
            );
            playCashSound();
            addLog(`Collected +RM${amt} in side gig income.`, 'gain', activePlayer.name, activePlayer.id);
            finishTurn();
          }}
          onInvest={(amt) => executeInvestment(activePlayer, amt)}
          onSkipInvest={() => {
            addLog(`Passed on investment opportunity.`, 'neutral', activePlayer.name, activePlayer.id);
            finishTurn();
          }}
          onBankAction={(action, amt) => {
            if (action === 'pay' && amt) {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === activePlayer.id ? { ...p, cash: p.cash - amt, debt: p.debt - amt } : p
                )
              );
              playCashSound();
              addLog(
                `Paid down RM${amt} of high-interest debt at The Bank.`,
                'gain',
                activePlayer.name,
                activePlayer.id
              );
            } else if (action === 'loan') {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === activePlayer.id ? { ...p, cash: p.cash + 1000, debt: p.debt + 1000 } : p
                )
              );
              playCashSound();
              addLog(`Secured a RM1,000 liquidity loan from The Bank.`, 'warning', activePlayer.name, activePlayer.id);
            } else {
              addLog(`Exited The Bank without making changes.`, 'neutral', activePlayer.name, activePlayer.id);
            }
            finishTurn();
          }}
          onSkillAction={(accept) => {
            if (accept) {
              const cost = 250;
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === activePlayer.id
                    ? {
                        ...p,
                        cash: p.cash - cost,
                        incomeBoost: p.incomeBoost + 100,
                        skillCount: p.skillCount + 1,
                      }
                    : p
                )
              );
              playCashSound();
              addLog(
                `Enrolled in Skill Up course (-RM${cost}). Raised permanent salary by +RM100!`,
                'gain',
                activePlayer.name,
                activePlayer.id
              );
            } else {
              addLog(`Skipped Skill Up course.`, 'neutral', activePlayer.name, activePlayer.id);
            }
            finishTurn();
          }}
          onShopAction={(buy) => {
            if (buy) {
              const cost = 150;
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === activePlayer.id
                    ? { ...p, cash: p.cash - cost, shopCount: p.shopCount + 1 }
                    : p
                )
              );
              addLog(`Treated yourself to a splurge (-RM${cost}).`, 'loss', activePlayer.name, activePlayer.id);
            } else {
              addLog(`Resisted shopping temptation and saved cash.`, 'neutral', activePlayer.name, activePlayer.id);
            }
            finishTurn();
          }}
          chanceEvent={activeModal.chanceEvent}
          onResolveChance={(ev) => resolveChanceEffect(activePlayer, ev)}
        />
      )}

      {/* Share Modal */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
