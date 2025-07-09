import React from 'react';
import NodeWidthSlider from './NodeWidthSlider';
import TextDirectionToggle from './TextDirectionToggle';
import LineTypeToggle from './LineTypeToggle';
import './ToolPanel.css';

const ToolPanel: React.FC = () => {
  return (
    <div className="tool-panel-container">
      <NodeWidthSlider />
      <TextDirectionToggle />
      <LineTypeToggle />
    </div>
  );
};

export default ToolPanel;
