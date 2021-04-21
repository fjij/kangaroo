export function messageResponse(content) {
  return {
    content,
    type: 4,
    tts: false,
    embeds: [],
    allowed_mentions: {
      parse: []
    }
  }
}

export function embedResponse(embed) {
  return {
    content: "",
    type: 4,
    tts: false,
    embeds: [
      embed
    ],
    allowed_mentions: {
      parse: []
    }
  }
}
