export default {
    mongo_uri: process.env.MONGO_URI || 'mongodb://localhost/kangaroo-dev?retryWrites=true&w=majority',
    use_security: process.env.USE_SECURITY || false,
    interact_endpoint: process.env.INTERACTIONS_ENDPOINT || '/api/interactions',
    port: process.env.PORT || 3000,
    app_public_key: process.env.APPLICATION_PUBLIC_KEY || '',
  };