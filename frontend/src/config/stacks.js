import { getEnv, getNetwork } from '../utils/environment';

export const getStacksApiBaseUrl = () => {
  const override = getEnv(['VITE_STACKS_API_URL', 'VITE_STACKS_API_BASE_URL'], null);
  if (override) return override;

  const network = getNetwork();
  if (network === 'mainnet') return 'https://stacks-node-api.mainnet.stacks.co';
  if (network === 'devnet') return 'http://localhost:3999';
  return 'https://stacks-node-api.testnet.stacks.co';
};

export const getFestiesContractAddress = () =>
  getEnv(
    ['VITE_FESTIES_CONTRACT_ADDRESS', 'VITE_CONTRACT_ADDRESS', 'REACT_APP_FESTIES_CONTRACT_ADDRESS'],
    null
  );

export const getFestiesContractName = () =>
  getEnv(['VITE_FESTIES_CONTRACT_NAME', 'VITE_CONTRACT_NAME', 'REACT_APP_FESTIES_CONTRACT_NAME'], 'festies');

