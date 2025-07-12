import type { DBSchema } from "idb"

export interface Progress {
  weight: number
  notes: string
}

export interface Exercise {
  id: number
  name: string
}

export interface Workout {
  id?: number
  name: string
  exercises: [{
    id: number
    sets: number
    reps: number
  }]
}

export interface Session {
  id: number
  date: string
  workoutId: number
  progress: Record<number, Progress>
}

export interface Schema extends DBSchema {
  workouts: {
    key: number
    value: Workout
  }
  exercises: {
    key: number
    value: Exercise
  }
  sessions: {
    key: number
    value: Session
  }
}
