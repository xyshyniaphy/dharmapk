import JSZip from 'jszip';
import type { Node } from '../types';

interface XmindJsonNode {
  id: string;
  title: string;
  children?: {
    attached?: XmindJsonNode[];
  };
}

function parseXmindJsonNode(xmindNode: XmindJsonNode): Node {
  const node: Node = {
    id: xmindNode.id,
    text: xmindNode.title || '',
    children: [],
    attributes: {},
  };

  if (xmindNode.children && xmindNode.children.attached) {
    node.children = xmindNode.children.attached.map(parseXmindJsonNode);
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

  const metadataFile = zip.file('metadata.json');
  if (!metadataFile) {
    // Fallback to old XML format
    return parseXmindXml(zip);
  }

  const metadataString = await metadataFile.async('string');
  const metadata = JSON.parse(metadataString);

  if (metadata.dataStructureVersion === '2') {
    const contentFile = zip.file('content.json');
    if (!contentFile) {
      throw new Error('Invalid XMind file: "content.json" not found for data structure version 2.');
    }
    const contentString = await contentFile.async('string');
    const content = JSON.parse(contentString);
    
    // Assuming the first sheet is the one we want
    const sheet = content[0];
    if (!sheet || !sheet.rootTopic) {
      throw new Error('Invalid XMind content.json: No root topic found in the first sheet.');
    }
    
    return parseXmindJsonNode(sheet.rootTopic);

  } else {
    // Fallback or error for other versions
    return parseXmindXml(zip);
  }
}

async function parseXmindXml(zip: JSZip): Promise<Node> {
    const contentFile = zip.file('content.xml');
    if (!contentFile) {
      throw new Error('Invalid XMind file: "content.xml" not found in the archive.');
    }
  
    const xmlString = await contentFile.async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
    const rootTopic = xmlDoc.querySelector('xmap-content > sheet > topic');
    if (!rootTopic) {
      throw new Error('Invalid XMind file: Could not find the root topic in "content.xml".');
    }
  
    return parseXMindTopicXml(rootTopic);
}

function parseXMindTopicXml(topicElement: Element): Node {
    const titleElement = topicElement.querySelector(':scope > title');
    const childrenContainer = topicElement.querySelector(':scope > topics');
    
    const node: Node = {
      id: topicElement.getAttribute('id') || '',
      text: titleElement ? titleElement.textContent || '' : '',
      children: [],
      attributes: {},
    };
  
    if (childrenContainer) {
      const childTopics = Array.from(childrenContainer.querySelectorAll(':scope > topic'));
      node.children = childTopics.map(parseXMindTopicXml);
    }
  
    return node;
}
