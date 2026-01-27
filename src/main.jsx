import React from 'react'
import ReactDOM from 'react-dom/client'
import WorkoutScreen from './WorkoutScreen.jsx'
import ExerciseSelector from './ExerciseSelector.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <WorkoutScreen /> */}
    <ExerciseSelector />
  </React.StrictMode>,
)
