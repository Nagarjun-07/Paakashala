import React from "react";
import { UserDayProfile, DayType, DietPreference } from "../lib/types";

interface ControlPanelProps {
  profile: UserDayProfile;
  onChange: (profile: UserDayProfile) => void;
}

const DAY_TYPES: DayType[] = ["Busy Workday", "Workout Day", "Lazy Sunday", "Family Gathering", "Travel Day"];
const DIET_PREFS: DietPreference[] = ["None", "Vegetarian", "Vegan", "High Protein", "Low Budget"];

export const ControlPanel: React.FC<ControlPanelProps> = ({ profile, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === "budget" || name === "availableTime" || name === "peopleEating") {
      parsedValue = Math.max(0, Number(value) || 0);
    }
    
    onChange({
      ...profile,
      [name]: parsedValue,
    });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl" data-testid="control-panel">
      <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        Mission Parameters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="dayType">Day Type</label>
          <select 
            id="dayType" 
            name="dayType" 
            value={profile.dayType} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            aria-label="Select Day Type"
          >
            {DAY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="dietPreference">Diet Preference</label>
          <select 
            id="dietPreference" 
            name="dietPreference" 
            value={profile.dietPreference} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            aria-label="Select Diet Preference"
          >
            {DIET_PREFS.map(pref => <option key={pref} value={pref}>{pref}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="budget">Budget ($)</label>
          <input 
            type="number" 
            id="budget" 
            name="budget" 
            min="0"
            value={profile.budget} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            aria-label="Enter Budget"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="availableTime">Cooking Time (min)</label>
          <input 
            type="number" 
            id="availableTime" 
            name="availableTime" 
            min="0"
            value={profile.availableTime} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            aria-label="Enter Available Cooking Time"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="peopleEating">People Eating</label>
          <input 
            type="number" 
            id="peopleEating" 
            name="peopleEating" 
            min="1"
            value={profile.peopleEating} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            aria-label="Enter Number of People Eating"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase" htmlFor="energyLevel">Energy Level</label>
          <select 
            id="energyLevel" 
            name="energyLevel" 
            value={profile.energyLevel} 
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            aria-label="Select Energy Level"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};
