export function applicationCommand(_interaction) {
  return {
    type: 4,
    data: {
      tts: false,
      content: "Congrats on sending your command!",
      embeds: [],
      allowed_mentions: {
        parse: []
      }
    }
  };
}
