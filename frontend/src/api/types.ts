export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface User {
  id: number
  email: string
}

export interface AuthResponse {
  token: string
}

export interface Event {
  id: number
  title: string
  description?: string
  date: string // ISO date (yyyy-MM-dd)
  startTime: string // HH:mm:ss
  endTime: string // HH:mm:ss
  userId?: number
}

export type EventInput = Omit<Event, 'id' | 'userId'>

export interface RecurringActivity {
  id: number
  title: string
  description?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  userId?: number
}

export type RecurringActivityInput = Omit<RecurringActivity, 'id' | 'userId'>

export interface ScheduleSlot {
  title: string
  description?: string
  startTime: string
  endTime: string
  source: 'RECURRING' | 'EVENT'
}
