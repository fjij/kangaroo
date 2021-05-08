import { embedResponse, tokenNotFoundResponse } from '../responses/index.js';
import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getOrCreateWallet } from '../user/index.js';
import { getAllTokens, getTokenByTicker } from '../tokens/index.js';

export async function balance(interaction) {
  const userId = getUserId(interaction);
  const ticker = getOption(interaction, 'ticker')?.toUpperCase();
  const wallet = await getOrCreateWallet(userId);

  if (ticker) {
    const title = `${ticker} Balance`;
    const token = await getTokenByTicker(ticker);

    if (!token) {
      return tokenNotFoundResponse();
    }

    const balance = await wallet.getBalance(token);
    const fields = [
      {
        name: `**${balance.toString()}**`,
        value: `*${await balance.getPrice()}*`
      }
    ]

    return embedResponse({
      title,
      color: 15422875,
      fields
    });
  } else {
    const title = 'All Balances';
    const tokens = await getAllTokens();

    const amounts = (await Promise.all(
      tokens.map(async token => await wallet.getBalance(token))
    )).filter(amount => amount.getValue().gt(0));

    const fields = (await Promise.all(
      amounts.map(async a => ({
        name: `**${a.toString()}**`,
        value: `*${await a.getPrice()}*`
      }))
    ));

    const additionalProperties = {};
    if (fields.length > 0) {
      additionalProperties.fields = fields;
    } else {
      additionalProperties.description = 'You don\'t have any tokens :(';
    }

    return embedResponse({
      title,
      color: 15422875,
      ...additionalProperties
    });
  }
};

