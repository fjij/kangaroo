import { embedResponse } from '../responses/index.js';
import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getBalance } from '../pouch/index.js';
import { getAllTokens, getTokenByTicker } from '../tokens/index.js';

export async function balance(interaction) {
  const userId = getUserId(interaction);
  const ticker = getOption(interaction, 'ticker')?.toUpperCase();

  if (ticker) {
    const title = `${ticker} Balance`;
    const token = await getTokenByTicker(ticker);

    if (!token) {
      return embedResponse({
        title: 'Error',
        color: 13370886,
        description: 'That token doesn\'t exist :('
      });
    }

    const description = `${await getBalance(userId, token)} ${ticker}`;

    return embedResponse({
      title,
      color: 13370886,
      description
    });
  } else {
    const title = 'All Balances';
    const tokens = await getAllTokens();

    const tokensWithBalances = (await Promise.all(tokens.map(async token => {
      return { ticker: token.ticker, balance: await getBalance(userId, token) };
    }))).filter(({ balance }) => balance > 0);

    const description = (tokensWithBalances.length > 0)?
      tokensWithBalances.map(({ticker, balance}) => `${balance} ${ticker}`).join('\n'):
      'You don\'t have any tokens :(';

    return embedResponse({
      title,
      color: 13370886,
      description
    });
  }
};

