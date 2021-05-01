import * as zksync from 'zksync';
import * as ethers from 'ethers';
import config from '../config/index.js';

let syncProvider, ethersProvider;
export async function init() {
  syncProvider = await zksync.getDefaultProvider(config.chainName);
  ethersProvider = ethers.getDefaultProvider(config.chainName);
};

export class Amount {
  static fromStringValue(token, value) {
    if (!syncProvider) {
      throw new Error('Missing syncProvider');
    }
    const bigNumber = syncProvider.tokenSet.parseToken(token.ticker, value);
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
    if (!syncProvider) {
      throw new Error('Missing syncProvider');
    }
    return syncProvider.tokenSet.formatToken(this.token.ticker, this.value);
  }

  toString() {
    return `${this.getStringValue()} ${this.getToken().ticker}`;
  }
}

export class Wallet {

  static async create(privateKey) {
    if (!ethersProvider) {
      throw new Error('Could not create wallet. Missing ethersProvider');
    }
    if (!syncProvider) {
      throw new Error('Could not create wallet. Missing syncProvider');
    }

    const ethersWallet = privateKey?
      new ethers.Wallet(privateKey).connect(ethersProvider):
      ethers.Wallet.createRandom().connect(ethersProvider);

    const syncWallet = await zksync.Wallet.fromEthSigner(ethersWallet, syncProvider);

    return new Wallet(ethersWallet, syncWallet);
  }

  constructor(ethersWallet, syncWallet) {
    if (!ethersWallet || !syncWallet) {
      throw new Error('Must provide ethersWallet and syncWallet');
    }
    this.ethersWallet = ethersWallet;
    this.syncWallet = syncWallet;
  }

  // Unlock zkSync account using token
  async unlock(token) {
    if (!(await this.syncWallet.isSigningKeySet())) {
      if ((await this.syncWallet.getAccountId()) == undefined) {
        throw new Error('Unknown account');
      }

      const changePubkey = await this.syncWallet.setSigningKey({
        feeToken: token.ticker,
        ethAuthType: 'ECDSA',
      });

      await changePubkey.awaitReceipt();
    }
  }

  async getBalance(token) {
    const value = await this.syncWallet.getBalance(token.ticker);
    return new Amount(token, value);
  }

  getAddress() {
    return this.syncWallet.address();
  }

  async getUnlockFee(token) {
    const fee = await syncProvider.getTransactionFee(
      { ChangePubKey: 'ECDSA' },
      this.getAddress(),
      token.ticker
    );
    return new Amount(token, fee.totalFee);
  }

  async getTransferFee(token, address) {
    const fee = await syncProvider.getTransactionFee(
      'Transfer',
      address,
      token.ticker
    );
    return new Amount(token, fee.totalFee);
  }

  async transfer(token, address, amount, fee) {
    const transfer = await this.syncWallet.syncTransfer({
      to: address,
      token: token.ticker,
      amount: zksync.utils.closestPackableTransactionFee(amount.getValue()),
      fee: zksync.utils.closestPackableTransactionFee(fee.getValue())
    });

    const transferReceipt = await transfer.awaitReceipt();

    return transferReceipt;
  }
}
