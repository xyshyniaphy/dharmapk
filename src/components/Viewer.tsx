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
import type { Node } from '../types';

function Viewer(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setMindMapData = useSetRecoilState(mindMapDataState);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mapUrl = searchParams.get('file');

    if (!mapUrl) {
      setError('No file URL provided. Use the format: ?file=URL');
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

        let parsedData: Node;
        
        // The "Parser Factory" logic
        if (mapUrl.endsWith('.xmind')) {
          const blob = await response.blob();
          parsedData = await parseXmindFile(blob);
        } else if (mapUrl.endsWith('.mm')) {
          const xmlString = await response.text();
          parsedData = parseFreeMindXml(xmlString);
        } else if (mapUrl.endsWith('.mind')) {
          const json = await response.json();
          parsedData = parseMindMeisterJson(json);
        } else {
          throw new Error('Unsupported file format. Please use .mm, .mind, or .xmind.');
        }
        
        setMindMapData(parsedData);

      } catch (e: any) {
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
