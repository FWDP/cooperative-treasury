import { create } from 'zustand';
import { isConnected, requestAccess } from '@stellar/freighter-api';

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnecting: false,
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
        }
      } else {
        set({ error: "Freighter wallet not installed.", isConnecting: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to connect wallet", isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({ address: null, error: null });
  },
}));
