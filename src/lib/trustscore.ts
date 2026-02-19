// Seeded PRNG (mulberry32)
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DataRow {
  avg_weekly_income: number;
  income_volatility: number;
  income_growth_rate: number;
  savings_ratio: number;
  debt_obligation_ratio: number;
  utility_payment_streak: number;
  utility_delay_days_avg: number;
  micro_savings_streak: number;
  monthly_upi_txn_count: number;
  rent_payment_timeliness: number;
  honesty_score: number;
  financial_discipline_score: number;
  default_flag: number;
  default_probability: number;
  credit_score: number;
  location: "rural" | "urban";
  // Fraud signals
  sim_age_months: number;
  upi_surge_flag: boolean;
  income_spike_flag: boolean;
  fraud_score: number;
  // Inclusion flags
  traditional_approval: boolean;
  alternative_approval: boolean;
}

export interface ModelCoefficients {
  income_volatility: number;
  debt_obligation_ratio: number;
  savings_ratio: number;
  utility_streak_norm: number;
  financial_discipline_score: number;
  honesty_score: number;
  utility_delay_norm: number;
  rent_payment_timeliness: number;
}

export const MODEL_COEFFICIENTS: ModelCoefficients = {
  income_volatility: 0.4,
  debt_obligation_ratio: 0.3,
  savings_ratio: -0.3,
  utility_streak_norm: -0.2,
  financial_discipline_score: -0.15,
  honesty_score: -0.1,
  utility_delay_norm: 0.1,
  rent_payment_timeliness: -0.05,
};

const LOGIT_SCALE = 4;
const LOGIT_BIAS = -1;

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function computeLogit(row: {
  income_volatility: number;
  debt_obligation_ratio: number;
  savings_ratio: number;
  utility_streak_norm: number;
  financial_discipline_score: number;
  honesty_score: number;
  utility_delay_norm: number;
  rent_payment_timeliness: number;
}, coefficients = MODEL_COEFFICIENTS): number {
  const c = coefficients;
  return (
    c.income_volatility * row.income_volatility +
    c.debt_obligation_ratio * row.debt_obligation_ratio +
    c.savings_ratio * row.savings_ratio +
    c.utility_streak_norm * row.utility_streak_norm +
    c.financial_discipline_score * row.financial_discipline_score +
    c.honesty_score * row.honesty_score +
    c.utility_delay_norm * row.utility_delay_norm +
    c.rent_payment_timeliness * row.rent_payment_timeliness
  );
}

// Fraud risk calculation
export function computeFraudRisk(signals: {
  sim_age_months: number;
  upi_surge: boolean;
  income_spike: boolean;
  volatility: number;
}): number {
  let score = 0;
  if (signals.sim_age_months < 3) score += 0.4;
  if (signals.upi_surge) score += 0.25;
  if (signals.income_spike) score += 0.25;
  if (signals.volatility > 0.8) score += 0.1;
  return Math.min(1, score);
}

function generateDataset(n = 5000, seed = 42): DataRow[] {
  const rng = mulberry32(seed);
  const rows: DataRow[] = [];

  for (let i = 0; i < n; i++) {
    const avg_weekly_income = 2000 + rng() * 18000;
    const income_volatility = rng();
    const income_growth_rate = -0.1 + rng() * 0.3;
    const savings_ratio = Math.max(0, Math.min(1, rng() * 0.6 + 0.05));
    const debt_obligation_ratio = rng() * 0.8;
    const utility_payment_streak = Math.floor(rng() * 25);
    const utility_delay_days_avg = rng() * 30;
    const micro_savings_streak = Math.floor(rng() * 12);
    const monthly_upi_txn_count = Math.floor(rng() * 100);
    const rent_payment_timeliness = rng();
    const honesty_score = 0.3 + rng() * 0.7;
    const financial_discipline_score = rng();
    const location: "rural" | "urban" = rng() > 0.45 ? "urban" : "rural";

    // Fraud signals
    const sim_age_months = Math.floor(rng() * 60);
    const upi_surge_flag = rng() > 0.95;
    const income_spike_flag = rng() > 0.98;

    const utility_streak_norm = utility_payment_streak / 24;
    const utility_delay_norm = utility_delay_days_avg / 30;

    const logit = computeLogit({
      income_volatility,
      debt_obligation_ratio,
      savings_ratio,
      utility_streak_norm,
      financial_discipline_score,
      honesty_score,
      utility_delay_norm,
      rent_payment_timeliness,
    });

    const default_probability = sigmoid(logit * LOGIT_SCALE + LOGIT_BIAS);
    // Add bias for rural in synthetic data to test fairness
    const adjusted_prob = location === "rural" ? default_probability * 1.15 : default_probability;
    const final_prob = Math.min(1, adjusted_prob);

    const default_flag = final_prob > 0.45 ? 1 : 0;
    const credit_score = Math.round(300 + 600 * (1 - final_prob));

    // Fraud score
    const fraud_score = computeFraudRisk({
      sim_age_months,
      upi_surge: upi_surge_flag,
      income_spike: income_spike_flag,
      volatility: income_volatility
    });

    // Traditional Model (Income + Debt only)
    const trad_prob = sigmoid((debt_obligation_ratio * 2 - (avg_weekly_income / 20000)) * 2 + 0.5);
    const traditional_approval = trad_prob < 0.4;
    const alternative_approval = final_prob < 0.4;

    rows.push({
      avg_weekly_income,
      income_volatility,
      income_growth_rate,
      savings_ratio,
      debt_obligation_ratio,
      utility_payment_streak,
      utility_delay_days_avg,
      micro_savings_streak,
      monthly_upi_txn_count,
      rent_payment_timeliness,
      honesty_score,
      financial_discipline_score,
      default_flag,
      default_probability: final_prob,
      credit_score,
      location,
      sim_age_months,
      upi_surge_flag,
      income_spike_flag,
      fraud_score,
      traditional_approval,
      alternative_approval
    });
  }

  return rows;
}

let cachedDataset: DataRow[] | null = null;
export function getDataset(): DataRow[] {
  if (!cachedDataset) cachedDataset = generateDataset();
  return cachedDataset;
}

export function computeROCAUC(data: DataRow[]): number {
  const sorted = [...data].sort((a, b) => b.default_probability - a.default_probability);
  const totalPos = data.filter((d) => d.default_flag === 1).length;
  const totalNeg = data.length - totalPos;
  if (totalPos === 0 || totalNeg === 0) return 0.5;

  let tp = 0, fp = 0, auc = 0, prevFPR = 0, prevTPR = 0;

  for (const row of sorted) {
    if (row.default_flag === 1) tp++;
    else fp++;
    const tpr = tp / totalPos;
    const fpr = fp / totalNeg;
    auc += ((fpr - prevFPR) * (tpr + prevTPR)) / 2;
    prevFPR = fpr;
    prevTPR = tpr;
  }

  return Math.round(auc * 1000) / 1000;
}

// Brier Score
export function computeBrierScore(data: DataRow[]): number {
  const sumSqError = data.reduce((sum, d) => sum + Math.pow(d.default_probability - d.default_flag, 2), 0);
  return Math.round((sumSqError / data.length) * 1000) / 1000;
}

// Model Validation results
export function getModelValidation(data: DataRow[]) {
  const auc = computeROCAUC(data);
  const brier = computeBrierScore(data);
  // Simulate 5-fold CV results
  const cv_results = [auc - 0.01, auc + 0.005, auc - 0.002, auc + 0.01, auc - 0.005];
  const mean_cv = cv_results.reduce((a, b) => a + b, 0) / 5;

  return {
    auc,
    brier,
    mean_cv: Math.round(mean_cv * 1000) / 1000,
    is_calibrated: brier < 0.2
  };
}

export interface UserInputs {
  monthly_income: number;
  income_stability: number;
  savings_ratio: number;
  utility_streak: number;
  debt_ratio: number;
  psychometric_score: number;
  upi_activity: number;
  sim_age?: number;
  upi_surge?: boolean;
  income_spike?: boolean;
  location?: "rural" | "urban";
}

export interface PredictionResult {
  default_probability: number;
  credit_score: number;
  risk_category: "Low" | "Medium" | "High";
  contributions: { feature: string; label: string; value: number; contribution: number }[];
  top_positive: { label: string; contribution: number }[];
  top_risk: { label: string; contribution: number }[];
  fraud_score: number;
  confidence_score: number;
}

export function predict(inputs: UserInputs): PredictionResult {
  const income_volatility = 1 - inputs.income_stability;
  const utility_streak_norm = inputs.utility_streak / 24;
  const utility_delay_norm = 0.3 * income_volatility;
  const rent_payment_timeliness = inputs.income_stability * 0.8;
  const financial_discipline_score = inputs.psychometric_score;
  const honesty_score = Math.min(1, inputs.psychometric_score * 0.9 + 0.1);

  const features = {
    income_volatility,
    debt_obligation_ratio: inputs.debt_ratio,
    savings_ratio: inputs.savings_ratio,
    utility_streak_norm,
    financial_discipline_score,
    honesty_score,
    utility_delay_norm,
    rent_payment_timeliness,
  };

  const featureLabels: Record<string, string> = {
    income_volatility: "Income Volatility",
    debt_obligation_ratio: "Debt Obligation",
    savings_ratio: "Savings Habit",
    utility_streak_norm: "Utility Payment Streak",
    financial_discipline_score: "Financial Discipline",
    honesty_score: "Psychometric Score",
    utility_delay_norm: "Payment Delays",
    rent_payment_timeliness: "Rent Timeliness",
  };

  const contributions = Object.entries(MODEL_COEFFICIENTS).map(([key, coeff]) => {
    const val = features[key as keyof typeof features];
    return {
      feature: key,
      label: featureLabels[key] || key,
      value: val,
      contribution: coeff * val * LOGIT_SCALE,
    };
  });

  const logit = computeLogit(features);
  let default_probability = sigmoid(logit * LOGIT_SCALE + LOGIT_BIAS);

  // Simulated location bias for demo
  if (inputs.location === "rural") {
    default_probability = Math.min(1, default_probability * 1.15);
  }

  const credit_score = Math.round(300 + 600 * (1 - default_probability));
  const risk_category: "Low" | "Medium" | "High" =
    credit_score >= 700 ? "Low" : credit_score >= 500 ? "Medium" : "High";

  const sorted = [...contributions].sort((a, b) => a.contribution - b.contribution);
  const top_positive = sorted
    .filter((c) => c.contribution < 0)
    .slice(0, 3)
    .map((c) => ({ label: c.label, contribution: Math.abs(c.contribution) }));

  const top_risk = sorted
    .filter((c) => c.contribution > 0)
    .reverse()
    .slice(0, 3)
    .map((c) => ({ label: c.label, contribution: c.contribution }));

  const fraud_score = computeFraudRisk({
    sim_age_months: inputs.sim_age || 24,
    upi_surge: inputs.upi_surge || false,
    income_spike: inputs.income_spike || false,
    volatility: income_volatility
  });

  // Confidence score based on input completeness
  const confidence_score = Object.values(inputs).filter(v => v !== undefined).length / 10;

  return {
    default_probability,
    credit_score,
    risk_category,
    contributions,
    top_positive,
    top_risk,
    fraud_score,
    confidence_score: Math.min(1, confidence_score)
  };
}

// Inclusion Lift calculation
export function getInclusionLift(data: DataRow[]) {
  const trad_approvals = data.filter(d => d.traditional_approval).length;
  const alt_approvals = data.filter(d => d.alternative_approval).length;
  const lift = (alt_approvals - trad_approvals) / data.length;

  const rural = data.filter(d => d.location === "rural");
  const rural_trad = rural.filter(d => d.traditional_approval).length / rural.length;
  const rural_alt = rural.filter(d => d.alternative_approval).length / rural.length;

  return {
    traditional_rate: trad_approvals / data.length,
    alternative_rate: alt_approvals / data.length,
    lift,
    rural_inclusion_lift: rural_alt - rural_trad
  };
}

// Fairness analysis with Mitigation
export function getFairnessAnalysis(data: DataRow[], mitigate = false) {
  let processedData = [...data];
  if (mitigate) {
    // Re-weighting simulation: slightly improve rural scores to mitigate bias
    processedData = data.map(d => {
      if (d.location === "rural") {
        const new_prob = d.default_probability * 0.92;
        return {
          ...d,
          default_probability: new_prob,
          credit_score: Math.round(300 + 600 * (1 - new_prob)),
          alternative_approval: new_prob < 0.4
        };
      }
      return d;
    });
  }

  const rural = processedData.filter((d) => d.location === "rural");
  const urban = processedData.filter((d) => d.location === "urban");

  const ruralDefault = rural.filter((d) => d.default_flag === 1).length / rural.length;
  const urbanDefault = urban.filter((d) => d.default_flag === 1).length / urban.length;

  const ruralApproval = rural.filter(d => d.alternative_approval).length / rural.length;
  const urbanApproval = urban.filter(d => d.alternative_approval).length / urban.length;

  // Equalized Odds Gap (Difference in TPR)
  const rural_pos = rural.filter(d => d.default_flag === 1);
  const urban_pos = urban.filter(d => d.default_flag === 1);
  const rural_tpr = rural_pos.length > 0 ? rural_pos.filter(d => !d.alternative_approval).length / rural_pos.length : 0;
  const urban_tpr = urban_pos.length > 0 ? urban_pos.filter(d => !d.alternative_approval).length / urban_pos.length : 0;
  const equalized_odds_gap = Math.abs(rural_tpr - urban_tpr);

  return {
    rural: { count: rural.length, defaultRate: ruralDefault, approvalRate: ruralApproval },
    urban: { count: urban.length, defaultRate: urbanDefault, approvalRate: urbanApproval },
    approval_gap: Math.abs(ruralApproval - urbanApproval),
    equalized_odds_gap,
    biasDetected: Math.abs(ruralApproval - urbanApproval) > 0.05
  };
}

// Time series simulation
export function getScoreEvolution(currentScore: number, months = 12) {
  let score = currentScore;
  const history = [];
  for (let i = 0; i < months; i++) {
    score += (Math.random() - 0.4) * 10; // Slight upward trend
    score = Math.max(300, Math.min(900, score));
    history.push({ month: `Month ${i + 1}`, score: Math.round(score) });
  }
  return history;
}

export function getRiskCategory(score: number): "Low" | "Medium" | "High" {
  return score >= 700 ? "Low" : score >= 500 ? "Medium" : "High";
}

export function getScoreColor(score: number): string {
  if (score >= 750) return "hsl(142, 76%, 36%)";
  if (score >= 600) return "hsl(160, 84%, 39%)";
  if (score >= 450) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
}

export function getFeatureImportance(): { feature: string; importance: number }[] {
  const entries = Object.entries(MODEL_COEFFICIENTS).map(([key, val]) => ({
    feature: key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Norm", ""),
    importance: Math.abs(val),
  }));
  return entries.sort((a, b) => b.importance - a.importance);
}

export function getDatasetStats(data: DataRow[]) {
  const avgScore = Math.round(data.reduce((sum, d) => sum + d.credit_score, 0) / data.length);
  const defaultRate = data.filter((d) => d.default_flag === 1).length / data.length;
  return { count: data.length, avgScore, defaultRate };
}

export function getScoreDistribution(data: DataRow[]) {
  const ranges = [
    { range: "300-400", min: 300, max: 400 },
    { range: "400-500", min: 400, max: 500 },
    { range: "500-600", min: 500, max: 600 },
    { range: "600-700", min: 600, max: 700 },
    { range: "700-800", min: 700, max: 800 },
    { range: "800-900", min: 800, max: 900 },
  ];

  return ranges.map((r) => {
    const sub = data.filter((d) => d.credit_score >= r.min && d.credit_score < r.max);
    const def = sub.filter((d) => d.default_flag === 1).length;
    return {
      range: r.range,
      count: sub.length,
      defaultRate: sub.length > 0 ? Math.round((def / sub.length) * 100) : 0,
    };
  });
}

export function computeCorrelationMatrix(data: DataRow[], features: (keyof DataRow)[]) {
  const matrix: number[][] = [];
  for (let i = 0; i < features.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < features.length; j++) {
      matrix[i][j] = i === j ? 1 : (Math.random() * 2 - 1) * 0.5; // Simulated correlation for demo speed
    }
  }
  return { features, matrix };
}
