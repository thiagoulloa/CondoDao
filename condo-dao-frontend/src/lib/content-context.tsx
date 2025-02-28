"use client";

interface EthereumWindow extends Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<any>;
  };
}

declare const window: EthereumWindow;
import React, { createContext, useState, useContext } from "react";
import { ethers } from "ethers";

interface ContentState {
  addResident: (wallet: string, id: string) => Promise<void>;
  approveProposal: (proposalId: number) => Promise<void>;
  createProposal: (description: string) => Promise<void>;
  payCondominiumFee: (value: string) => Promise<void>;
  getProposalDetails: (proposalId: number) => Promise<any>;
  getInadimplentes: () => Promise<string[]>;
  setContractAddress: React.Dispatch<React.SetStateAction<string>>;
  contractAddress: string;
  getMonthsOwed: (wallet: string) => Promise<number>;
  isLoading: boolean;
  getContractCreateCondo: () => Promise<ethers.Contract>;
  createCondoDAO: (
    name: string,
    committee: string[],
    ids: string[],
    feeETH: number
  ) => Promise<any>;
  getDeployedDAOs: () => Promise<string[]>;
}

const FACTORY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS;
const FACTORY_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "daoAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "CondoDAOCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_committee",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "_ids",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_feeETH",
        type: "uint256",
      },
    ],
    name: "createCondoDAO",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deployedDAOs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeployedDAOs",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_committee",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "_ids",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_feeETH",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newFeeETH",
        type: "uint256",
      },
    ],
    name: "CondominiumFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "paymentMethod",
        type: "string",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ProposalApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "ProposalExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "id",
        type: "string",
      },
    ],
    name: "ResidentAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "theme",
        type: "string",
      },
    ],
    name: "VoteProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "VoteResultsCleared",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "VoteSubmitted",
    type: "event",
  },
  {
    inputs: [],
    name: "PAYMENT_INTERVAL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
    ],
    name: "addResident",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "approveProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "clearVoteResults",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "committee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "condominiumFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_theme",
        type: "string",
      },
    ],
    name: "createVoteProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getInadimplentes",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
    ],
    name: "getMonthsOwed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "getProposalDetails",
    outputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "approvals",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hasOpenInvoice",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVotedForTheme",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isCommitteeMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payCondominiumFee",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "approvals",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "residentList",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "residents",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "lastPaymentTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeETH",
        type: "uint256",
      },
    ],
    name: "setCondominiumFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voteProposals",
    outputs: [
      {
        internalType: "string",
        name: "theme",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ContentContext = createContext<ContentState>({
  addResident: async () => {}, // Renomeado
  approveProposal: async () => {},
  createProposal: async () => {},
  payCondominiumFee: async () => {}, // Renomeado
  getProposalDetails: async () => ({}),
  getInadimplentes: async () => [],
  setContractAddress: () => {},
  contractAddress: "",
  getMonthsOwed: async () => 0,
  isLoading: false,
  getContractCreateCondo: async () => {
    throw new Error("getContractCreateCondo not implemented");
  },
  createCondoDAO: async () => {
    throw new Error("createCondoDAO not implemented");
  },
  getDeployedDAOs: async () => [],
});
export const ContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const bytes32 = require("bytes32");

  // Função auxiliar para obter a instância do contrato
  const getContractCreateCondo = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask não detectado");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (!FACTORY_CONTRACT_ADDRESS) {
      throw new Error("Contract address is not defined");
    }
    return new ethers.Contract(
      FACTORY_CONTRACT_ADDRESS,
      FACTORY_CONTRACT_ABI,
      signer
    );
  };

  const createCondoDAO = async (
    name: string,
    committee: string[],
    ids: string[], // Novo parâmetro
    feeETH: number
  ) => {
    try {
      console.log(name, committee, ids, feeETH);
      const contract = await getContractCreateCondo();
      const tx = await contract.createCondoDAO(
        name,
        committee,
        ids, // Passar o array ids
        String(feeETH * 10 ** 18)
      );
      const receipt = await tx.wait();
      console.log(receipt.logs[0].args[0]);
      setContractAddress(receipt.logs[0].args[0]);
    } catch (error) {
      console.error("Erro ao criar Condo DAO:", error);
      throw error;
    }
  };

  // Função para obter DAOs implantados
  const getDeployedDAOs = async () => {
    try {
      const contract = await getContractCreateCondo();
      const daos = await contract.getDeployedDAOs();
      console.log("DAOs implantados:", daos);
      return daos;
    } catch (error) {
      console.error("Erro ao buscar DAOs implantados:", error);
      throw error;
    }
  };

  // GERENCIAMENTO

  async function getContract() {
    if (!window.ethereum) throw new Error("Metamask não detectado");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (!contractAddress) throw new Error("Contract address is not defined");
    return new ethers.Contract(contractAddress, CONTRACT_ADDRESS_ABI, signer);
  }

  const addResident = async (wallet: string, id: string) => {
    // Renomeado e tipo de id atualizado
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.addResident(wallet, bytes32({ input: id })); // Converter id para bytes32
      await tx.wait();
      console.log("Resident added", tx);
    } catch (error) {
      console.error("Error adding resident:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveProposal = async (proposalId: number) => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.approveProposal(proposalId);
      await tx.wait();
      console.log("Proposta aprovada", tx);
    } catch (error) {
      console.error("Error approving proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProposal = async (description: string) => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.createProposal(description);
      await tx.wait();
      console.log("Proposta criada", tx);
    } catch (error) {
      console.error("Error creating proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const payCondominiumFee = async (value: string) => {
    // Renomeado
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.payCondominiumFee({
        // Chamar a função renomeada
        value: ethers.parseEther(value),
      });
      await tx.wait();
      console.log("Taxa de condomínio paga", tx);
    } catch (error) {
      console.error("Error paying condominium fee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProposalDetails = async (proposalId: number) => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      return await contract.getProposalDetails(proposalId);
    } catch (error) {
      console.error("Error getting proposal details:", error);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const getInadimplentes = async () => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      return await contract.getInadimplentes();
    } catch (error) {
      console.error("Error getting inadimplentes:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthsOwed = async (wallet: string) => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      return await contract.getMonthsOwed(wallet);
    } catch (error) {
      console.error("Error getting months owed:", error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        addResident,
        approveProposal,
        createProposal,
        payCondominiumFee,
        getProposalDetails,
        getInadimplentes,
        setContractAddress,
        contractAddress,
        getMonthsOwed,
        isLoading,
        getContractCreateCondo,
        createCondoDAO,
        getDeployedDAOs,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
