This document is implemetation to read and parse mind map files.
There are three mind map file types.

### Unified Data Structure (The Goal)

First, remember that the goal of each parser is to convert the source file into this standardized `Node` object. Your rendering component will **only** ever interact with this structure.

```javascript
// The standardized Node object interface
const Node = {
  id: "string",
  text: "string",
  children: [/* Array of Node objects */],
  attributes: {} // For extra data like position, styling, etc.
};
```

-----

### \#\# Part 1: FreeMind (`.mm`) Parser Implementation

This is your baseline XML parser.

#### **Step 1.1: Create `src/utils/xmlParser.js`**

This file will contain the logic for parsing the FreeMind `.mm` format.

#### **Step 1.2: Add the Parser Code**

```javascript
// src/utils/xmlParser.js

/**
 * Recursively parses an XML node from a FreeMind file.
 * @param {Element} xmlNode - The XML element to parse.
 * @returns {object} A standardized Node object.
 */
function parseFreeMindNode(xmlNode) {
  const node = {
    id: xmlNode.getAttribute('ID'),
    text: xmlNode.getAttribute('TEXT') || '',
    children: [],
    attributes: {
      position: xmlNode.getAttribute('POSITION'),
      created: xmlNode.getAttribute('CREATED'),
      modified: xmlNode.getAttribute('MODIFIED'),
    },
  };

  // Recursively parse child nodes
  const childNodes = Array.from(xmlNode.children).filter(child => child.tagName === 'node');
  node.children = childNodes.map(parseFreeMindNode);

  return node;
}

/**
 * Parses a FreeMind .mm file string into a standardized object.
 * @param {string} xmlString - The raw XML content of the .mm file.
 * @returns {object} The root Node object of the mind map.
 */
export function parseFreeMindXml(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse XML. Please check the file format.');
  }

  const rootNode = xmlDoc.querySelector('map > node');
  if (!rootNode) {
    throw new Error('Invalid FreeMind file: Could not find the root node.');
  }

  return parseFreeMindNode(rootNode);
}
```

-----

### \#\# Part 2: MindMeister (`.mind`) Parser Implementation

This parser handles the JSON format from MindMeister.

#### **Step 2.1: Create `src/utils/mindMeisterParser.js`**

This file will be responsible for converting `.mind` JSON into our standard format.

#### **Step 2.2: Add the Parser Code**

MindMeister's JSON format is already hierarchical. We just need to map its property names to our own.

```javascript
// src/utils/mindMeisterParser.js

/**
 * Recursively parses a node from a MindMeister JSON object.
 * @param {object} mindMeisterNode - The node from the original MindMeister JSON.
 * @returns {object} A standardized Node object.
 */
function parseMindMeisterNode(mindMeisterNode) {
  const node = {
    id: mindMeisterNode.id,
    text: mindMeisterNode.title || '',
    children: [],
    attributes: {
      rank: mindMeisterNode.rank,
      // Add any other attributes you want to preserve
    },
  };

  // Recursively parse child nodes if they exist
  if (mindMeisterNode.children && mindMeisterNode.children.length > 0) {
    node.children = mindMeisterNode.children.map(parseMindMeisterNode);
  }

  return node;
}

/**
 * Parses a MindMeister .mind file (as a JS object) into a standardized object.
 * @param {object} mindJson - The JavaScript object parsed from the .mind file's JSON.
 * @returns {object} The root Node object of the mind map.
 */
export function parseMindMeisterJson(mindJson) {
  if (!mindJson || !mindJson.root || !mindJson.root.id) {
    throw new Error('Invalid MindMeister file: Root node is missing or invalid.');
  }
  
  return parseMindMeisterNode(mindJson.root);
}
```

-----

### \#\# Part 3: XMind (`.xmind`) Parser Implementation

This is the most complex parser because it requires unzipping the file first.

#### **Step 3.1: Install JSZip**

You'll need a library to handle the `.zip` archive in the browser. JSZip is perfect for this.

```bash
npm install jszip
```

#### **Step 3.2: Create `src/utils/xmindParser.js`**

This file will contain all the logic for fetching, unzipping, and parsing the `.xmind` file.

#### **Step 3.3: Add the Parser Code**

The process involves finding `content.xml` within the zip archive and then parsing it.

```javascript
// src/utils/xmindParser.js
import JSZip from 'jszip';

/**
 * Recursively parses a <topic> element from XMind's content.xml.
 * @param {Element} topicElement - The XML <topic> element.
 * @returns {object} A standardized Node object.
 */
function parseXMindTopic(topicElement) {
  const titleElement = topicElement.querySelector(':scope > title');
  const childrenContainer = topicElement.querySelector(':scope > topics');
  
  const node = {
    id: topicElement.getAttribute('id'),
    text: titleElement ? titleElement.textContent : '',
    children: [],
    attributes: {
      // You can extract more attributes if needed
    },
  };

  if (childrenContainer) {
    const childTopics = Array.from(childrenContainer.querySelectorAll(':scope > topic'));
    node.children = childTopics.map(parseXMindTopic);
  }

  return node;
}

/**
 * Parses an XMind .xmind file into a standardized object.
 * This function is async because it needs to unzip the file.
 * @param {Blob} blob - The .xmind file fetched as a Blob.
 * @returns {Promise<object>} A promise that resolves to the root Node object.
 */
export async function parseXmindFile(blob) {
  const zip = await JSZip.loadAsync(blob);
  
  const contentFile = zip.file('content.xml');
  if (!contentFile) {
    throw new Error('Invalid XMind file: "content.xml" not found in the archive.');
  }

  const xmlString = await contentFile.async('string');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // XMind files have a root <xmap-content> with a <sheet> and then the root <topic>
  const rootTopic = xmlDoc.querySelector('xmap-content > sheet > topic');
  if (!rootTopic) {
    throw new Error('Invalid XMind file: Could not find the root topic in "content.xml".');
  }

  return parseXMindTopic(rootTopic);
}
```

-----

### \#\# Part 4: Integrating All Parsers into `Viewer.js`

Now, you'll update the `Viewer` component to use the correct parser based on the file extension. This acts as the "parser factory".

#### **Step 4.1: Update `src/components/Viewer.js` with the Final Code**

This version imports all three parsers and includes the logic to decide which one to use.

```javascript
// src/components/Viewer.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { mindMapDataState } from '../state/mindMapAtom';

// Import all the parsers
import { parseFreeMindXml } from '../utils/xmlParser';
import { parseMindMeisterJson } from '../utils/mindMeisterParser';
import { parseXmindFile } from '../utils/xmindParser';

import MindMapCanvas from './MindMapCanvas';
import LoadingSpinner from './LoadingSpinner';

function Viewer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setMindMapData = useSetRecoilState(mindMapDataState);
  const location = useLocation();

  useEffect(() => {
    const mapUrl = new URLSearchParams(location.search).get('file');

    if (!mapUrl) {
      setError('No file URL provided. Use the format: /viewer?file=URL');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setMindMapData(null);

      try {
        const response = await fetch(mapUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }

        let parsedData;
        
        // The "Parser Factory" logic
        if (mapUrl.endsWith('.mm')) {
          const xmlString = await response.text();
          parsedData = parseFreeMindXml(xmlString);
        } else if (mapUrl.endsWith('.mind')) {
          const json = await response.json();
          parsedData = parseMindMeisterJson(json);
        } else if (mapUrl.endsWith('.xmind')) {
          const blob = await response.blob();
          parsedData = await parseXmindFile(blob);
        } else {
          throw new Error('Unsupported file format. Please use .mm, .mind, or .xmind.');
        }
        
        setMindMapData(parsedData);

      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, setMindMapData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}><strong>Error:</strong> {error}</div>;

  return <MindMapCanvas />;
}

export default Viewer;
```

-----

### **Part 5: Hover and Pin Interaction**

### **Part 1: Detailed Specification**

This document specifies the requirements for adding stateful highlighting via mouse clicks and enhancing the visual feedback on hover.

#### **1.0 Overview**

This enhancement introduces a "pinned" highlight mode, allowing users to lock the highlighted state of a node and its related paths. It also refines the visual feedback during hover events by adding emphasis to node borders, creating a more cohesive and interactive experience.

#### **2.0 Functional Requirements**

  * **2.1 Hover Logic**:
      * The hover behavior defined previously remains, highlighting ancestors and/or descendants.
      * **New**: Hovering over the **root node** (depth 0) will **trigger no action**.
      * **New**: When a highlight is active, the border of all highlighted nodes (except the root) will become bold.
      * If a node's highlight is currently "pinned" via a click, hover events on other nodes will be temporarily disabled.
  * **2.2 Left-Click Logic (Pinning)**:
      * A **left-click** on any node (except the root) activates a "pinned" mode.
      * In pinned mode, the highlight style for the selected node and its related paths will **persist** even after the mouse moves away.
      * Clicking a different node will un-pin the previous selection and pin the new one.
      * Clicking the currently pinned node will toggle the pin off, returning the mind map to its default state.
  * **2.3 Right-Click Logic (Global Reset)**:
      * A **right-click** anywhere on the SVG canvas will immediately disable any active "pinned" mode.
      * This action will clear all highlight and dim styles, restoring the entire visualization to its default appearance. The default browser context menu should be suppressed.

#### **3.0 Visual States (Updated)**

  * **3.1 Highlighted State**:
      * **Nodes**: The node's shape (e.g., `circle`) will have an **increased stroke width** (e.g., made bold).
      * **Links**: The link's `<path>` element will have an **increased stroke width**.
  * **3.2 Dimmed State**:
      * **Nodes & Links**: Opacity is reduced to decrease visual prominence.
  * **3.3 Default State**: All elements are rendered with their standard stroke widths and full opacity.

#### **4.0 State Management**

  * A React state variable (`useState`) will be introduced to track the currently "pinned" node. This state will hold the data object of the pinned node or `null` if no node is pinned.

-----

### **Part 2: Detailed Implementation Guide**

This guide provides the full implementation steps for the new features.

#### **Step 1: Add State for Pinned Node**

In your `MindMap.js` component, introduce a state variable to keep track of the pinned node.

```javascript
// At the top of your MindMap component
import React, { useState, useEffect, useRef, useCallback } from 'react';
// ... other imports

function MindMap({ data }) {
  const svgRef = useRef();
  const [pinnedNode, setPinnedNode] = useState(null); // New state variable

  // ... rest of the component
}
```

#### **Step 2: Update CSS for Node Borders**

Update your CSS file to include a style for the highlighted node's border.

```css
/* In your MindMap.css or equivalent */

/* ... (existing styles) ... */

.node.highlighted circle {
  stroke-width: 3px;
  stroke: #3182ce; /* Example highlight color */
}

.link.highlighted {
  stroke-width: 4px;
  stroke: #3182ce; /* Match the node's border color */
}
```

#### **Step 3: Refactor into Reusable Functions**

To avoid code duplication between hover and click events, we'll create dedicated functions for applying and clearing highlights.

```javascript
// Inside your MindMap component, before useEffect

// Clears all custom styling
const clearAllHighlights = useCallback(() => {
  const svg = select(svgRef.current);
  svg.selectAll('.node').classed('dimmed', false).classed('highlighted', false);
  svg.selectAll('.link').classed('dimmed', false).classed('highlighted', false);
}, []); // useCallback ensures this function is stable

// Applies highlighting based on a given node 'd'
const applyHighlight = useCallback((d) => {
  const svg = select(svgRef.current);
  const highlightedNodes = new Set();
  
  d.ancestors().forEach(node => highlightedNodes.add(node));
  if (d.children) {
    d.descendants().forEach(node => highlightedNodes.add(node));
  }
  
  svg.selectAll('.node')
    .classed('highlighted', node => highlightedNodes.has(node))
    .classed('dimmed', node => !highlightedNodes.has(node));
    
  svg.selectAll('.link')
    .classed('highlighted', link => highlightedNodes.has(link.source) && highlightedNodes.has(link.target))
    .classed('dimmed', link => !highlightedNodes.has(link.source) || !highlightedNodes.has(link.target));
}, []);
```

#### **Step 4: Update and Add Event Handlers**

Now, we'll implement the logic for all mouse events using our new state and helper functions.

```javascript
// Inside MindMap component, still before useEffect

const handleMouseOver = useCallback((event, d) => {
  // If a node is pinned, do not apply hover effects
  if (pinnedNode || d.depth === 0) return;
  applyHighlight(d);
}, [pinnedNode, applyHighlight]); // Re-create if pinnedNode changes

const handleMouseOut = useCallback(() => {
  // If a node is pinned, do not clear the styles
  if (pinnedNode) return;
  clearAllHighlights();
}, [pinnedNode, clearAllHighlights]);

const handleNodeClick = useCallback((event, d) => {
  if (d.depth === 0) return; // Ignore clicks on root

  // If clicking the already pinned node, unpin it.
  if (pinnedNode === d) {
    setPinnedNode(null);
    clearAllHighlights();
  } else {
    // Otherwise, pin the new node.
    setPinnedNode(d);
    applyHighlight(d);
  }
}, [pinnedNode, applyHighlight, clearAllHighlights]);

const handleContextMenu = useCallback((event) => {
  event.preventDefault(); // Prevent browser context menu
  setPinnedNode(null);
  clearAllHighlights();
}, [clearAllHighlights]);
```

#### **Step 5: Integrate into `useEffect`**

Finally, attach all the new and updated event handlers within your main `useEffect` hook.

```javascript
// The main useEffect hook in MindMap.js

useEffect(() => {
  // ... (your existing setup code for svg, root, layout) ...

  const svg = select(svgRef.current);
  svg.on('contextmenu', handleContextMenu); // Attach right-click to the main SVG

  // ... (Your code to draw links) ...

  const nodeGroups = svg.selectAll('.node')
    .data(root.descendants())
    .join('g')
      // ... (attributes)
  
  // ... (Your code to append circles and text) ...

  // Attach all event listeners to the node groups
  nodeGroups
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleNodeClick)
    .style('cursor', d => d.depth === 0 ? 'default' : 'pointer'); // Visual cue

}, [data, handleContextMenu, handleMouseOver, handleMouseOut, handleNodeClick]); // Add handlers to dependency array
