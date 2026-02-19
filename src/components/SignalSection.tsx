import * as React from "react"
import { motion } from "framer-motion"

interface SignalSectionProps {
    title: string
    description?: string
    children: React.ReactNode
    icon?: React.ReactNode
    index: number
}

const container = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as any,
            staggerChildren: 0.08,
        },
    }),
}

const item = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
    },
}

export function SignalSection({ title, description, children, icon, index }: SignalSectionProps) {
    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            custom={index}
            className="p-1 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="p-5 space-y-5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50">
                                {icon}
                            </div>
                        )}
                        <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 uppercase text-[0.7rem] tracking-[0.05em] opacity-80">
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-[42px]">
                            {description}
                        </p>
                    )}
                </div>
                <div className="space-y-4">
                    {React.Children.map(children, (child) => (
                        <motion.div variants={item}>{child}</motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
