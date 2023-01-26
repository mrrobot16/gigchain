const { REACT_APP_NETWORK: NETWORK, REACT_APP_INFURA_ID: INFURA_ID } = process.env;

export const INFURA_URL = `https://${NETWORK}.infura.io/v3/${INFURA_ID}`;