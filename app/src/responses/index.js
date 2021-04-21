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
