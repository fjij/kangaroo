import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getOrCreateWallet } from '../user/index.js';
import { getTokenByTicker } from '../tokens/index.js';
import { getUserById } from '../discord/index.js';
import config from '../config/index.js';
import {
  missingOptionsResponse,
  sendHelpResponse,
  previewTransactionResponse,
  transactionResponse,
  tokenNotFoundResponse,
  invalidAmountResponse,
  transactionFailedResponse,
  notUnlockedResponse,
} from '../responses/index.js';
import { Amount } from '../eth2/amount.js';

export async function send(interaction) {
  const userId = getUserId(interaction);
  const amount = getOption(interaction, 'amount');
  const ticker = getOption(interaction, 'ticker')?.toUpperCase();
  const recipientId = getOption(interaction, 'user');
  const confirm = getOption(interaction, 'confirm')?.toUpperCase();

  const sendOrTip = interaction.data.name;

  if (!amount && !ticker && !recipientId && !confirm) {
    return sendHelpResponse(sendOrTip);
  }

  if (amount && ticker && recipientId) {
    const token = await getTokenByTicker(ticker);
    if (!token) {
      return tokenNotFoundResponse();
    }
    let primaryAmount;
    try {
      primaryAmount = Amount.fromStringValue(token, amount);
    } catch (e) {
      return invalidAmountResponse();
    }
    const userWallet = await getOrCreateWallet(userId);
    const recipientWallet = await getOrCreateWallet(recipientId);
    const feeAmount = await userWallet.getTransferFee(token, recipientWallet.getAddress());
    if (confirm === 'CONFIRM') {
      if (!await userWallet.getUnlocked()) {
        return notUnlockedResponse();
      }
      try {
        await userWallet.transfer(
          token,
          recipientWallet.getAddress(),
          primaryAmount,
          feeAmount
        );
      } catch {
        return transactionFailedResponse();
      }
      return await transactionResponse(
        'Transfer tokens',
        primaryAmount.getClosestPackable(),
        feeAmount.getClosestPackable(),
      );
    } else {
      let userText = '@<insert user>';
      if (config.discordAuth !== '') {
        const recipientUser = await getUserById(recipientId);
        userText = `@${recipientUser.username}#${recipientUser.discriminator}`;
      }
      return await previewTransactionResponse(
        'Transfer tokens',
        primaryAmount.getClosestPackable(),
        feeAmount.getClosestPackable(),
        `/${sendOrTip} ${amount} ${ticker} ${userText} confirm`
      );
    }
  } else {
    const missingOptions = [];
    if (!amount) {
      missingOptions.push('amount');
    }
    if (!ticker) {
      missingOptions.push('ticker');
    }
    if (!recipientId) {
      missingOptions.push('user');
    }
    return missingOptionsResponse(missingOptions);
  }
}
