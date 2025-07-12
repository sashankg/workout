import { relations } from "drizzle-orm";
import { sqliteTable, int, text, real } from "drizzle-orm/sqlite-core";

export const workoutSchedule = sqliteTable("workoutSchedule", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
}, []);

export const workout = sqliteTable("workout", {
  id: int().primaryKey({ autoIncrement: true }),
  scheduleId: int("schedule_id").references(() => workoutSchedule.id),
  name: text(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
  exercises: many(exercise),
}));

export const exercise = sqliteTable("exercise", {
  id: int().primaryKey({ autoIncrement: true }),
  workoutId: int("workout_id").references(() => workout.id),
  name: text(),
  weightIncrement: real(),
  type: text(),
});

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  workout: one(workout, {
    references: [workout.id],
    fields: [exercise.workoutId],
  }),
  details: many(exerciseDetails),
}));

export const exerciseDetails = sqliteTable("set", {
  id: int().primaryKey({ autoIncrement: true }),
  exerciseId: int("exercise_id").references(() => exercise.id),
  setNumber: int(),
  reps: int(),
  isAmrap: int(),
});

export const exerciseDetailsRelations = relations(
  exerciseDetails,
  ({ one }) => ({
    exercise: one(exercise, {
      references: [exercise.id],
      fields: [exerciseDetails.exerciseId],
    }),
  }),
);

export const setProgress = sqliteTable("setProgress", {
  id: int().primaryKey({ autoIncrement: true }),
  date: int(),
  set: int("set_id").references(() => exerciseDetails.id),
  weight: int(),
  reps: int(),
});
