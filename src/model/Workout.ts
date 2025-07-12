import z from 'zod'
import Exercise from './Exercise'
import DbObject from './DbObject'

const Workout = DbObject.extend({
  name: z.string(),
  exercises: z.array(z.object({
    exercise: Exercise,
    sets: z.number(),
    reps: z.number(),
  }))
})

export type Workout = z.infer<typeof Workout>


