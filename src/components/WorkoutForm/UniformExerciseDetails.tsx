import { useEffect, useState } from "react";
import Input from "../form/Input";
import Label from "../form/Label";
import { Workout } from "../../queries/workouts";
import { useFieldArray } from "react-hook-form";
import { useInputName } from "../form/NameContext";

interface UniformExerciseDetailsProps {
  exerciseId?: number;
  initialDetails?: Workout["exercises"][0]["details"];
}

export default function UniformExerciseDetails({
  exerciseId,
  initialDetails,
}: UniformExerciseDetailsProps) {
  const [sets, setSets] = useState(initialDetails?.length ?? 3);
  const [reps, setReps] = useState(initialDetails?.[0]?.reps ?? 8);

  const name = useInputName(`exerciseDetails`);

  const fieldsArray = useFieldArray({
    name,
  });

  useEffect(() => {
    fieldsArray.replace(
      Array.from({ length: sets }).map((_, index) => ({
        id: initialDetails?.[index]?.id,
        exerciseId,
        setNumber: index,
        reps,
        isAmrap: 0,
      })),
    );
  }, [sets]);

  return (
    <>
      <div className="flex">
        <Label text="Sets">
          <Input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
          />
        </Label>
        <Label text="Reps">
          <Input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            step={0.5}
          />
        </Label>
      </div>
    </>
  );
}

/*
 *
 * {Array.from({ length: sets }).map((_, index) => (
        <ObjectInput name={`exerciseDetails.${index}`}>
          <Input type="hidden" value={reps} readOnly name="reps" />
          <Input name="setNumber" type="hidden" value={index} />
          <Input name="isAmrap" type="hidden" value={0} />
        </ObjectInput>
      ))}
 * */
