import type { Node } from '../types';

interface MindMeisterNode {
  id: string;
  title: string;
  children: MindMeisterNode[];
  rank: number;
}

/**
 * Recursively parses a node from a MindMeister JSON object.
 * @param {object} mindMeisterNode - The node from the original MindMeister JSON.
 * @returns {object} A standardized Node object.
 */
function parseMindMeisterNode(mindMeisterNode: MindMeisterNode): Node {
  const node: Node = {
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
export function parseMindMeisterJson(mindJson: { root: MindMeisterNode }): Node {
  if (!mindJson || !mindJson.root || !mindJson.root.id) {
    throw new Error('Invalid MindMeister file: Root node is missing or invalid.');
  }
  
  return parseMindMeisterNode(mindJson.root);
}
