export default {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost/kangaroo-dev?retryWrites=true&w=majority',
  useSecurity: process.env.USE_SECURITY || 'false',
  interactEndpoint: process.env.INTERACTIONS_ENDPOINT || '/api/interactions',
  port: process.env.PORT || 3000,
  appPublicKey: process.env.APPLICATION_PUBLIC_KEY || '',
  appId: process.env.APPLICATION_ID || '',
  chainName: process.env.CHAIN_NAME || 'rinkeby',
};
