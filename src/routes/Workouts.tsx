import { useQueryClient } from "@tanstack/react-query";
import { Link, Outlet } from "react-router";
import { useWorkouts } from "../queries/workouts";

export default function Workouts() {
  const { data: workouts } = useWorkouts();
  const queryClient = useQueryClient();
  return (
    <div>
      <h1>Workout</h1>
      <Link to="new">
        <button>New</button>
      </Link>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            {workout.name}
            <Link
              to={`edit/${workout.id}`}
              onClick={() => {
                queryClient.setQueryData(
                  ["workouts", "id", `${workout.id}`],
                  workout,
                );
              }}
            >
              ✏️
            </Link>
            <ul>
              {workout.exercises.map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
