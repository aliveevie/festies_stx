import {
  AppConfig,
  LOCALSTORAGE_SESSION_KEY,
  UserSession,
  isStacksWalletInstalled,
  showConnect
} from '@stacks/connect';
import { getEnv, getNetwork } from './environment';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const STACKS_SESSION_STORAGE_KEY = LOCALSTORAGE_SESSION_KEY;

export const getUserSession = () => userSession;

export const isWalletInstalled = () => {
  try {
    return isStacksWalletInstalled();
  } catch {
    return false;
  }
};

export const isSignedIn = () => userSession.isUserSignedIn();

export const loadUserData = () => {
  if (!userSession.isUserSignedIn()) return null;
  return userSession.loadUserData();
};

export const getStacksNetworkName = () => getNetwork();

export const connectStacksWallet = async (options = {}) => {
  if (typeof window === 'undefined') {
    throw new Error('Stacks Connect is only available in the browser');
  }

  const appName = getEnv(['VITE_APP_NAME'], 'Festies');
  const appIcon = getEnv(['VITE_APP_ICON'], `${window.location.origin}/favicon.ico`);

  const appDetails = options.appDetails || { name: appName, icon: appIcon };
  const redirectTo = options.redirectTo || window.location.pathname || '/';

  return new Promise((resolve, reject) => {
    showConnect({
      userSession,
      appDetails,
      redirectTo,
      onFinish: () => resolve(loadUserData()),
      onCancel: () => reject(new Error('Wallet connection cancelled'))
    });
  });
};

export const disconnectStacksWallet = () => {
  if (typeof window === 'undefined') return;
  userSession.signUserOut(window.location.origin);
};

