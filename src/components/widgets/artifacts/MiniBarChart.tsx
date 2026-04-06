import { cn } from '../../../lib/cn'

interface BarData {
  label: string
  value: number
}

interface MiniBarChartProps {
  data: BarData[]
  height?: number
  barColor?: string
  className?: string
}

function MiniBarChart({ data, height = 100, barColor = 'var(--color-brand-primary)', className }: MiniBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end justify-between gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div
                className="w-full rounded-t-[3px] transition-all duration-300 min-h-[2px]"
                style={{
                  height: `${pct}%`,
                  backgroundColor: barColor,
                  opacity: 0.8,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-[var(--color-text-muted)] leading-none">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export { MiniBarChart }
export type { BarData }
