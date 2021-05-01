import * as zksync from 'zksync';
import * as ethers from 'ethers';

import * as providers from './providers.js';
import { Amount } from './amount.js';

export class Wallet {
  static async create(privateKey) {
    if (!providers.getEthersProvider()) {
      throw new Error('Could not create wallet. Missing ethersProvider');
    }
    if (!providers.getSyncProvider()) {
      throw new Error('Could not create wallet. Missing syncProvider');
    }

    const ethersWallet = privateKey?
      new ethers.Wallet(privateKey).connect(providers.getEthersProvider()):
      ethers.Wallet.createRandom().connect(providers.getEthersProvider());

    const syncWallet = await zksync.Wallet
      .fromEthSigner(ethersWallet, providers.getSyncProvider());

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
    const fee = await providers.getSyncProvider().getTransactionFee(
      { ChangePubKey: 'ECDSA' },
      this.getAddress(),
      token.ticker
    );
    return new Amount(token, fee.totalFee);
  }

  async getTransferFee(token, address) {
    const fee = await providers.getSyncProvider().getTransactionFee(
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
