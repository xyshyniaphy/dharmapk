
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
