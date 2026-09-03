import { useEffect, useState } from 'react'
import { getScheduleForDate } from '../api/calendar'
import { extractErrorMessage } from '../api/client'
import type { ScheduleSlot } from '../api/types'
import { Card, EmptyState, ErrorBanner, Spinner } from '../components/ui'
import { formatDateLabel, formatTimeRange, todayIso } from '../lib/format'

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const next = new Date(y, m - 1, d + days)
  return next.toISOString().slice(0, 10)
}

export function Dashboard() {
  const [date, setDate] = useState(todayIso())
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getScheduleForDate(date)
      .then(({ data }) => {
        if (!cancelled) setSlots(data)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [date])

  const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{formatDateLabel(date)}</h1>
          <p className="text-sm text-slate-500">Recurring activities and events combined</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate((d) => shiftDate(d, -1))}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            ←
          </button>
          <button
            onClick={() => setDate(todayIso())}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Today
          </button>
          <button
            onClick={() => setDate((d) => shiftDate(d, 1))}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            →
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />

      <Card>
        {loading ? (
          <Spinner />
        ) : sorted.length === 0 ? (
          <EmptyState message="Nothing scheduled for this day." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {sorted.map((slot, idx) => (
              <li key={idx} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{slot.title}</p>
                  {slot.description && (
                    <p className="text-sm text-slate-500">{slot.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {formatTimeRange(slot.startTime, slot.endTime)}
                  </span>
                  <span className="rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-600">
                    {slot.source === 'EVENT' ? 'Event' : 'Recurring'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
