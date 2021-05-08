import { embedResponse } from '../responses/index.js';
import { getAllTokens } from '../tokens/index.js';

export async function listTokens(_interaction) {
  const tokens = await getAllTokens();
  const fields = tokens.map(token => ({
    name: `**${ token.ticker }**`,
    value: `*${ token.name }*`
  }));

  return embedResponse({
    title: 'All Supported Tokens',
    "color": 15422875,
    fields
  })
}
