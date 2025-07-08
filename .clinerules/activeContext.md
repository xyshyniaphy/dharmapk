# Active Context: Interactive Mind Map UI

## Current Work Focus
- Initial setup of the project structure and core components.
- Defining the application's architecture and data flow.
- Establishing the foundation for the D3.js rendering engine.

## Recent Changes
- The state management library has been decided as Recoil.
- The core folder structure has been defined.
- The initial data parsing logic for FreeMind (`.mm`) files has been outlined.

## Active Decisions and Considerations
- **CORS Policy**: How to handle Cross-Origin Resource Sharing when fetching mind map files from different domains. A proxy server may be required.
- **Error Handling**: Defining a robust error handling strategy for file fetching and parsing.
- **Extensibility**: Planning for future support of other file formats like XMind and MindMeister.

## Important Patterns and Learnings
- The use of a dedicated hook (`useMindMapData` or similar logic within a component) to encapsulate data fetching and parsing logic is a key pattern.
- The separation of concerns between data fetching/management and rendering (D3.js) is crucial for maintainability.
