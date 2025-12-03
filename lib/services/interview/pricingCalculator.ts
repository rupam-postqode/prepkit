export interface PricingDetails {
  userPrice: number;
  costPrice: number;
  margin: number;
  currency: string;
}

export interface CostBreakdown {
  vapi: number;
  gemini: number;
  infrastructure: number;
  payment: number;
  total: number;
}

const USD_TO_INR = 83;

// Pricing tiers based on difficulty
const PRICING_TIERS = {
  easy: 99,
  medium: 149,
  hard: 199,
  expert: 299
} as const;

// Cost estimation per interview (in USD)
const BASE_COSTS = {
  vapiPerMinute: 0.75,
  vapiBaseFee: 0.5,
  geminiQuestionGen: 0.01,
  geminiReportGen: 0.02,
  infrastructure: 0.05,
  paymentProcessing: 0.03
} as const;

export function calculateInterviewCost(
  difficulty: string,
  estimatedDurationMinutes: number
): PricingDetails {
  // Calculate costs in USD
  const vapiCost = BASE_COSTS.vapiBaseFee + (BASE_COSTS.vapiPerMinute * estimatedDurationMinutes);
  const geminiCost = BASE_COSTS.geminiQuestionGen + BASE_COSTS.geminiReportGen;
  const totalCostUSD = vapiCost + geminiCost + BASE_COSTS.infrastructure + BASE_COSTS.paymentProcessing;
  
  // Convert to INR
  const totalCostINR = Math.round(totalCostUSD * USD_TO_INR);
  
  // Get user price based on difficulty
  const userPrice = PRICING_TIERS[difficulty as keyof typeof PRICING_TIERS] || PRICING_TIERS.medium;
  
  // Calculate margin
  const margin = userPrice - totalCostINR;
  
  return {
    userPrice,
    costPrice: totalCostINR,
    margin,
    currency: 'INR'
  };
}

export function getCostBreakdown(estimatedDurationMinutes: number): CostBreakdown {
  const vapiCost = BASE_COSTS.vapiBaseFee + (BASE_COSTS.vapiPerMinute * estimatedDurationMinutes);
  const geminiCost = BASE_COSTS.geminiQuestionGen + BASE_COSTS.geminiReportGen;
  
  return {
    vapi: Math.round(vapiCost * USD_TO_INR),
    gemini: Math.round(geminiCost * USD_TO_INR),
    infrastructure: Math.round(BASE_COSTS.infrastructure * USD_TO_INR),
    payment: Math.round(BASE_COSTS.paymentProcessing * USD_TO_INR),
    total: Math.round((vapiCost + geminiCost + BASE_COSTS.infrastructure + BASE_COSTS.paymentProcessing) * USD_TO_INR)
  };
}

export function getEstimatedDuration(difficulty: string): number {
  const durations = {
    easy: 12,
    medium: 20,
    hard: 25,
    expert: 30
  } as const;
  
  return durations[difficulty as keyof typeof durations] || durations.medium;
}

export function getPricingTier(difficulty: string): number {
  return PRICING_TIERS[difficulty as keyof typeof PRICING_TIERS] || PRICING_TIERS.medium;
}
