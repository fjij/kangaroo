import { InteractionType } from './index.js';
import { BadInteractionTypeError } from './errors/BadInteractionTypeError.js';

export function ping(interaction) {
  if (interaction.type === InteractionType.Ping) {
    return { type: 1 };
  } else {
    const msg = `Expected ${InteractionType.Ping} but got ${interaction.type}`;
    throw new BadInteractionTypeError(msg);
  };
};
