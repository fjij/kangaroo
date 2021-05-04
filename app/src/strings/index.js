const strings = {
  unlockGeneralInfo: 'In order to start making transactions with your wallet,'
    + ' you must unlock it first. You only need to unlock your wallet once.',

  unlockInstructions: 'You can pay the unlock fee with any token.\nFor example,'
    + ' to pay with Dai, do `/unlock DAI` to preview the transaction.',

  alreadyUnlocked: 'Your wallet is already unlocked.',
};

export function getString(key) {
  return strings[key];
}
