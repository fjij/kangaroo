import * as zksync from 'zksync';
import * as providers from './providers.js';

export class Amount {
  static fromStringValue(token, value) {
    if (!providers.getSyncProvider()) {
      throw new Error('Missing syncProvider');
    }
    const bigNumber = providers.getSyncProvider().tokenSet
      .parseToken(token.ticker, value);
    if (bigNumber.lt(0)) {
      throw new Error('Amounts must be positive number');
    }
    return new Amount(token, bigNumber);
  }

  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  getToken() {
    return this.token;
  }

  add(other) {
    if (this.getToken().ticker !== other.getToken().ticker) {
      throw new Error('Token mismatch');
    }
    return new Amount(this.token, this.getValue().add(other.getValue()));
  }

  getClosestPackable() {
    return new Amount(
      this.token,
      zksync.utils.closestPackableTransactionFee(this.getValue())
    );
  }

  getStringValue() {
    if (!providers.getSyncProvider()) {
      throw new Error('Missing syncProvider');
    }
    return providers.getSyncProvider().tokenSet.formatToken(this.token.ticker, this.value);
  }

  toString() {
    return `${this.getStringValue()} ${this.getToken().ticker}`;
  }

  async getPrice() {
    const price = await providers.getSyncProvider().getTokenPrice(this.token.ticker);
    const dollars = (price*parseFloat(this.getStringValue())).toFixed(2);
    return `$${dollars}`;
  }
}
