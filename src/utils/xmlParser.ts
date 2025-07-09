import type { Node } from '../types';

/**
 * Recursively parses an XML node from a FreeMind file.
 * @param {Element} xmlNode - The XML element to parse.
 * @returns {object} A standardized Node object.
 */
function parseFreeMindNode(xmlNode: Element): Node {
  const node: Node = {
    id: xmlNode.getAttribute('ID') || '',
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
export function parseFreeMindXml(xmlString: string): Node {
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
