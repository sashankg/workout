import { use } from "react";
import database, { DatabaseQuery } from "../database";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { workout } from "../schema/schema";

const queryConfig = {
  with: {
    exercises: {
      with: {
        details: true,
      },
    },
  },
} as const;

export type Workout = DatabaseQuery<"workout", typeof queryConfig>;

export function useWorkouts() {
  const db = use(database);
  return useSuspenseQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: async () => {
      return (await db.query.workout.findMany(queryConfig)) ?? [];
    },
  });
}

export function useWorkout(workoutId: string) {
  const db = use(database);
  return useSuspenseQuery<Workout>({
    queryKey: ["workouts", "id", workoutId],
    queryFn: async () => {
      const workoutValue = await db.query.workout.findMany({
        where: eq(workout?.id, parseInt(workoutId!)),
        ...queryConfig,
      });
      return workoutValue[0] ?? null;
    },
  });
}
