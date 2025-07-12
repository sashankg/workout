import { ActionFunction, Form, redirect } from "react-router-dom";
import getDb from "../getDb";
import { useState } from "react";

export const newWorkoutAction: ActionFunction = async ({ request, context }) => {
  const db = await getDb();
  const data = await request.formData()
  await db.add('workouts', {
    name: data.get('name')?.toString(),
    exercises: data.getAll('exercise'),
  })
  // db.add('workouts', { name: params.get('name') });
  return redirect('..');
}

export default function NewWorkout() {
  const [numExercised, setNumExercises] = useState(0)
  return <div>
    <h1>New Workout</h1>
    <Form method="post">
      <label>
        Name
        <input type="text" name="name" />
      </label>
      <label>
        Exercies
        <button type="button" onClick={() => setNumExercises(numExercised + 1)}>Add</button>
        {Array.from({ length: numExercised }).map((_, index) => <label key={index}>
          Exercise {index + 1}
          <input type="text" name="exercise" />
          <input type="text" name="exercise.type" />
        </label>)}
      </label>
      <button type="submit">Save</button>
    </Form>
  </div>;
}
