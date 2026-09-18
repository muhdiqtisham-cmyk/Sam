import React from 'react';
import { LogEntry } from '../types';
import { ScrollText, ArrowUpRight, ArrowDownRight, AlertCircle, ShieldAlert } from 'lucide-react';

interface ActivityLogProps {
  logs: LogEntry[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="border border-[#B9AD8E] bg-[#FFFDF8] rounded flex flex-col h-44 sm:h-52 overflow-hidden shadow-2xs">
      {/* Header */}
      <div className="px-3 py-1.5 bg-[#EDE6D6] border-b border-[#D8CFBA] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1D2B4F]">
          <ScrollText className="w-3.5 h-3.5 text-[#1B4332]" />
          <span>Financial Ledger Log</span>
        </div>
        <span className="text-[10px] font-mono text-[#4C5A7A]">{logs.length} entries</span>
      </div>

      {/* Log list */}
      <div
        ref={containerRef}
        id="activity-log-container"
        className="flex-1 overflow-y-auto p-2.5 space-y-1.5 text-xs font-mono divide-y divide-[#D8CFBA]/40"
      >
        {logs.length === 0 ? (
          <div className="text-center py-6 text-[#4C5A7A] italic">
            Waiting for the first roll of the dice...
          </div>
        ) : (
          logs.map((log) => {
            let icon = null;
            let textColor = 'text-[#1D2B4F]';

            if (log.type === 'gain') {
              icon = <ArrowUpRight className="w-3.5 h-3.5 text-[#1B4332] shrink-0 inline" />;
              textColor = 'text-[#1B4332]';
            } else if (log.type === 'loss') {
              icon = <ArrowDownRight className="w-3.5 h-3.5 text-[#A63D40] shrink-0 inline" />;
              textColor = 'text-[#A63D40]';
            } else if (log.type === 'debt') {
              icon = <ShieldAlert className="w-3.5 h-3.5 text-[#A63D40] shrink-0 inline" />;
              textColor = 'text-[#A63D40] font-medium';
            } else if (log.type === 'warning') {
              icon = <AlertCircle className="w-3.5 h-3.5 text-[#C9A227] shrink-0 inline" />;
              textColor = 'text-[#1D2B4F]';
            }

            return (
              <div key={log.id} className="pt-1.5 first:pt-0 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="text-[10px] text-[#4C5A7A] shrink-0 mt-0.5">
                    [{log.timestamp}]
                  </span>
                  {icon}
                  <div className={`flex-1 ${textColor}`}>
                    {log.playerName && (
                      <span className="font-semibold text-[#1D2B4F] mr-1">
                        {log.playerName}:
                      </span>
                    )}
                    <span>{log.text}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
