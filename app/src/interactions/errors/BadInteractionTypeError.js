export class BadInteractionTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadInteractionTypeError';
  }
}
