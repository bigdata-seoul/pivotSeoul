import React, { createContext, useContext, useState } from 'react';

export type LifeStage = 'youth' | 'family' | 'senior';

export interface UserProfile {
  lifeStage: LifeStage | null;
  name: string;
  currentDistrict: string;
  compareDistrict: string;
  monthlyIncome: number;
  monthlyHousing: number;
  monthlyLiving: number;
  commuteTime: number;
  childcareCost: number;
  returnToWorkMonths: number;
  retirementAge: number;
  savings: number;
}

export interface ScenarioConditions {
  district: string;
  monthlyHousing: number;
  commuteTime: number;
  childcareCost: number;
  applyPolicy: boolean;
  downsizing: boolean;
  returnToWorkMonths: number;
  extraIncome: number;
}

export interface RiskAnalysis {
  overallScore: number;
  status: 'safe' | 'warning' | 'danger';
  housingRatio: number;
  housingStatus: 'safe' | 'warning' | 'danger';
  commuteStatus: 'safe' | 'warning' | 'danger';
  childcareRatio: number;
  childcareStatus: 'safe' | 'warning' | 'danger';
  monthlySurplus: number;
  surplusStatus: 'safe' | 'warning' | 'danger';
}

interface PivotContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  scenarioA: ScenarioConditions;
  scenarioB: ScenarioConditions;
  updateScenarioA: (updates: Partial<ScenarioConditions>) => void;
  updateScenarioB: (updates: Partial<ScenarioConditions>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
  calculateRisk: (scenario: ScenarioConditions, income: number) => RiskAnalysis;
}

const defaultProfile: UserProfile = {
  lifeStage: null,
  name: '김서울',
  currentDistrict: '마포구',
  compareDistrict: '노원구',
  monthlyIncome: 350,
  monthlyHousing: 120,
  monthlyLiving: 150,
  commuteTime: 55,
  childcareCost: 60,
  returnToWorkMonths: 12,
  retirementAge: 65,
  savings: 5000,
};

const defaultScenarioA: ScenarioConditions = {
  district: '마포구',
  monthlyHousing: 120,
  commuteTime: 55,
  childcareCost: 60,
  applyPolicy: false,
  downsizing: false,
  returnToWorkMonths: 12,
  extraIncome: 0,
};

const defaultScenarioB: ScenarioConditions = {
  district: '노원구',
  monthlyHousing: 72,
  commuteTime: 75,
  childcareCost: 40,
  applyPolicy: true,
  downsizing: true,
  returnToWorkMonths: 6,
  extraIncome: 30,
};

const PivotContext = createContext<PivotContextType | null>(null);

/**
 * Lightweight domain risk engine for prototype UI.
 *
 * NOTE:
 * - This function is intentionally deterministic and local-only.
 * - Backend integration should replace fixed constants with model outputs
 *   while preserving return shape (`RiskAnalysis`) for UI compatibility.
 */
function calculateRisk(scenario: ScenarioConditions, income: number): RiskAnalysis {
  const housingRatio = (scenario.monthlyHousing / income) * 100;
  const childcareRatio = (scenario.childcareCost / income) * 100;
  const policyBonus = scenario.applyPolicy ? 30 : 0;
  const monthlySurplus = income - scenario.monthlyHousing - scenario.childcareCost - 130 + policyBonus + scenario.extraIncome;

  const housingStatus: 'safe' | 'warning' | 'danger' =
    housingRatio < 28 ? 'safe' : housingRatio < 38 ? 'warning' : 'danger';
  const commuteStatus: 'safe' | 'warning' | 'danger' =
    scenario.commuteTime < 50 ? 'safe' : scenario.commuteTime < 70 ? 'warning' : 'danger';
  const childcareStatus: 'safe' | 'warning' | 'danger' =
    childcareRatio < 12 ? 'safe' : childcareRatio < 18 ? 'warning' : 'danger';
  const surplusStatus: 'safe' | 'warning' | 'danger' =
    monthlySurplus > 80 ? 'safe' : monthlySurplus > 20 ? 'warning' : 'danger';

  const toScore = (s: 'safe' | 'warning' | 'danger') => s === 'safe' ? 15 : s === 'warning' ? 45 : 85;

  const overallScore = Math.round(
    toScore(housingStatus) * 0.3 +
    toScore(commuteStatus) * 0.2 +
    toScore(childcareStatus) * 0.2 +
    toScore(surplusStatus) * 0.3
  );

  const status: 'safe' | 'warning' | 'danger' =
    overallScore < 35 ? 'safe' : overallScore < 65 ? 'warning' : 'danger';

  return {
    overallScore,
    status,
    housingRatio,
    housingStatus,
    commuteStatus,
    childcareRatio,
    childcareStatus,
    monthlySurplus,
    surplusStatus,
  };
}

export const PivotProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [scenarioA, setScenarioA] = useState<ScenarioConditions>(defaultScenarioA);
  const [scenarioB, setScenarioB] = useState<ScenarioConditions>(defaultScenarioB);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Partial updates keep form pages decoupled: each page only patches fields it owns.
  const updateProfile = (updates: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...updates }));
  const updateScenarioA = (updates: Partial<ScenarioConditions>) => setScenarioA(prev => ({ ...prev, ...updates }));
  const updateScenarioB = (updates: Partial<ScenarioConditions>) => setScenarioB(prev => ({ ...prev, ...updates }));

  return (
    <PivotContext.Provider value={{
      profile, updateProfile,
      scenarioA, scenarioB, updateScenarioA, updateScenarioB,
      currentStep, setCurrentStep,
      isOnboarded, setIsOnboarded,
      calculateRisk,
    }}>
      {children}
    </PivotContext.Provider>
  );
};

export const usePivot = () => {
  const ctx = useContext(PivotContext);
  if (!ctx) throw new Error('usePivot must be used within PivotProvider');
  return ctx;
};
