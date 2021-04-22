import { embedResponse } from '../responses/index.js';
import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getBalance, getTickers } from '../pouch/index.js';

export async function balance(interaction) {
  const userId = getUserId(interaction);
  const ticker = getOption(interaction, 'ticker');

  const title = ticker?`${ticker} Balance`:'All Balances';
  const tickers = ticker?[ticker]:(await getTickers());

  const description = (await Promise.all(tickers.map(async t => {
    const value = await getBalance(userId, t);
    return `${value} ${t}`;
  }))).join('\n');

  return embedResponse({
    title,
    description
  });
};

