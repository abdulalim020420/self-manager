import { apiClient } from './client'
import type { ScheduleSlot } from './types'

export function getScheduleForDate(date: string) {
  return apiClient.get<ScheduleSlot[]>(`/calendar/${date}`)
}
