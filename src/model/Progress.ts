import { z } from 'zod'
import { DbObject } from './DbObject'

const Progress = new DbObject({
  weight: z.number(),
  notes: z.string(),
})

export default Progress
