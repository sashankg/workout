import z from 'zod'
import DbObject from './DbObject'

const Exercise = DbObject.extend({
  name: z.string(),
})

export type Exercise = z.infer<typeof Exercise>

export default Exercise
