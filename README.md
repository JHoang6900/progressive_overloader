# Progressive Overloader

## [Live Deployed Demo Link](https://progressive-overloader-demo.vercel.app/)

## Overview

**Description**: Progressive Overloader is a progressive web application (PWA) (wordplay not intended...) that allows users to track their incremental workout progress over time. The core principle of this fitness methodology is similar to iterative software development; by adding small, manageable weight over time (often in the form of 2.5-5lbs), the user challenges their muscle fibers to adapt. The result is that many small changes over time lead to great results.  

**The Problem:** Tracking progressive overload with a simple notes app is messy and mentally taxing. Lifters often forget the exact weight or rep scheme they used during their last session. That mental overhead of organizing this data creates friction that disrupts the actual workout, leaving users guessing and unknowingly sabotaging their workout sessions. 

**The Solution & Key Learnings:** This frictionless, mobile-first application acts as a highly optimized digital training log. Building this project provided deep, hands-on experience in *relational database design* (normalizing deeply nested frontend state into strict PostgreSQL tables), *offline-first caching* (handling unreliable gym Wi-Fi), and *modern DevOps* (engineering a multi-environment CI/CD pipeline via Vercel).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [User Stories](#user-stories)
- [License](#license)

## Installation

This application is deployed with a live demo link. 
Please refer to [Live Deployed Demo Link](#live-deployed-demo-link) to view it without installation. 

However, if you'd like to install this application please follow the following steps:

1.  download or use `git clone git@github.com:JHoang6900/progressive_overloader.git` to obtain a copy on your local machine.

2. Navigate into the project directory and install dependencies using `npm install`

3. Set up your environment variables. Create a `.env` file in the root directory and add your Supabase credentials and UI configurations:

   `VITE_SUPABASE_URL=your_supabase_url`
   `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
   `VITE_USER_OPTIONS="Guest, Recruiter"`
   `VITE_GYM_OPTIONS="Demo Gym, Public Studio"`

4. Lastly, start the Vite development server with `npm run dev`

5. Enjoy/Go get them gainz!!!

## Usage

Progressive Overloader is designed to be used actively on the gym floor. 
For best user experience, please install this app as a Progressive Web App by adding it to your homescreen to get an app-like experience!

1. Open the application (or save it to your mobile home screen as a PWA).
2. Select your current gym location from the Welcome Screen to account for specific equipment variations.
3. Add exercises to your current workout, logging the sets, reps, and weight.
4. Click "Save Workout" to seamlessly serialize and push your data to the backend database.

## Features

- **Location-Aware Tracking:** Logs the specific gym location for each workout to accurately account for equipment and cable machine tension discrepancies.
- **Offline-First Resilience:** Temporarily caches workout data in the browser's `localStorage` if the gym's Wi-Fi drops, automatically syncing to the database once the connection is restored.
- **Frictionless PWA Design:** Optimized with large touch targets to be saved directly to a mobile home screen, acting as a native application without an app store download.
- **Environment-Agnostic Architecture:** Configured to run distinct public (Demo) and private (Personal) deployments from a single codebase using CI/CD environment variables.

## Technologies Used

- **Frontend:** React.js via Vite, Tailwind CSS

- **Backend & Database:** Supabase/PostgreSQL

  **DevOps:** Vercel, GitHub Webhooks

## User Stories

- **User Story 1:** As a lifter, I want to easily log my sets, reps, and weight so that I don't have to rely on my memory to know what I lifted last week.
- **User Story 2:** As a gym-goer who visits different locations, I want to tag the specific gym I am at so that I can account for the varying tensions of different cable machines.
- **User Story 3:** As a user in a gym with poor cell service, I want my workout data to cache locally so that I don't lose my logged sets if my connection drops mid-workout.
- **User Story 4:** As a fitness enthusiast, I want to be able to mark specific sets as Personal Records so that I can easily track my major milestones over time.

## License

MIT License
Copyright (c) 2026 JQ-Hoang

---

🌠 thanks for reading! :)
