import { apiClient } from './client'
import type { Event, EventInput } from './types'

export function getEvents() {
  return apiClient.get<Event[]>('/events')
}

export function getEventsByDate(date: string) {
  return apiClient.get<Event[]>(`/events/date/${date}`)
}

export function createEvent(input: EventInput) {
  return apiClient.post<Event>('/events', input)
}

export function updateEvent(id: number, input: EventInput) {
  return apiClient.put<Event>(`/events/${id}`, input)
}

export function deleteEvent(id: number) {
  return apiClient.delete<void>(`/events/${id}`)
}
