import { use, useCallback } from "react";
import { exercise, workout } from "../schema/schema";
import database from "../database";
import WorkoutForm from "../components/WorkoutForm";
import { useParams } from "react-router";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import Modal from "../components/Modal";
import { useWorkout } from "../queries/workouts";

// temporarily need to define the schema here until https://github.com/drizzle-team/drizzle-orm/issues/3734 is fixed
const editWorkoutSchema = createUpdateSchema(workout, {
  id: z.coerce.number(),
  name: z.string().nonempty(),
  scheduleId: z.number().optional(),
}).extend({
  exercises: createUpdateSchema(exercise, {
    id: z.coerce.number().optional(),
    name: z.string().nonempty(),
    workoutId: z.coerce.number(),
    type: z.string().nonempty(),
  }).array(),
});

export default function EditWorkout() {
  const { workoutId } = useParams();
  if (!workoutId) throw new Error("workoutId is required");
  const db = use(database);
  const { data: workoutValue } = useWorkout(workoutId);
  const handleSubmit = useCallback(
    async (result: z.infer<typeof editWorkoutSchema>) => {
      await db.transaction(async (tx) => {
        await tx
          .update(workout)
          .set(result)
          .where(eq(workout.id, workoutValue.id!));
        for (const exerciseValue of workoutValue.exercises) {
          if (exerciseValue.id) {
            await tx
              .update(exercise)
              .set(exerciseValue)
              .where(eq(exercise.id, exerciseValue.id));
          } else {
            await tx.insert(exercise).values(exerciseValue);
          }
        }
      });
    },
    [],
  );

  return (
    <Modal>
      <h1>Edit Workout</h1>
      <WorkoutForm
        initialWorkout={workoutValue}
        onSubmit={handleSubmit}
        schema={editWorkoutSchema}
      />
    </Modal>
  );
}
