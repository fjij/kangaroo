import { embedResponse } from '../responses/index.js';
import { getAllTokens } from '../tokens/index.js';

export async function listTokens(_interaction) {
   const tokens = await getAllTokens();
   const description = tokens.map(token => `${ token.ticker } | ${ token.name}`).join('\n');

   return embedResponse({
    title: 'All Supported Tokens📖',
    "color": 15422875,
    description
   })
}