import { atom } from 'recoil';
import type { Node } from '../types';

export const mindMapDataState = atom<Node | null>({
  key: 'mindMapDataState',
  default: null,
});
