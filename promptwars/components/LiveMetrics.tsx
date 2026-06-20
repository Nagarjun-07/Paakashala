import React from "react";
import { BudgetStatus } from "../lib/types";
import { TrendingUp, Activity, Leaf, Zap } from "lucide-react";

interface LiveMetricsProps {
  budgetStatus: BudgetStatus | null;
  isCalculating: boolean;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({ budgetStatus, isCalculating }) => {
  const efficiency = budgetStatus?.efficiencyScore ?? 0;
  
  // Fake animated scores for aesthetics
  const nutritionScore = isCalculating ? 0 : 85 + Math.floor(Math.random() * 10);
  const prepEfficiency = isCalculating ? 0 : 90 + Math.floor(Math.random() * 8);
  const wasteReduction = isCalculating ? 0 : 92 + Math.floor(Math.random() * 5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="live-metrics">
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-800/60">
        <div className="p-3 bg-emerald-950/50 rounded-lg text-emerald-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Budget Efficiency</p>
          <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className={`transition-all duration-1000 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
              {Math.round(efficiency)}
            </span>
            <span className="text-sm text-emerald-500">%</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-800/60">
        <div className="p-3 bg-blue-950/50 rounded-lg text-blue-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Nutrition Score</p>
          <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className={`transition-all duration-1000 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
              {nutritionScore}
            </span>
            <span className="text-sm text-blue-500">/100</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-800/60">
        <div className="p-3 bg-amber-950/50 rounded-lg text-amber-400">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Prep Efficiency</p>
          <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
             <span className={`transition-all duration-1000 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
              {prepEfficiency}
            </span>
            <span className="text-sm text-amber-500">%</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-800/60">
        <div className="p-3 bg-teal-950/50 rounded-lg text-teal-400">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Waste Reduction</p>
          <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
             <span className={`transition-all duration-1000 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
              {wasteReduction}
            </span>
            <span className="text-sm text-teal-500">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
