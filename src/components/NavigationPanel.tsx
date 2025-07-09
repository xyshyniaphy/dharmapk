import React from 'react';
import './NavigationPanel.css';

interface NavigationPanelProps {
  path: string[];
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ path }) => {
  if (path.length === 0) {
    return null;
  }

  return (
    <div className="navigation-panel">
      <ul>
        {path.map((nodeName, index) => (
          <li key={index} style={{ paddingLeft: `${index * 20}px` }}>
            {nodeName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationPanel;
