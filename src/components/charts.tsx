import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Filler)

const PRIMARY = '#7953c5'
const GRID = '#ecebf1'
const INK_MUTED = '#706b7c'

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#272537',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      titleFont: { family: 'DM Sans', weight: 600 },
      bodyFont: { family: 'DM Sans' },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { color: GRID }, ticks: { color: INK_MUTED, font: { family: 'DM Sans', size: 11 } } },
    y: {
      beginAtZero: true,
      grid: { color: GRID },
      border: { display: false },
      ticks: { color: INK_MUTED, font: { family: 'DM Sans', size: 11 }, precision: 0 },
    },
  },
} as const

/** Single-series trend line (one hue, no legend — the card title names it). */
export function TrendLine({ labels, values, label }: { labels: string[]; values: number[]; label: string }) {
  const options = baseOptions as unknown as ChartOptions<'line'>
  return (
    <div className="h-56">
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              label,
              data: values,
              borderColor: PRIMARY,
              backgroundColor: 'rgba(121, 83, 197, 0.10)',
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBorderWidth: 2,
              pointHoverBorderColor: '#fff',
              pointBackgroundColor: PRIMARY,
            },
          ],
        }}
      />
    </div>
  )
}

/** Single-series horizontal bars, e.g. accuracy by topic. */
export function HBars({ labels, values, label, suffix = '' }: { labels: string[]; values: number[]; label: string; suffix?: string }) {
  const options = {
    ...baseOptions,
    indexAxis: 'y',
    interaction: { mode: 'nearest', axis: 'y', intersect: false },
    plugins: {
      ...baseOptions.plugins,
      tooltip: { ...baseOptions.plugins.tooltip, callbacks: { label: (c: { parsed: { x: number } }) => `${label}: ${c.parsed.x}${suffix}` } },
    },
    scales: {
      x: { ...baseOptions.scales.y, max: suffix === '%' ? 100 : undefined },
      y: { ...baseOptions.scales.x },
    },
  } as unknown as ChartOptions<'bar'>
  return (
    <div style={{ height: Math.max(160, labels.length * 34) }}>
      <Bar
        options={options}
        data={{
          labels,
          datasets: [{ label, data: values, backgroundColor: PRIMARY, borderRadius: 4, borderSkipped: 'start', barThickness: 16 }],
        }}
      />
    </div>
  )
}
