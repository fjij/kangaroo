import { embedResponse } from '../responses/index.js';
import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getBalance, getTickers } from '../pouch/index.js';

export async function balance(interaction) {
  const userId = getUserId(interaction);
  const ticker = getOption(interaction, 'ticker');

  const title = ticker?`${ticker} Balance`:'All Balances';
  const tickers = ticker?[ticker]:(await getTickers());

  const balances = (await Promise.all(tickers.map(async ticker => {
    const value = await getBalance(userId, ticker);
    return { ticker, value };
  }))).filter(({ value }) => value > 0);

  const description = (balances.length > 0)?
    balances.map(({ticker, value}) => `${value} ${ticker}`).join('\n'):
    (ticker?`0 ${ticker}`:'You don\'t have any tokens :(');

  return embedResponse({
    title,
    description
  });
};

