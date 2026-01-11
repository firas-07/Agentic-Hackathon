# RAG Chat AI (Frontend)

A modern AI Chat application built with React, Vite, and Tailwind CSS.

## Features

- **AI Chat Interface**: Interactive chat UI with markdown support.
- **Responsive Design**: Built with Tailwind CSS and Framer Motion for smooth animations.
- **State Management**: Uses TanStack Query for efficient data fetching.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Markdown Rendering**: react-markdown

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. create a `.env` file in the root of the frontend directory if needed (see `.env.example` if available, or ask the backend team for required variables).

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```
