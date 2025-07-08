# System Patterns: Interactive Mind Map UI

## System Architecture
The application is a Single Page Application (SPA) built with React. It follows a component-based architecture. The core of the application is a data-driven visualization engine powered by D3.js.

## Key Technical Decisions
- **State Management**: Recoil is used for its atomic state management capabilities, allowing for efficient and decoupled state updates.
- **Rendering**: D3.js is used for rendering the mind map as an SVG, providing maximum flexibility for custom layouts and interactions.
- **Styling**: A combination of Styled-components and Tailwind CSS is used for styling, allowing for both component-level and utility-first CSS.
- **Data Flow**: The application follows a unidirectional data flow. Data is fetched, parsed, and stored in a global Recoil atom. Components then subscribe to this atom and re-render when the data changes.

## Design Patterns
- **Component-Based Architecture**: The UI is broken down into reusable React components.
- **Hooks**: Custom hooks (like `useMindMapData` in the initial plan) are used to encapsulate and reuse logic, such as data fetching and parsing.
- **Data-Driven Visualization**: The D3.js implementation is data-driven, meaning the visualization is a direct representation of the application's state.
- **Global State Management**: A central Recoil store is used to manage the application's global state, such as the mind map data.

## Component Relationships
- **`App.js`**: The root component, responsible for setting up routing and the Recoil root.
- **`Viewer.js`**: A container component that handles the logic for fetching and parsing data, and manages loading and error states.
- **`MindMapCanvas.js`**: A presentational component that takes the mind map data from the Recoil store and renders it using D3.js.
- **`xmlParser.js`**: A utility module that is decoupled from the UI and is responsible for parsing the mind map file format.
