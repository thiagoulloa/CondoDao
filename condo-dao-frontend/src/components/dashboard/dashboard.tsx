"use client";

import { useAuth } from "@/lib/auth";
import { MotionButton } from "../ui/MotionButton";
import { SuggestionsContainer } from "../containers/suggestionsContainer";
import { FaPlus } from "react-icons/fa";
import { IconButton } from "../ui/IconButton";
import Logo from "../../../public/images/logo.svg";
import { ResidentContainer } from "../containers/residentContainer";
import { WithdrawalRequestsContainer } from "../containers/withdrawalContainer";
import { NewSuggestionPopup } from "../Popups/NewSuggestionPopup";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";

import { WithdrawalRequestPopup } from "../Popups/WithdrawalPopup";
import { useRouter } from "next/navigation";
import { useContent } from "@/lib/content-context";

export const Dashboard = () => {
  const router = useRouter();
  const { contractAddress } = useContent();

  const { isLoggedIn, login, logout, account, signer } = useAuth();
  const [newSuggPopupIsOpen, setNewSuggPopupIsOpen] = useState<boolean>(false);
  const [withdrawalPopupIsOpen, setWithdrawalPopupIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  function handleNewSuggestionPopup() {
    if (newSuggPopupIsOpen) {
      setNewSuggPopupIsOpen(!newSuggPopupIsOpen);
    } else if (!newSuggPopupIsOpen) {
      setNewSuggPopupIsOpen(!newSuggPopupIsOpen);
    }
  }

  function handleWithdrawalRequestPopup() {
    if (newSuggPopupIsOpen) {
      setWithdrawalPopupIsOpen(!withdrawalPopupIsOpen);
    } else if (!newSuggPopupIsOpen) {
      setWithdrawalPopupIsOpen(!withdrawalPopupIsOpen);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#1E1E1E] text-white">
      <div className="w-full py-4 top-0 bg-[#4B4B4B] flex justify-between items-center px-6 gap-4">
        <Image src={Logo} alt="" width={40} />
        <div className="flex gap-4">
          <div className="flex flex-col w-60 font-bold">
            <p className="truncate">Condo contract: {contractAddress}</p>
            <p className="truncate">Address: {account}</p>
          </div>
          <div className="w-[1px] min-h-full bg-white"></div>
          <IconButton func={logout} Icon={MdLogout} className="w-10" />
        </div>
      </div>
      <div className="grid grid-cols-3 flex-grow flex-col w-full h-full max-w-350 p-8 gap-8 justify-center items-center">
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <SuggestionsContainer
            handleNewSuggestionPopup={handleNewSuggestionPopup}
          />
          <div className="w-full h-[25%] bg-[#313131] flex flex-col items-start justify-center rounded-4xl py-8 px-6 gap-1">
            <p className="text-2xl font-bold text-[#AAAAAA]">
              Fundo de reserva do condomínio
            </p>
            <p className="text-5xl font-bold text-white">R$7.570</p>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <div className="w-full h-[37.5%] bg-[#313131] flex flex-col items-center justify-center rounded-4xl py-8 px-6 gap-4">
            <p className="text-2xl font-bold text-[#AAAAAA]">Contas a pagar</p>
            <div className="w-full bg-[#4B4B4B] py-4 flex flex-col rounded-2xl px-6 gap-2">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-xl font-bold">Taxa do condomínio</p>
                <div className="h-px w-full bg-[#AAAAAA]"></div>
                <p className="text-xl font-bold">ETH 0.04</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-md font-bold text-[#AAAAAA]">
                  Fev 27, 2025 - 17:12
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-[37.5%] bg-[#313131] flex flex-col items-center justify-start rounded-4xl py-8 px-6 gap-4">
            <div className="flex items-center justify-center gap-2 text-[#AAAAAA]">
              <p className="text-2xl font-bold  text-center">
                Listagem condôminos
              </p>
              <IconButton Icon={FaPlus} func={() => console.log("teste")} />
            </div>
            <div className="h-full overflow-y-auto w-full flex flex-col gap-3 hide-scrollbar">
              <ResidentContainer ap="353" address="0x32435" />
              <ResidentContainer ap="353" address="0x32435" admin={true} />
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <WithdrawalRequestsContainer
            handleWithdrawalRequestPopup={handleWithdrawalRequestPopup}
          />
          <div className="w-full h-[25%] "></div>
        </div>
      </div>
      {newSuggPopupIsOpen && (
        <NewSuggestionPopup
          handleNewSuggestionPopup={handleNewSuggestionPopup}
        />
      )}
      {withdrawalPopupIsOpen && (
        <WithdrawalRequestPopup
          handleWithdrawalRequestPopup={handleWithdrawalRequestPopup}
        />
      )}
    </div>
  );
};
