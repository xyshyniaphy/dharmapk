import React from 'react';
import './NavigationPanel.css';

interface NavigationPanelProps {
  path: string[];
  siblings: string[];
  parentNodeName: string | null;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ path, siblings, parentNodeName }) => {
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
        {siblings.map((siblingName, index) => (
          <li
            key={index}
            className={siblingName === parentNodeName ? 'active-parent' : ''}
            style={{ paddingLeft: `${(path.length) * 20}px` }}
          >
            {siblingName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationPanel;
