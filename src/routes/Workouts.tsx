import { Link, Outlet } from "react-router-dom";
import getDb from "../getDb";
import useLoaderData from "../util/useLoaderData";

export async function workoutsLoader() {
  const db = await getDb()
  const workouts = await db.getAll('workouts')
  return workouts
}
export default function Workouts() {
  const workouts = useLoaderData<typeof workoutsLoader>()
  return <div>
    <h1>Workout</h1>
    <Link to="new"><button>New</button></Link>
    <ul>
      {workouts.map(workout => (
        <li key={workout.id}>{workout.name}</li>
      ))}
    </ul>
    <Outlet />
  </div>;
}
