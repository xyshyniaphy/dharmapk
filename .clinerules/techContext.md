# Tech Context: Interactive Mind Map UI

## Technologies and Frameworks
- **React**: v18+ with TypeScript
- **Recoil**: For state management
- **React Router**: For client-side routing
- **D3.js**: v7 for data visualization and SVG rendering
- **Styled-components**: For component-level styling
- **Tailwind CSS**: For utility-first styling
- **Node.js**: v18 or later for the development environment
- **npm/yarn**: For package management

## MCP usage
- You will use mcp tool "Context7" to get latest document, when implement functions related to "React", "D3.js", "Tailwind CSS", "Recoil".   You should use best practices to implement the function. You should check the correnct version of libraries first.

## Development Setup
- The project is set up as a standard Create React App project.
- Dependencies are managed via `package.json`.
- The development server is run with `npm start` or `yarn start`.

## Technical Constraints
- **CORS**: The application is subject to Cross-Origin Resource Sharing policies, Which is a used for loading mindmap file.
- **Browser Compatibility**: The application relies on modern browser features, including the `fetch` API and `DOMParser`.
- **Performance**: Large mind maps with thousands of nodes may present performance challenges that require optimization techniques like virtualization.
- Platform Compatibility: This SPA runs on modern browsers such as Chrome, Safari. On Windows, Mac, iOS, Andriod.
- Simplicity : This SPA dose not call any server side API via AJAX, only load the single mind map file via HTTP.

## Dependencies and Tool Configurations
- **`recoil`**: For state management.
- **`react-router-dom`**: For routing.
- **`d3`**: For visualization.
- **`styled-components`**: For styling.
- **`eslint`**: For code linting.
- **`vite`**: As the build tool (inferred from the project files).
