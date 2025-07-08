

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
```