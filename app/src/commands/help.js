import { embedResponse } from '../responses/index.js';

export function help(_interaction) {
  return embedResponse({
    title: 'Kangaroo Help',
    description: 'Hi there :)'
  });
}
