import { BrowserRouter, Route, Routes } from "react-router";
import Root from "./Root";
import Workouts from "./Workouts";
import NewWorkout from "./NewWorkout";
import EditWorkout from "./EditWorkout";
import Home from "./Home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Root />}>
          <Route index element={<Home />} />
          <Route path="workouts" element={<Workouts />}>
            <Route index element={null} />
            <Route path="new" element={<NewWorkout />} />
            <Route path="edit/:workoutId" element={<EditWorkout />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
