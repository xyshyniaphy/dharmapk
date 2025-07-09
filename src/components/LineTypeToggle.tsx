import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { GitCommit } from 'react-feather';
import { settingsAtom } from '../state/settingsStore';
import type { LineType } from '../state/settingsStore';
import './LineTypeToggle.css';

const LineTypeToggle: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, lineType: event.target.value as LineType });
  };

  return (
    <div className="line-type-toggle-container">
      <button onClick={() => setIsOpen(!isOpen)} className="tool-panel-button">
        <GitCommit size={20} />
      </button>
      {isOpen && (
        <div className="toggle-popup">
          <div className="line-type-title">连线类型</div>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="curved"
                checked={settings.lineType === 'curved'}
                onChange={handleChange}
              />
              曲线
            </label>
            <label>
              <input
                type="radio"
                value="straight"
                checked={settings.lineType === 'straight'}
                onChange={handleChange}
              />
              直线
            </label>
            <label>
              <input
                type="radio"
                value="right-angled"
                checked={settings.lineType === 'right-angled'}
                onChange={handleChange}
              />
              直角折线
            </label>
            <label>
              <input
                type="radio"
                value="rounded-angled"
                checked={settings.lineType === 'rounded-angled'}
                onChange={handleChange}
              />
              圆角折线
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineTypeToggle;
