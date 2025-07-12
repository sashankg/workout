import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";
import database from "../database";
import { Link } from "react-router";

export default function Home() {
  const db = use(database);
  const { data: workouts } = useSuspenseQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      return await db.query.workout.findMany();
    },
  });
  return (
    <>
      <ul>
        {workouts.map((workout) => (
          <li>
            <Link to={`/session/${workout.id}`}>{workout.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/workouts">Manage workouts</Link>
    </>
  );
}
