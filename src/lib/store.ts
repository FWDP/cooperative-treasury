import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Account, Networks, Operation } from '@stellar/stellar-sdk';
import { signIn, signOut } from 'next-auth/react';

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

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
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
          const address = accessRes.address;
          const message = `Sign in to Cooperative Treasury: ${Date.now()}`;
          
          try {
            // SEP-10 style challenge transaction
            const tx = new TransactionBuilder(
              new Account(address, "0"), 
              { fee: "100", networkPassphrase: Networks.TESTNET }
            )
            .addOperation(Operation.manageData({ name: "auth", value: message.substring(0, 64) }))
            .setTimeout(300)
            .build();
            
            const xdr = tx.toXDR();
            
            const signRes = await signTransaction(xdr, { networkPassphrase: Networks.TESTNET });
            
            if (signRes.error) {
              set({ error: signRes.error, isConnecting: false });
              return;
            }

            const authRes = await signIn("credentials", {
              address,
              message, // We can still pass message for logging
              signature: signRes.signedTxXdr, // pass the signed XDR
              redirect: false,
            });

            if (authRes?.error) {
              set({ error: "Authentication failed. Invalid signature.", isConnecting: false });
              return;
            }

            set({ address, isConnecting: false });
            get().fetchBalance();
          } catch (e: any) {
            set({ error: e.message || "Signature request failed", isConnecting: false });
          }
        }
      } else {
        set({ error: "Freighter wallet not installed.", isConnecting: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to connect wallet", isConnecting: false });
    }
  },

  disconnectWallet: () => {
    signOut({ redirect: false });
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
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ address: state.address }),
    }
  )
);
