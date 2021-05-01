import config from '../config/index.js';
import * as zksync from 'zksync';
import * as ethers from 'ethers';

let syncProvider, ethersProvider;
export async function init() {
  syncProvider = await zksync.getDefaultProvider(config.chainName);
  ethersProvider = ethers.getDefaultProvider(config.chainName);
}

export function getSyncProvider() {
  return syncProvider;
}

export function getEthersProvider() {
  return ethersProvider;
}
