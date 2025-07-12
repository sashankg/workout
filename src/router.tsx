import { createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import Workouts, { workoutsLoader } from './routes/Workouts';
import NewWorkout, { newWorkoutAction } from './routes/NewWorkout';
import Modal from './components/Modal';

export default createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <h1>Home</h1> },
      {
        path: 'workouts', element: <Workouts />, loader: workoutsLoader, children: [
          {
            path: 'new',
            element: <Modal><NewWorkout /></Modal>,
            action: newWorkoutAction
          }
        ]
      }
    ]
  }
]);
