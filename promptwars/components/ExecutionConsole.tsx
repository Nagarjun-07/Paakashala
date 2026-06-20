import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

interface ExecutionConsoleProps {
  logs: string[];
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono flex flex-col h-64" data-testid="execution-console">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-slate-400 font-semibold uppercase">AI Execution Pipeline</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 animate-pulse"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">Waiting for input...</div>
        ) : (
          logs.map((log, index) => {
            const isAgent = log.startsWith("[AGENT");
            return (
              <div 
                key={index} 
                className={`transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${isAgent ? 'text-emerald-400 font-bold mt-4' : 'text-slate-300 pl-4 border-l-2 border-slate-800'}`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
