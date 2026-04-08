# Overview

This project is an interactive calendar component built using Next.js (React) and Tailwind CSS. The goal was to recreate a physical wall calendar UI while adding useful interactive features like date range selection and note-taking.

I focused on building a clean, responsive, and user-friendly interface while also following good frontend engineering practices such as component separation and modular code structure.

## Features

### 📅 Wall Calendar UI

- Inspired by a physical hanging calendar design
- Includes a hero image and structured layout

### 🔵 Date Range Selection

- Users can select a start and end date
- Selected range is visually highlighted with smooth styling

### 📝 Notes System

- Monthly notes
- Notes for selected date ranges
- Data is stored using localStorage

### 📱 Responsive Design

- Works across desktop and mobile devices
- Layout adapts from side-by-side to stacked

### 🎨 Dynamic Themes

- Each month has a different visual theme and image

### 🎯 Extra Enhancements

- Holiday markers
- "Today" indicator
- Smooth animations and hover effects

## Tech Stack

- Next.js (React)
- TypeScript
- Tailwind CSS
- LocalStorage (for persistence)

## Project Structure

I followed a feature-based structure to keep the code modular and scalable:

```txt
features/calendar/
components/ -> UI components
hooks/ -> state and logic (custom hooks)
utils/ -> reusable functions
types/ -> TypeScript types
```

This separation helps in maintaining clean code and makes the project easier to extend.

## How to Run Locally

Clone the repository:

```bash
git clone
```

Navigate to the project folder:

```bash
cd interactive-calendar-component
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:3000
```

## Key Decisions

- Used Tailwind CSS for faster and consistent UI development
- Implemented custom hooks to separate business logic from UI
- Stored notes in localStorage to avoid backend complexity
- Designed the UI to closely match the provided reference while improving usability

## Final Thoughts

This project helped me improve both UI design and frontend architecture skills. I focused not just on building features, but also on writing clean and maintainable code.
