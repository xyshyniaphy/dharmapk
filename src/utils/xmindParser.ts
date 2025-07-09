import JSZip from 'jszip';
import type { Node } from '../types';

/**
 * Recursively parses a <topic> element from XMind's content.xml.
 * @param {Element} topicElement - The XML <topic> element.
 * @returns {object} A standardized Node object.
 */
function parseXMindTopic(topicElement: Element): Node {
  const titleElement = topicElement.querySelector(':scope > title');
  const childrenContainer = topicElement.querySelector(':scope > topics');
  
  const node: Node = {
    id: topicElement.getAttribute('id') || '',
    text: titleElement ? titleElement.textContent || '' : '',
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
export async function parseXmindFile(blob: Blob): Promise<Node> {
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
