import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Sliders } from 'react-feather';
import { settingsAtom } from '../state/settingsStore';
import './NodeWidthSlider.css';

const NodeWidthSlider: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, nodeColumnWidth: Number(event.target.value) });
  };

  return (
    <div className="node-width-slider-container">
      <button onClick={() => setIsOpen(!isOpen)} className="tool-panel-button">
        <Sliders size={20} />
      </button>
      {isOpen && (
        <div className="slider-popup">
          <span className="slider-label">列间距</span>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={settings.nodeColumnWidth}
            onChange={handleChange}
            className="slider"
          />
          <span className="slider-value">{settings.nodeColumnWidth}px</span>
        </div>
      )}
    </div>
  );
};

export default NodeWidthSlider;
