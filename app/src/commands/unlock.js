import {
  previewTransactionResponse,
  transactionFailedResponse,
  embedResponse,
} from '../responses/index.js';
import { getOption } from './index.js';
import { getUserId } from '../interactions/index.js';
import { getOrCreateWallet } from '../user/index.js';
import { getTokenByTicker } from '../tokens/index.js';
import { getString } from '../strings/index.js';

export async function unlock(interaction) {
  const userId = getUserId(interaction);
  const ticker = getOption(interaction, 'ticker')?.toUpperCase();
  const wallet = await getOrCreateWallet(userId);
  const isUnlocked = await wallet.getUnlocked();

  if (isUnlocked) {
    return embedResponse({
      title: 'Wallet already unlocked',
      color: 15422875,
      description: [
        getString('unlockGeneralInfo'),
        getString('alreadyUnlocked'),
      ].join('\n\n')
    });
  }

  if (!ticker) {
    return embedResponse({
      title: 'Unlocking Your Wallet',
      color: 15422875,
      description: [
        getString('unlockGeneralInfo'),
        getString('unlockInstructions'),
      ].join('\n\n')
    });
  }

  const token = await getTokenByTicker(ticker);

  if (!token) {
    return tokenNotFoundResponse();
  }

  const confirm = getOption(interaction, 'confirm')?.toUpperCase();

  if (confirm === 'YES') {
    try {
      await wallet.unlock(token);
      return embedResponse({
        title: `Unlock with ${token.ticker}`,
        color: 15422875,
        description: 'Wallet unlocked.',
      });
    } catch (e) {
      return transactionFailedResponse();
    }
  } else {
    return await previewTransactionResponse(
      `Unlock your wallet using ${token.ticker}`,
      null, 
      (await wallet.getUnlockFee(token)).getClosestPackable()
    );
  }
}
