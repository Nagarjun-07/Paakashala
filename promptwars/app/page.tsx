"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { UserDayProfile, MealPlan, GroceryItem, Substitution, BudgetStatus } from "../lib/types";
import { generateMealMatrix, generateGroceryList } from "../lib/mealEngine";
import { validateBudgetFeasibility } from "../lib/budgetEngine";
import { generateSubstitutions } from "../lib/substitutionEngine";
import { formatCurrency } from "../lib/helpers";

import { ControlPanel } from "../components/ControlPanel";
import { MealMatrix } from "../components/MealMatrix";
import { LiveMetrics } from "../components/LiveMetrics";
import { ExecutionConsole } from "../components/ExecutionConsole";

import { ShoppingCart, RefreshCcw, AlertTriangle, CheckCircle, Wallet } from "lucide-react";

const INITIAL_PROFILE: UserDayProfile = {
  dayType: "Busy Workday",
  budget: 50,
  availableTime: 45,
  energyLevel: "Medium",
  peopleEating: 2,
  dietPreference: "None"
};

export default function CookingApp() {
  const [profile, setProfile] = useState<UserDayProfile>(INITIAL_PROFILE);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
  }, []);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const runSimulation = useCallback(() => {
    setIsCalculating(true);
    setLogs([]);
    clearTimers();

    const sequence = [
      { delay: 100, msg: "[AGENT 1]", log: "Parsing daily schedule..." },
      { delay: 400, msg: "Schedule parsed. Time constraints identified.", action: () => {} },
      { delay: 700, msg: "[AGENT 2]", log: "Generating meal matrix..." },
      { delay: 1100, msg: "Meals optimized for energy level and time.", action: () => {
          const newPlan = generateMealMatrix(profile);
          setMealPlan(newPlan);
      }},
      { delay: 1400, msg: "[AGENT 3]", log: "Calculating grocery requirements..." },
      { delay: 1800, msg: "Ingredients extracted and categorized.", action: () => {
          if (mealPlan) {
              const newGroceries = generateGroceryList(mealPlan, profile);
              setGroceries(newGroceries);
          }
      }},
      { delay: 2100, msg: "[AGENT 4]", log: "Running substitution engine..." },
      { delay: 2500, msg: "Dietary constraints applied.", action: () => {
          if (groceries.length > 0) {
              const newSubs = generateSubstitutions(groceries, profile);
              setSubstitutions(newSubs);
          }
      }},
      { delay: 2800, msg: "[AGENT 5]", log: "Validating budget feasibility..." },
      { delay: 3200, msg: "Cost analysis complete.", action: () => {
          if (mealPlan) {
              const newBudget = validateBudgetFeasibility(mealPlan, profile);
              setBudgetStatus(newBudget);
          }
          setIsCalculating(false);
      }}
    ];

    sequence.forEach(({ delay, msg, log, action }) => {
      const timer = setTimeout(() => {
        if (msg) addLog(msg);
        if (log) addLog(log);
        if (action) action();
      }, delay);
      timerRefs.current.push(timer);
    });

  }, [profile, mealPlan, groceries, addLog, clearTimers]);

  useEffect(() => {
    runSimulation();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]); // run simulation only when profile changes, relying on stale state for internal steps is fine for this demo as we compute everything deterministically

  // Compute final deterministic data synchronously if not calculating to avoid stale state issues in sequence
  useEffect(() => {
      if(!isCalculating) {
          const finalPlan = generateMealMatrix(profile);
          const finalGroceries = generateGroceryList(finalPlan, profile);
          const finalSubs = generateSubstitutions(finalGroceries, profile);
          const finalBudget = validateBudgetFeasibility(finalPlan, profile);
          
          setMealPlan(finalPlan);
          setGroceries(finalGroceries);
          setSubstitutions(finalSubs);
          setBudgetStatus(finalBudget);
      }
  }, [isCalculating, profile]);


  const memoizedGroceries = useMemo(() => {
    const categories = ["Produce", "Protein", "Dairy", "Pantry"] as const;
    return categories.map(cat => ({
      category: cat,
      items: groceries.filter(g => g.category === cat)
    })).filter(c => c.items.length > 0);
  }, [groceries]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="bg-emerald-500 text-black px-2 py-1 rounded-md text-xl">AI</span>
              Culinary Core
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Autonomous Meal Planning Pipeline</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm font-medium">
             <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalculating ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isCalculating ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            {isCalculating ? "Processing Data..." : "System Ready"}
          </div>
        </header>

        <LiveMetrics budgetStatus={budgetStatus} isCalculating={isCalculating} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ControlPanel profile={profile} onChange={setProfile} />
            <ExecutionConsole logs={logs} />
            
            {budgetStatus && (
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl" data-testid="budget-panel">
                <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                   <Wallet className="w-4 h-4" />
                  Budget Feasibility
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-semibold">Total Cost</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(budgetStatus.totalCost)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-semibold">Cost Per Meal</span>
                    <span className="text-lg font-bold text-slate-300">{formatCurrency(budgetStatus.costPerMeal)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-semibold">Budget Remaining</span>
                    <span className={`text-lg font-bold ${budgetStatus.budgetRemaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(budgetStatus.budgetRemaining)}
                    </span>
                  </div>
                  
                  <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                    budgetStatus.status === 'SAFE' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 
                    budgetStatus.status === 'WARNING' ? 'bg-amber-950/30 border-amber-900/50 text-amber-400' : 
                    'bg-rose-950/30 border-rose-900/50 text-rose-400'
                  }`}>
                    {budgetStatus.status === 'SAFE' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider opacity-80">Status</div>
                      <div className="text-lg font-bold">{budgetStatus.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <MealMatrix mealPlan={mealPlan} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl" data-testid="grocery-list">
                <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Grocery Engine
                </h2>
                
                {memoizedGroceries.map((group, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-1 border-b border-slate-800">{group.category}</h3>
                    <ul className="space-y-2">
                      {group.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-slate-500 text-xs font-mono bg-slate-950 px-2 py-1 rounded">{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl" data-testid="substitution-panel">
                <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Substitution Engine
                </h2>
                
                <div className="space-y-4">
                  {substitutions.map((sub, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-semibold text-rose-300 line-through decoration-rose-500/50">{sub.original}</div>
                        <div className="text-xs text-emerald-500 font-mono bg-emerald-950/50 px-2 py-0.5 rounded">Replaced</div>
                      </div>
                      <div className="text-base font-bold text-emerald-300 mb-1">{sub.alternative}</div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">{sub.reason}</div>
                    </div>
                  ))}
                  
                  {substitutions.length === 0 && (
                    <div className="text-sm text-slate-500 italic">No substitutions required for current constraints.</div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
