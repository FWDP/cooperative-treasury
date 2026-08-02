import { create } from 'zustand';
import { isConnected, requestAccess } from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  isFetchingBalance: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  fetchBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  balance: null,
  isConnecting: false,
  isFetchingBalance: false,
  error: null,

  connectWallet: async () => {
    set({ isConnecting: true, error: null });
    try {
      const connectedRes = await isConnected();
      if (connectedRes.isConnected) {
        const accessRes = await requestAccess();
        if (accessRes.error) {
          set({ error: accessRes.error || "Access denied by user.", isConnecting: false });
        } else if (accessRes.address) {
          set({ address: accessRes.address, isConnecting: false });
          get().fetchBalance();
        }
      } else {
        set({ error: "Freighter wallet not installed.", isConnecting: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to connect wallet", isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({ address: null, balance: null, error: null });
  },

  fetchBalance: async () => {
    const { address } = get();
    if (!address) return;
    set({ isFetchingBalance: true });
    try {
      const account = await server.loadAccount(address);
      const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
      set({ balance: xlmBalance ? xlmBalance.balance : "0.00", isFetchingBalance: false });
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      // Account might not exist on testnet yet (404)
      set({ balance: "0.00", isFetchingBalance: false });
    }
  }
}));
