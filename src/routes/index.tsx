import { createFileRoute } from '@tanstack/react-router'
import db from '../db'
import { sql } from 'drizzle-orm'

export const Route = createFileRoute('/')({
    async loader({ context }) {
        const result = await context.db.get(sql`SELECT ${1}`)
        console.log(result)
        return result
    },
  component() {
    const result = Route.useLoaderData()
    return <div>Hello "/"! {result}</div>
  },
})