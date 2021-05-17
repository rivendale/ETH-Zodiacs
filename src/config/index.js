
const Config = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://ethsigns.com/api/v1/",
  RPC_API_URL: process.env.REACT_APP_RPC_API_URL,
  PUBLIC_KEY: process.env.REACT_APP_PUBLIC_KEY,
  PRIVATE_KEY: process.env.REACT_APP_PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
  IPFS_API_KEY: process.env.REACT_APP_IPFS_API_KEY,
  TX_EXPLORER: process.env.REACT_APP_TRANSACTION_EXPLORER,
  // The pinningService config tells minty what remote pinning service to use for pinning the IPFS data for a token.
  // The default config uses Pinata (https://pinata.cloud), and expects a JWT access token in the PINATA_API_TOKEN
  // environment variable.
  pinningService: {
    name: 'pinata',
    endpoint: 'https://api.pinata.cloud/psa',
    key: process.env.REACT_APP_PINATA_API_JWT_TOKEN
  },

  // If you're running IPFS on a non-default port, update this URL. If you're using the IPFS defaults, you should be all set.
  ipfsApiUrl: process.env.REACT_APP_IPFS_API_URL,

  // If you're running the local IPFS gateway on a non-default port, or if you want to use a public gatway when displaying IPFS gateway urls, edit this.
  ipfsGatewayUrl: process.env.REACT_APP_IPFS_GATEWAY_URL,
};
export default Config;
