import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SegmentedControlProps {
    options: string[]
    value: string
    onChange: (value: string) => void
    name: string
}

export function SegmentedControl({ options, value, onChange, name }: SegmentedControlProps) {
    return (
        <div className="segmented w-full p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative flex">
            {options.map((option) => {
                const isActive = value === option
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={cn(
                            "relative z-10 flex-1 px-2 py-1.5 text-[0.85rem] font-semibold transition-colors duration-200",
                            isActive ? "text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        )}
                        aria-checked={isActive}
                        role="radio"
                        name={name}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`${name}-pill`}
                                className="absolute inset-0 z-[-1] bg-orange-500 rounded-lg shadow-sm shadow-orange-500/20"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        {option}
                    </button>
                )
            })}
        </div>
    )
}
