import { atomWithStorage } from 'jotai/utils';

export type LineType = 'curved' | 'straight' | 'right-angled' | 'rounded-angled';

interface Settings {
  nodeColumnWidth: number;
  verticalText: boolean;
  lineType: LineType;
}

const initialSettings: Settings = {
  nodeColumnWidth: 200,
  verticalText: false,
  lineType: 'curved',
};

export const settingsAtom = atomWithStorage<Settings>('mindmap-settings', initialSettings);
