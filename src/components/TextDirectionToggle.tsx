import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Type } from 'react-feather';
import { settingsAtom } from '../state/settingsStore';
import './TextDirectionToggle.css';

const TextDirectionToggle: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, verticalText: event.target.checked });
  };

  return (
    <div className="text-direction-toggle-container">
      <button onClick={() => setIsOpen(!isOpen)} className="tool-panel-button">
        <Type size={20} />
      </button>
      {isOpen && (
        <div className="toggle-popup">
          <label>
            <input
              type="checkbox"
              checked={settings.verticalText}
              onChange={handleChange}
            />
            竖排显示
          </label>
        </div>
      )}
    </div>
  );
};

export default TextDirectionToggle;
