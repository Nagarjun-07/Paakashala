import { BudgetStatus, MealPlan, UserDayProfile } from "./types";
import { calculatePercentage, parseSafeNumber } from "./helpers";

export const validateBudgetFeasibility = (mealPlan: MealPlan | null, profile: UserDayProfile): BudgetStatus => {
  const safeBudget = parseSafeNumber(profile.budget, 0);
  const safePeople = Math.max(1, parseSafeNumber(profile.peopleEating, 1));
  
  if (!mealPlan) {
    return {
      totalCost: 0,
      costPerMeal: 0,
      budgetRemaining: safeBudget,
      budgetUtilization: 0,
      efficiencyScore: 100,
      status: "SAFE"
    };
  }

  const baseCost = mealPlan.breakfast.estimatedCost + mealPlan.lunch.estimatedCost + mealPlan.dinner.estimatedCost;
  const totalCost = parseSafeNumber(baseCost * safePeople);
  const costPerMeal = parseSafeNumber(totalCost / (3 * safePeople));
  const budgetRemaining = Math.max(0, safeBudget - totalCost);
  const budgetUtilization = calculatePercentage(totalCost, safeBudget);
  
  let status: BudgetStatus["status"] = "SAFE";
  if (budgetUtilization > 100) {
    status = "OVER BUDGET";
  } else if (budgetUtilization > 85) {
    status = "WARNING";
  }

  const efficiencyScore = Math.max(0, 100 - (budgetUtilization > 100 ? (budgetUtilization - 100) : 0));

  return {
    totalCost,
    costPerMeal,
    budgetRemaining,
    budgetUtilization,
    efficiencyScore,
    status
  };
};
