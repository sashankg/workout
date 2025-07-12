import { Suspense } from "react";
import { Outlet } from "react-router";

export default function Root() {
  return (
    <div>
      <h1>Workout</h1>
      <Suspense fallback="Loading...">
        <Outlet />
      </Suspense>
    </div>
  );
}
