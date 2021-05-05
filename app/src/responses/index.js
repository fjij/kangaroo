export function messageResponse(content) {
  return {
    type: 4,
    data: {
      content
    }
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

export async function previewTransactionResponse(
  description,
  primaryAmount,
  feeAmount,
  confirmCommand
) {
  const texts = [];
  texts.push(description);
  if (primaryAmount) {
    texts.push(`${primaryAmount.toString()} - ${await primaryAmount.getPrice()}`);
  }
  if (feeAmount) {
    texts.push(`Fee:\n${feeAmount.toString()} - ${await feeAmount.getPrice()}`);
  }
  if (primaryAmount && feeAmount) {
    const total = primaryAmount.add(feeAmount);
    texts.push(`Total:\n${total.toString()} - ${await total.getPrice()}`);
  }
  texts.push(`\`${confirmCommand}\` to confirm transaction`);

  return embedResponse({
    title: 'Preview Transaction',
    color: 15422875,
    description: texts.join('\n\n'),
  });
}

export async function transactionResponse(
  description,
  primaryAmount,
  feeAmount
) {
  const texts = [];
  texts.push(description);
  if (primaryAmount) {
    texts.push(`${primaryAmount.toString()} - ${await primaryAmount.getPrice()}`);
  }
  if (feeAmount) {
    texts.push(`Fee:\n${feeAmount.toString()} - ${await feeAmount.getPrice()}`);
  }
  if (primaryAmount && feeAmount) {
    const total = primaryAmount.add(feeAmount);
    texts.push(`Total:\n${total.toString()} - ${await total.getPrice()}`);
  }

  return embedResponse({
    title: 'Transaction Sent',
    color: 15422875,
    description: texts.join('\n\n'),
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

export function transactionFailedResponse() {
  return errorResponse('Transaction failed.\nMake sure you have enough of the specified token to cover the cost plus any additional fees.');
}
