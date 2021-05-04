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

export function tokenNotFoundResponse() {
  return errorResponse('That token doesn\'t exist :(');
}

export function transactionFailedResponse() {
  return errorResponse('Transaction failed.\nMake sure you have enough of the specified token to cover the cost plus any additional fees.');
}
