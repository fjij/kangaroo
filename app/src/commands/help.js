export function help(_interaction) {
  return {
    type: 4,
    data: {
      tts: false,
      content: "",
      embeds: [
        {
          title: 'Kangaroo Help',
          description: 'Hi there :)'
        }
      ],
      allowed_mentions: {
        parse: []
      }
    }
  };
}
