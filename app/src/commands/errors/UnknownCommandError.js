export class UnknownCommandError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownCommandError';
  }
}
