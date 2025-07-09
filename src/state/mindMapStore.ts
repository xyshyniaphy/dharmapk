import { atom } from 'jotai';
import type { Node } from '../types';

export const mindMapDataAtom = atom<Node | null>(null);
