import { embedResponse } from '../responses/index.js';

export function balance(interaction) {
  return embedResponse({
    title: 'Balance',
    description: JSON.stringify(interaction, null, 2),
  });
};

