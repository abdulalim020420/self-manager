import { apiClient } from './client'
import type { DayOfWeek, RecurringActivity, RecurringActivityInput } from './types'

export function getRecurringActivities() {
  return apiClient.get<RecurringActivity[]>('/recurring-activities')
}

export function getRecurringActivitiesByDay(day: DayOfWeek) {
  return apiClient.get<RecurringActivity[]>(`/recurring-activities/day/${day}`)
}

export function createRecurringActivity(input: RecurringActivityInput) {
  return apiClient.post<RecurringActivity>('/recurring-activities', input)
}

export function updateRecurringActivity(id: number, input: RecurringActivityInput) {
  return apiClient.put<RecurringActivity>(`/recurring-activities/${id}`, input)
}

export function deleteRecurringActivity(id: number) {
  return apiClient.delete<void>(`/recurring-activities/${id}`)
}
