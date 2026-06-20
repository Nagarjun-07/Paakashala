import React from "react";
import { MealPlan, Meal } from "../lib/types";
import { formatCurrency } from "../lib/helpers";
import { Clock, DollarSign, Tag } from "lucide-react";

interface MealMatrixProps {
  mealPlan: MealPlan | null;
}

const MealCard: React.FC<{ title: string; meal: Meal }> = ({ title, meal }) => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all group">
    <h3 className="text-emerald-400 font-semibold mb-1 uppercase tracking-wider text-xs">{title}</h3>
    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">{meal.name}</h4>
    
    <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-300">
      <div className="flex items-center gap-1.5" aria-label={`Prep time: ${meal.prepTime} minutes`}>
        <Clock className="w-4 h-4 text-slate-500" />
        <span>{meal.prepTime}m</span>
      </div>
      <div className="flex items-center gap-1.5" aria-label={`Estimated cost: ${formatCurrency(meal.estimatedCost)}`}>
        <DollarSign className="w-4 h-4 text-slate-500" />
        <span>{formatCurrency(meal.estimatedCost)}</span>
      </div>
      <div className="flex items-center gap-1.5" aria-label={`Nutrition tag: ${meal.nutritionTag}`}>
        <Tag className="w-4 h-4 text-slate-500" />
        <span className="text-emerald-200/80 bg-emerald-900/30 px-2 py-0.5 rounded-md text-xs">{meal.nutritionTag}</span>
      </div>
    </div>

    <div>
      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">Ingredients</h5>
      <ul className="flex flex-wrap gap-2">
        {meal.ingredients.map((ing, i) => (
          <li key={i} className="text-xs bg-slate-900/50 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50">
            {ing}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const MealMatrix: React.FC<MealMatrixProps> = ({ mealPlan }) => {
  if (!mealPlan) return null;

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl" data-testid="meal-plan">
      <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        Generated Meal Matrix
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MealCard title="Breakfast" meal={mealPlan.breakfast} />
        <MealCard title="Lunch" meal={mealPlan.lunch} />
        <MealCard title="Dinner" meal={mealPlan.dinner} />
      </div>
    </div>
  );
};
