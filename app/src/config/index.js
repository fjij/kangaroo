export default {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost/kangaroo-dev?retryWrites=true&w=majority',
  useSecurity: process.env.USE_SECURITY || 'false',
  interactEndpoint: process.env.INTERACTIONS_ENDPOINT || '/api/interactions',
  port: process.env.PORT || 3000,
  appPublicKey: process.env.APPLICATION_PUBLIC_KEY || '',
  appId: process.env.APPLICATION_ID || '',
  discordAuth: process.env.DISCORD_AUTHORIZATION || '',
  discordBaseUrl: process.env.DISCORD_BASE_URL || 'https://discord.com/api/v8',
  chainName: process.env.CHAIN_NAME || 'rinkeby',
};
