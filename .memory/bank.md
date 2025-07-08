# Mind Map Viewer Technical Summary

This document summarizes the core technical implementation details for the interactive mind map viewer application.

## System Architecture

- **Framework**: React (v18+) with TypeScript
- **Routing**: React Router
- **State Management**: Zustand
- **Rendering Engine**: D3.js (v7) for dynamic SVG rendering
- **Styling**: Styled-components and Tailwind CSS

## Application Flow

1.  **URL Parsing**: The application parses the URL to find the mind map file location.
2.  **Data Fetching**: It retrieves the mind map file using the `fetch` API.
3.  **Data Parsing**: The fetched file (e.g., `.mm` format) is parsed into a hierarchical JavaScript object.
4.  **State Update**: The parsed data is stored in a global Zustand store.
5.  **Rendering**: A React component (`<MindMapCanvas>`) subscribes to the store and uses D3.js to render the data.
6.  **User Interaction**: D3.js handles panning, zooming, and other interactions.

## File Format

- The primary supported format is **FreeMind (`.mm`)**, which is XML-based.
- The application is designed to be extensible to support other formats like **XMind (`.xmind`)** and **MindMeister (`.mind`)**.

## Core Components

- **`App.js`**: Sets up routing and orchestrates the main components.
- **`MindMapCanvas.js`**: The main component for rendering the mind map with D3.js.
- **`useMindMapStore.js`**: The Zustand store for managing mind map data.
- **`xmlParser.js`**: A utility for parsing `.mm` files.
- **`useMindMapData.js`**: A custom hook for fetching and parsing data.
