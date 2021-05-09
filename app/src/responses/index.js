import config from '../config/index.js';

export function messageResponse(content) {
  return {
    type: 4,
    data: {
      content
    }
  }
}

export function deferredResponse() {
  return {
    type: 5,
  }
}

export function embedResponse(embed) {
  return {
    type: 4,
    data: {
      embeds: [
        embed
      ]
    }
  }
}

export function errorResponse(message) {
  return embedResponse({
    title: 'Error',
    color: 13370886,
    description: message,
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sendHelpResponse(sendOrTip) {
  return embedResponse({
    title: `${capitalizeFirstLetter(sendOrTip)}ing Tokens`,
    color: 15422875,
    description: [
      `How to ${sendOrTip} tokens`,
      `Example: \`/${sendOrTip} 15 DAI @Kanga\` to preview transaction`,
      `Example: \`/${sendOrTip} 15 DAI @Kanga confirm\` to send transaction`,
    ].join('\n\n'),
  });
}

export function withdrawHelpResponse() {
  return embedResponse({
    title: `Withdrawing Tokens`,
    color: 15422875,
    description: [
      `How to withdraw tokens`,
      'Example: `/withdraw 15 DAI 0x1AF42fEbCd301322f70C6362594f6b686B2815A8` to preview transaction',
      'Example: `/withdraw 15 DAI 0x1AF42fEbCd301322f70C6362594f6b686B2815A8 confirm` to send transaction',
      `In order to access your funds, use the ${config.zkLink} network`,
    ].join('\n\n'),
  });
}

export async function previewTransactionResponse(
  description,
  primaryAmount,
  feeAmount
) {
  const fields = [];
  if (primaryAmount) {
    fields.push({
      name: 'Amount',
      value: `**${primaryAmount.toString()}** - *${await primaryAmount.getPrice()}*`
    });
  }
  if (feeAmount) {
    fields.push({
      name: 'Fee',
      value: `**${feeAmount.toString()}** - *${await feeAmount.getPrice()}*`
    });
  }
  if (primaryAmount && feeAmount) {
    const total = primaryAmount.add(feeAmount);
    fields.push({
      name: 'Total',
      value: `**${total.toString()}** - *${await total.getPrice()}*`
    });
  }

  return embedResponse({
    title: 'Preview Transaction',
    color: 15422875,
    fields,
    description: [
      description,
      'Use this command with `confirm: yes` to confirm this transaction.'
    ].join('\n\n')
  });
}

export async function transactionResponse(
  description,
  primaryAmount,
  feeAmount
) {
  const fields = [];
  if (primaryAmount) {
    fields.push({
      name: 'Amount',
      value: `**${primaryAmount.toString()}** - *${await primaryAmount.getPrice()}*`
    });
  }
  if (feeAmount) {
    fields.push({
      name: 'Fee',
      value: `**${feeAmount.toString()}** - *${await feeAmount.getPrice()}*`
    });
  }
  if (primaryAmount && feeAmount) {
    const total = primaryAmount.add(feeAmount);
    fields.push({
      name: 'Total',
      value: `**${total.toString()}** - *${await total.getPrice()}*`
    });
  }

  return embedResponse({
    title: 'Transaction Confirmed',
    color: 15422875,
    fields,
    description
  });
}

export function missingOptionsResponse(missingOptions) {
  return errorResponse([
    'You are missing the following options:',
    ...missingOptions.map(option => `\`${option}\``)
  ].join('\n\n'));
}

export function invalidAmountResponse() {
  return errorResponse('That doesn\'t seem to be a valid amount...');
}

export function tokenNotFoundResponse() {
  return errorResponse('That token doesn\'t exist :(');
}

export function invalidAddressResponse() {
  return errorResponse('Invalid address');
}

export function notUnlockedResponse() {
  return errorResponse('Transaction failed\n\nYou must unlock your wallet with `/unlock` in order to send transcations');
}

export function transactionFailedResponse() {
  return errorResponse('Transaction failed.\n\nMake sure you have enough of the specified token to cover the cost plus any additional fees.');
}
