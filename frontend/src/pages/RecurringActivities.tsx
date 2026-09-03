import { useEffect, useState, type FormEvent } from 'react'
import * as recurringApi from '../api/recurringActivities'
import { extractErrorMessage } from '../api/client'
import type { RecurringActivity, RecurringActivityInput } from '../api/types'
import { Card, EmptyState, ErrorBanner, Spinner } from '../components/ui'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DAYS_OF_WEEK, formatTimeRange, toApiTime, toTimeInputValue } from '../lib/format'

const emptyForm: RecurringActivityInput = {
  title: '',
  description: '',
  dayOfWeek: 'MONDAY',
  startTime: '09:00:00',
  endTime: '10:00:00',
}

function dayLabel(day: string): string {
  return day.charAt(0) + day.slice(1).toLowerCase()
}

export function RecurringActivities() {
  const [activities, setActivities] = useState<RecurringActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<RecurringActivityInput>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    recurringApi
      .getRecurringActivities()
      .then(({ data }) => setActivities(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEditForm = (activity: RecurringActivity) => {
    setEditingId(activity.id)
    setForm({
      title: activity.title,
      description: activity.description ?? '',
      dayOfWeek: activity.dayOfWeek,
      startTime: activity.startTime,
      endTime: activity.endTime,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload: RecurringActivityInput = {
      ...form,
      startTime: toApiTime(form.startTime),
      endTime: toApiTime(form.endTime),
    }
    try {
      if (editingId) {
        await recurringApi.updateRecurringActivity(editingId, payload)
      } else {
        await recurringApi.createRecurringActivity(payload)
      }
      closeForm()
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setPendingDeleteId(null)
    try {
      await recurringApi.deleteRecurringActivity(id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const dayIndex = (day: string) => DAYS_OF_WEEK.indexOf(day as (typeof DAYS_OF_WEEK)[number])
  const sorted = [...activities].sort(
    (a, b) => dayIndex(a.dayOfWeek) - dayIndex(b.dayOfWeek) || a.startTime.localeCompare(b.startTime),
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Recurring activities</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add activity
        </button>
      </div>

      <ErrorBanner message={!showForm ? error : null} />

      {showForm && (
        <Card className="mb-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            {editingId ? 'Edit activity' : 'New activity'}
          </h2>
          <ErrorBanner message={error} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Day</label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) =>
                    setForm({ ...form, dayOfWeek: e.target.value as RecurringActivityInput['dayOfWeek'] })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {dayLabel(day)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Start</label>
                <input
                  type="time"
                  required
                  value={toTimeInputValue(form.startTime)}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">End</label>
                <input
                  type="time"
                  required
                  value={toTimeInputValue(form.endTime)}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {loading ? (
          <Spinner />
        ) : sorted.length === 0 ? (
          <EmptyState message="No recurring activities yet." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {sorted.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-500">
                    {dayLabel(activity.dayOfWeek)} · {formatTimeRange(activity.startTime, activity.endTime)}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-slate-500">{activity.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openEditForm(activity)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setPendingDeleteId(activity.id)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-sm hover:bg-slate-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {pendingDeleteId !== null && (
        <ConfirmDialog
          message="Delete this recurring activity? This can't be undone."
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => handleDelete(pendingDeleteId)}
        />
      )}
    </div>
  )
}
