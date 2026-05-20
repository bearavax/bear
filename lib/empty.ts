import { GROUPS } from '@/data/tournament';
import type { Prediction } from './types';

/** A blank prediction with every slot present. Safe to import on the client. */
export function emptyPrediction(): Prediction {
  const groups: Prediction['groups'] = {};
  for (const g of GROUPS) {
    groups[g.id] = { first: '', second: '' };
  }
  return {
    groups,
    semifinalists: ['', '', '', ''],
    finalists: ['', ''],
    champion: '',
  };
}
