import Input from "./form/Input";
import { ZodSchema } from "zod";
import Label from "./form/Label";
import Button from "./Button";
import Form from "./form/Form";
import ExerciseInput from "./WorkoutForm/ExerciseInput";
import { Workout } from "../queries/workouts";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import ListInput from "./form/ListInput";
import { zodResolver } from "@hookform/resolvers/zod";

interface WorkoutFormValues extends FieldValues {
  workout?: {
    id?: number;
    name?: string;
  };
  exercises: {
    id?: number;
    name?: string;
    sets?: {
      id?: string;
      reps?: number;
      weight?: number;
    }[];
  }[];
}

interface WorkoutFormProps<T extends WorkoutFormValues> {
  initialWorkout?: Workout;
  onSubmit: (workout: T) => Promise<void>;
  schema: ZodSchema<T>;
}

export default function WorkoutForm<T extends WorkoutFormValues>({
  initialWorkout,
  onSubmit,
  schema,
}: WorkoutFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
  });
  const exerciseMethods = useFieldArray<any>({
    control: methods.control,
    name: "workout.exercises",
  });

  console.log(methods.formState.errors);
  console.log(methods.getValues());

  return (
    <Form onSubmit={onSubmit} formMethods={methods}>
      <Input type="hidden" name="workout.id" value={initialWorkout?.id} />
      <Label text="Workout Name">
        <Input
          type="text"
          name="workout.name"
          defaultValue={initialWorkout?.name ?? ""}
        />
      </Label>
      <Button type="button" onClick={() => exerciseMethods.append({})}>
        Add Exercise
      </Button>
      <ol className="timeline">
        <ListInput name="workout.exercises" fieldsArray={exerciseMethods}>
          {(_, index) => (
            <ExerciseInput initialExercise={initialWorkout?.exercises[index]} />
          )}
        </ListInput>
      </ol>

      <Button type="submit">Save</Button>
    </Form>
  );
}
