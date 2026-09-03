import { useEffect, useState, type FormEvent } from 'react'
import * as eventsApi from '../api/events'
import { extractErrorMessage } from '../api/client'
import type { Event, EventInput } from '../api/types'
import { Card, EmptyState, ErrorBanner, Spinner } from '../components/ui'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { formatTimeRange, toApiTime, toTimeInputValue, todayIso } from '../lib/format'

const emptyForm: EventInput = {
  title: '',
  description: '',
  date: todayIso(),
  startTime: '09:00:00',
  endTime: '10:00:00',
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventInput>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [filterDate, setFilterDate] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    eventsApi
      .getEvents()
      .then(({ data }) => setEvents(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEditForm = (event: Event) => {
    setEditingId(event.id)
    setForm({
      title: event.title,
      description: event.description ?? '',
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
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
    const payload: EventInput = {
      ...form,
      startTime: toApiTime(form.startTime),
      endTime: toApiTime(form.endTime),
    }
    try {
      if (editingId) {
        await eventsApi.updateEvent(editingId, payload)
      } else {
        await eventsApi.createEvent(payload)
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
      await eventsApi.deleteEvent(id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const sorted = [...events]
    .filter((event) => !filterDate || event.date === filterDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add event
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Filter by date</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="text-sm text-slate-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <ErrorBanner message={!showForm ? error : null} />

      {showForm && (
        <Card className="mb-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            {editingId ? 'Edit event' : 'New event'}
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
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
          <EmptyState message={filterDate ? 'No events on this date.' : 'No events yet.'} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {sorted.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-500">
                    {event.date} · {formatTimeRange(event.startTime, event.endTime)}
                  </p>
                  {event.description && (
                    <p className="text-sm text-slate-500">{event.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openEditForm(event)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setPendingDeleteId(event.id)}
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
          message="Delete this event? This can't be undone."
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => handleDelete(pendingDeleteId)}
        />
      )}
    </div>
  )
}
