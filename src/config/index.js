
const Config = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://ethsigns.com/api/v1/",
  RPC_API_URL: process.env.REACT_APP_RPC_API_URL,
  PUBLIC_KEY: process.env.REACT_APP_PUBLIC_KEY,
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
  TX_EXPLORER: process.env.REACT_APP_TRANSACTION_EXPLORER,
  CLOUDINARY_PRESET: process.env.REACT_APP_CLOUDINARY_PRESET,
  CLOUDINARY_URL: process.env.REACT_APP_CLOUDINARY_URL,
};
export default Config;
