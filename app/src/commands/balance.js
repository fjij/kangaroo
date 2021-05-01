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

    const balance = await getBalance(userId, token);
    const description = `${balance.toString()} - ${await balance.getPrice()}`;

    return embedResponse({
      title,
      color: 15422875,
      description
    });
  } else {
    const title = 'All Balances';
    const tokens = await getAllTokens();

    const amounts = (await Promise.all(
      tokens.map(async token => await getBalance(userId, token))
    )).filter(amount => amount.getValue().gt(0));

    const amountStrings = (await Promise.all(
      amounts.map(async a => `${a.toString()} - ${await a.getPrice()}`)
    ));

    const description = (amountStrings.length > 0)?amountStrings.join('\n'):
      'You don\'t have any tokens :(';

    return embedResponse({
      title,
      color: 15422875,
      description
    });
  }
};

