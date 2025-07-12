import { useState } from "react";
import Input from "../form/Input";
import Label from "../form/Label";
import { Workout } from "../../queries/workouts";
import UniformExerciseDetails from "./UniformExerciseDetails";

interface ExerciseInputProps {
  initialExercise?: Workout["exercises"][0];
}

export default function ExerciseInput({ initialExercise }: ExerciseInputProps) {
  const [uniform, setUniform] = useState(true);
  return (
    <li className="flex flex-col gap-1">
      <Input type="hidden" name="id" value={initialExercise?.id} />
      <Input
        type="hidden"
        name="workoutId"
        value={initialExercise?.workoutId ?? undefined}
      />
      <div className="flex">
        <Label text="Exercise Name" className="flex-1">
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
      {uniform ? (
        <UniformExerciseDetails
          initialDetails={initialExercise?.details}
          exerciseId={initialExercise?.id}
        />
      ) : null}
    </li>
  );
}
