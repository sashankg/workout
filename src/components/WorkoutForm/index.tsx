import { useState } from "react";
import { exercise, exerciseDetails, workout } from "../../schema/schema";
import { useQueryClient } from "@tanstack/react-query";
import Input from "../form/Input";
import { ZodSchema } from "zod";
import ObjectInput from "../form/ObjectInput";
import Label from "../form/Label";
import Button from "../Button";
import Form from "../form/Form";
import useFormMutation from "../../util/useFormMutation";

type Exercise = typeof exercise.$inferSelect & {
  details?: (typeof exerciseDetails.$inferSelect)[];
};

type Workout = typeof workout.$inferSelect & {
  exercises: Exercise[];
};

interface ExerciseInputProps {
  initialExercise?: Exercise;
}

function UniformExerciseDetails({ initialExercise }: ExerciseInputProps) { }

function ExerciseInput({ initialExercise }: ExerciseInputProps) {
  const [numSets, setNumSets] = useState(initialExercise?.details?.length ?? 0);
  const [uniform, setUniform] = useState(true);
  return (
    <li className="flex flex-col gap-1">
      <ObjectInput name="exercises">
        <Input type="hidden" name="id" value={initialExercise?.id} />
        <Input
          type="hidden"
          name="workoutId"
          value={initialExercise?.workoutId ?? undefined}
        />
        <div className="flex">
          <Label text="Name" className="flex-1">
            <Input
              type="text"
              name="name"
              defaultValue={initialExercise?.name ?? ""}
              key={`name-${initialExercise?.name}`}
            />
          </Label>
          <Label text="Uniform">
            <input
              type="checkbox"
              checked={uniform}
              onChange={() => setUniform((uniform) => !uniform)}
              className="mt-1"
            />
          </Label>
        </div>
      </ObjectInput>
      {uniform ? (
        <>
          <ObjectInput name="exerciseDetails">
            <Input
              type="hidden"
              name="id"
              value={initialExercise?.details?.[0]?.id}
            />
            <Input
              type="hidden"
              name="exerciseId"
              value={initialExercise?.id}
            />
            <div className="flex">
              <Label text="Sets">
                <Input
                  type="number"
                  value={numSets}
                  onChange={(e) => setNumSets(Number(e.target.value))}
                />
              </Label>
              <Label text="Reps">
                <Input
                  type="number"
                  name="reps"
                  defaultValue={initialExercise?.details?.[0]?.reps ?? 0}
                />
              </Label>
              <Label text="Weight Increment">
                <Input
                  type="number"
                  name="weightIncrement"
                  defaultValue={
                    initialExercise?.details?.[0]?.weightIncrement ?? 0
                  }
                />
              </Label>
            </div>
          </ObjectInput>
          {Array.from({ length: numSets - 1 }).map((_, index) => (
            <ObjectInput name="exerciseDetails"></ObjectInput>
          ))}
        </>
      ) : (
        <ol>
          <button
            type="button"
            onClick={() => setNumSets((numSets) => numSets + 1)}
          >
            Add Set
          </button>
          {Array.from({ length: numSets }).map((_, index) => (
            <li>
              <ObjectInput name="exerciseDetails">
                <Input
                  type="hidden"
                  name="id"
                  value={initialExercise?.details?.[index]?.id}
                />
                <Input
                  type="hidden"
                  name="exerciseId"
                  value={initialExercise?.id}
                />
                <Label text="Reps">
                  <Input
                    type="number"
                    name="reps"
                    defaultValue={initialExercise?.details?.[index]?.reps ?? 0}
                  />
                </Label>
                <Label text="Weight Increment">
                  <Input
                    type="number"
                    name="weightIncrement"
                    defaultValue={
                      initialExercise?.details?.[index]?.weightIncrement ?? 0
                    }
                  />
                </Label>
              </ObjectInput>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

interface WorkoutFormProps<T> {
  initialWorkout?: Workout;
  onSubmit: (workout: T) => Promise<void>;
  schema: ZodSchema<T>;
}

export default function WorkoutForm<T>({
  initialWorkout,
  onSubmit,
  schema,
}: WorkoutFormProps<T>) {
  const [numExercises, setNumExercises] = useState(
    initialWorkout?.exercises.length ?? 0,
  );
  const queryClient = useQueryClient();
  const { handleSubmit } = useFormMutation(schema, {
    mutationFn: async (data: T) => {
      await onSubmit(data);
      await queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  return (
    <Form onSubmit={handleSubmit} method="dialog">
      <Input type="hidden" name="id" value={initialWorkout?.id} />
      <Label text="Name">
        <Input
          type="text"
          name="name"
          defaultValue={initialWorkout?.name ?? ""}
        />
      </Label>
      <Label text="Exercises">
        <button
          type="button"
          onClick={() => setNumExercises((numExercised) => numExercised + 1)}
        >
          Add
        </button>
        <ol className="timeline">
          {Array.from({ length: numExercises }).map((_, index) => (
            <ExerciseInput initialExercise={initialWorkout?.exercises[index]} />
          ))}
        </ol>
      </Label>
      <Button type="submit">Save</Button>
    </Form>
  );
}
