import React from 'react'
import ReactDOM from 'react-dom/client'
import WorkoutScreen from './WorkoutScreen.jsx'
import ExerciseSelector from './ExerciseSelector_v2.jsx'
// import ExerciseSelector from './ExerciseSelector_v1.jsx'

import WorkoutHeader from './WorkoutHeader.jsx'

import App from './App.jsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <WorkoutScreen /> */}
    {/* <ExerciseSelector /> */}
    {/* <WorkoutHeader /> */}
  </React.StrictMode>,
)
