import { use, useCallback } from "react";
import { exercise, exerciseDetails, workout } from "../schema/schema";
import database from "../database";
import WorkoutForm from "../components/WorkoutForm";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import Modal from "../components/Modal";
import { useQueryClient } from "@tanstack/react-query";

// temporarily need to define the schema here until https://github.com/drizzle-team/drizzle-orm/issues/3734 is fixed
const schema = z.object({
  workout: createInsertSchema(workout, {
    id: z
      .string()
      .length(0)
      .transform(() => undefined),
    name: z.string(),
    scheduleId: z.number().optional(),
  }).extend({
    exercises: createInsertSchema(exercise, {
      id: z
        .string()
        .length(0)
        .transform(() => undefined),
      name: z.string(),
      workoutId: z.coerce.number(),
      type: z.string().optional(),
      weightIncrement: z.number().default(5),
    })
      .extend({
        exerciseDetails: createInsertSchema(exerciseDetails, {
          id: z
            .string()
            .length(0)
            .transform(() => undefined)
            .optional(),
          exerciseId: z.undefined(),
          reps: z.coerce.number(),
          setNumber: z.coerce.number(),
          isAmrap: z.coerce.number(),
        }).array(),
      })
      .array(),
  }),
});

export default function NewWorkout() {
  const queryClient = useQueryClient();
  const db = use(database);
  const handleSubmit = useCallback(async (result: z.infer<typeof schema>) => {
    db.transaction(async (tx) => {
      const [{ workoutId }] = await tx
        .insert(workout)
        .values(result.workout)
        .returning({ workoutId: workout.id });

      const exerciseIds = await tx
        .insert(exercise)
        .values(
          result.workout.exercises.map((exercise) => ({
            ...exercise,
            workoutId,
          })),
        )
        .returning({ exerciseId: exercise.id });

      await Promise.all(
        exerciseIds.map(({ exerciseId }, index) => {
          tx.insert(exerciseDetails).values(
            result.workout.exercises[index].exerciseDetails.map((details) => ({
              ...details,
              exerciseId,
            })),
          );
        }),
      );
      await queryClient.invalidateQueries({ queryKey: ["workouts"] });
    });
  }, []);

  return (
    <Modal>
      <h1>New Workout</h1>
      <WorkoutForm onSubmit={handleSubmit} schema={schema} />
    </Modal>
  );
}
