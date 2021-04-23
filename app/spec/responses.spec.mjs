import { messageResponse, embedResponse } from '../src/responses/index.js';

describe('embedResponse', () => {
  it('should be formatted properly', () => {
    const embed = {
      title: 'some random embed',
      description: 'some words',
    };
    const res = embedResponse(embed);
    expect(res).toEqual({
      type: 4,
      data: {
        embeds: [
          embed
        ]
      }
    });
  });
});

describe('messageResponse', () => {
  it('should be formatted properly', () => {
    const content = 'hello discord';
    const res = messageResponse(content);
    expect(res).toEqual({
      type: 4,
      data: {
        content
      }
    });
  });
});
