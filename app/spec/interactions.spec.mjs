import { ping } from '../src/interactions/ping.js';
import { BadInteractionTypeError } from '../src/interactions/errors/BadInteractionTypeError.js';

describe('ping', () => {
  it('should ACK a ping', () => {
    const interactionResponse = ping({ type: 1 });
    expect(interactionResponse).toEqual({ type: 1 });
  });
  it('should fail on wrong type', () => {
    expect(() => ping({ type: 2 }))
      .toThrow(new BadInteractionTypeError('Expected 1 but got 2'));
  });
});
