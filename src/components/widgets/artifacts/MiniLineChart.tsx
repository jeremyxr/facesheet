import { cn } from '../../../lib/cn'

interface LineData {
  label: string
  value: number
}

interface MiniLineChartProps {
  data: LineData[]
  height?: number
  lineColor?: string
  fillColor?: string
  className?: string
}

function MiniLineChart({ data, height = 80, lineColor = 'var(--color-brand-primary)', fillColor = 'var(--color-brand-primary-light)', className }: MiniLineChartProps) {
  if (data.length < 2) return null

  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min || 1

  // Use a fixed viewBox with good proportions — SVG scales to fill the container
  const vw = 240
  const vh = 80
  const padX = 16
  const padTop = 12
  const padBot = 4
  const chartW = vw - padX * 2
  const chartH = vh - padTop - padBot

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + (1 - (d.value - min) / range) * chartH,
  }))

  // Smooth curve using cubic bezier
  function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const cpx = (curr.x + next.x) / 2
      d += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`
    }
    return d
  }

  const linePath = smoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${vh} L ${points[0].x} ${vh} Z`

  return (
    <div className={cn('w-full', className)}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`fill-${lineColor.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#fill-${lineColor.replace(/[^a-zA-Z0-9]/g, '')})`}
        />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="white"
            stroke={lineColor}
            strokeWidth={1.5}
          />
        ))}
      </svg>
      {data[0].label && (
        <div className="flex justify-between mt-1" style={{ padding: `0 ${(padX / vw) * 100}%` }}>
          {data.map((d, i) => (
            <div key={i} className="text-[10px] text-[var(--color-text-muted)] leading-none text-center" style={{ width: 0 }}>
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { MiniLineChart }
export type { LineData }
