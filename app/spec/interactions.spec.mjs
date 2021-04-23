import { ping } from '../src/interactions/ping.js';
import { getUserId } from '../src/interactions/index.js';
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

describe('getUserId', () => {
  it('should return a userId in a guild', () => {
    const userId = getUserId({ member: { user: { id: '1234' } } });
    expect(userId).toEqual('1234');
  });

  it('should return a userId in dms', () => {
    const userId = getUserId({ user: { id: '1234' } });
    expect(userId).toEqual('1234');
  });

  it('should return undefined for no userId', () => {
    const userId = getUserId({});
    expect(userId).toBeUndefined();
  });
});
