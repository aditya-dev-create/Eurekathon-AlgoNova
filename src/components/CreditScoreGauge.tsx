import { motion } from "framer-motion";
import { getScoreColor, getRiskCategory } from "@/lib/trustscore";

interface Props {
  score: number;
  size?: number;
}

export default function CreditScoreGauge({ score, size = 220 }: Props) {
  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius; // half circle
  const normalized = (score - 300) / 600;
  const strokeDashoffset = circumference * (1 - normalized);
  const color = getScoreColor(score);
  const risk = getRiskCategory(score);

  const riskColors: Record<string, string> = {
    Low: "text-emerald-500",
    Medium: "text-orange-500",
    High: "text-red-500",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Track */}
        <path
          d={`M 12 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2 + 10}`}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value */}
        <motion.path
          d={`M 12 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Labels */}
        <text x="12" y={size / 2 + 28} textAnchor="start" className="fill-muted-foreground text-xs">
          300
        </text>
        <text x={size - 12} y={size / 2 + 28} textAnchor="end" className="fill-muted-foreground text-xs">
          900
        </text>
      </svg>

      <motion.div
        className="flex flex-col items-center -mt-14"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-display text-5xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className={`text-sm font-semibold mt-1 ${riskColors[risk]}`}>{risk} Risk</span>
      </motion.div>
    </div>
  );
}
