CREATE TABLE `exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer,
	`name` text,
	`weightIncrement` real,
	`type` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer,
	`setNumber` integer,
	`reps` integer,
	`isAmrap` integer,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `setProgress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer,
	`set_id` integer,
	`weight` integer,
	`reps` integer,
	FOREIGN KEY (`set_id`) REFERENCES `set`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`schedule_id` integer,
	`name` text,
	FOREIGN KEY (`schedule_id`) REFERENCES `workoutSchedule`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workoutSchedule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
