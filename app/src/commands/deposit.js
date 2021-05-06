import { getOrCreateWallet } from '../user/index.js';
import { getUserId } from '../interactions/index.js';
import config from '../config/index.js';
import { embedResponse } from '../responses/index.js';

export async function deposit(interaction) {
    const wallet = await getOrCreateWallet(getUserId(interaction))
    const pubKey = wallet.getAddress()

    const description = `Depositing allows you to store your tokens in your Kangaroo Wallet
    
In order to deposit connect your wallet to the ${ config.zkLink } network.
Then deposit to your Kangaroo wallet with your public key ${ pubKey }
The transaction will take some time, you can use the /balance function to check if the transaction has finished.`
 
    return embedResponse({
     title: 'Deposit',
     "color": 15422875,
     description
    })
 }