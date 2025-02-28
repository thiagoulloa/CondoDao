"use client";

interface EthereumWindow extends Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<any>;
  };
}

declare const window: EthereumWindow;

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { useLoading } from "./loading-context"; // Import useLoading

interface AuthContextType {
  isLoggedIn: boolean;
  account: string | null;
  signature: string | null;
  signer: ethers.Signer | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setIsLoading } = useLoading(); // Get setIsLoading from context

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const login = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true); // Start loading
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          const selectedAccount = accounts[0];
          setAccount(selectedAccount);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const userSigner = await provider.getSigner();
          setSigner(userSigner);

          const userSignature = await userSigner.signMessage(
            "Sign this message to authenticate with our application."
          );
          setSignature(userSignature);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
      } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const logout = () => {
    setAccount(null);
    setSignature(null);
    setIsLoggedIn(false);
    setSigner(null);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          setIsLoading(true);
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            const selectedAccount = accounts[0];
            setAccount(selectedAccount);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const userSigner = await provider.getSigner();
            setSigner(userSigner);
          }
        } catch (error) {
          console.error("Error checking wallet connection: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        account,
        signer,
        signature,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
