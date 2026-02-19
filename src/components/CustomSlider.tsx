import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface CustomSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    label: string
    suffix?: string
}

export function CustomSlider({ className, label, suffix, ...props }: CustomSliderProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                <span className="mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {props.value?.[0]}
                    {suffix}
                </span>
            </div>
            <SliderPrimitive.Root
                className={cn("relative flex items-center select-none touch-none w-full h-5", className)}
                {...props}
            >
                <SliderPrimitive.Track className="bg-slate-200 dark:bg-slate-800 relative grow rounded-full h-[6px]">
                    <SliderPrimitive.Range className="absolute bg-indigo-600 rounded-full h-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                    className="block w-5 h-5 bg-white border-2 border-indigo-600 shadow-bespoke rounded-full hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                    aria-label={label}
                />
            </SliderPrimitive.Root>
        </div>
    )
}
