import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import db, { Database } from '../db'

interface RootContext {
  db: Database | undefined
}

export const Route = createRootRouteWithContext<RootContext>()({
  beforeLoad: async ({ context }) => {
    console.log("beforeLoad", context)
    return {
      db: await db(),
    }
  },
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})