# Project Brief: Interactive Mind Map UI

## High-Level Overview
This project is an advanced, web-based mind mapping tool built with React and D3.js. It is designed to provide a sophisticated user interface for creating, viewing, and interacting with mind maps, with a focus on performance, customizability, and a fluid user experience.

## Problem Solved
This project addresses the need for a highly interactive and visually clear mind mapping tool. Traditional mind map software can be rigid, and this application provides a more fluid and intuitive user experience. Key problems solved include:
- **Visual Clarity**: The parent-path highlighting and vertical leaf node alignment features provide a clear view of the mind map's structure, even in complex diagrams.
- **Data Portability**: By decoupling the UI from the data source, the application can render mind maps from various sources, including text files, JSON data, and potentially other services like PDF converters.
- **Ease of Use**: The declarative text-based map generation allows users to quickly create and modify mind maps without complex UI interactions.

## How the Product Works
The application is a Single Page Application (SPA) that functions as a mind map viewer.
1.  A user provides a URL to a mind map file (e.g., a `.mm` file).
2.  The application fetches, parses, and renders the mind map data in the browser.
3.  The user can interact with the rendered mind map by panning, zooming, and hovering over nodes to see relationships.
4.  The core rendering is handled by D3.js, which provides a dynamic and interactive SVG-based visualization.
5.  State, such as the loaded mind map data, is managed globally using Recoil.

## Core Requirements and Goals
- **Visualize Hierarchical Data**: The primary goal is to render mind maps from structured data (initially text-based or JSON).
- **Unique Layouts**: Implement specialized layouts, including parent-path highlighting and vertical alignment of leaf nodes.
- **Interactive UI**: Allow users to pan, zoom, and interact with the mind map canvas.
- **Decoupled Data Source**: The UI should be independent of the data source, capable of ingesting data from various backends or file formats.
- **Declarative Map Generation**: Enable users to define mind map structures using a simple text-based syntax.
