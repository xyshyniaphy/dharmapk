import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { mindMapDataAtom } from '../state/mindMapStore';

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
  const [urlInput, setUrlInput] = useState('');
  const setMindMapData = useSetAtom(mindMapDataAtom);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      navigate(`?file=${encodeURIComponent(urlInput)}`);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mapUrl = searchParams.get('file');

    if (!mapUrl) {
      setMindMapData(null);
      setError(null);
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

  const searchParams = new URLSearchParams(location.search);
  const mapUrl = searchParams.get('file');

  if (!mapUrl) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form onSubmit={handleUrlSubmit}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter Mind Map URL"
            style={{ padding: '10px', width: '300px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>Open</button>
        </form>
      </div>
    );
  }

  return <MindMapCanvas />;
}

export default Viewer;
