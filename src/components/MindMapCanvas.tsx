import React from 'react';
import { useAtomValue } from 'jotai';
import { mindMapDataAtom } from '../state/mindMapStore';

function MindMapCanvas(): React.ReactElement {
  const mindMapData = useAtomValue(mindMapDataAtom);

  if (!mindMapData) {
    return <div>No mind map data loaded.</div>;
  }

  // Placeholder for D3.js rendering
  return (
    <div>
      <h1>Mind Map Canvas</h1>
      <pre>{JSON.stringify(mindMapData, null, 2)}</pre>
    </div>
  );
}

export default MindMapCanvas;
