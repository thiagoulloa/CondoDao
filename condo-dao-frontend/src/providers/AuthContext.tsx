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

interface AuthContextType {
  isLoggedIn: boolean;
  account: string | null;
  signature: string | null;
  signer: ethers.Signer | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [signature, setSignature] = useState<string | null>(null); // Estado para a assinatura

  const login = async () => {
    if (window.ethereum) {
      try {
        // Solicita a conexão da carteira
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          const selectedAccount = accounts[0];
          // if(selectedAccount != ownerAddress) return;
          setAccount(selectedAccount);

          // Obtém o provedor e o signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const userSigner = await provider.getSigner();
          setSigner(userSigner);

          // Solicita a assinatura da mensagem
          const userSignature = await userSigner.signMessage(
            "Sign this message to authenticate with our application."
          );
          setSignature(userSignature); // Armazena a assinatura no estado
          // Após obter a assinatura, define o estado de login como verdadeiro
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const logout = () => {
    setAccount(null);
    setSignature(null); // Limpa a assinatura ao deslogar
    setIsLoggedIn(false);
    setSigner(null);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          const selectedAccount = accounts[0];
          setAccount(selectedAccount);

          // Obtém o provedor e o signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const userSigner = await provider.getSigner();
          setSigner(userSigner);
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
