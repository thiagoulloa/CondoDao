import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MotionButton } from "../ui/MotionButton";
import { PiHandWithdrawFill } from "react-icons/pi";

import { useState } from "react";

const WithdrawalRequestContainer = ({
  title,
  agree,
  disagree,
  description,
}: {
  title: string;
  agree: string;
  disagree: string;
  description: string;
}) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  return (
    <div className="w-full bg-[#4B4B4B] py-4 flex flex-col rounded-2xl px-6 gap-2">
      <p className="text-xl font-bold text-white ">{title}</p>
      {isOpen && <p>{description}</p>}
      <div
        style={{ justifyContent: "space-between" }}
        className="flex justify-between w-full"
      >
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <FaCircleCheck className="text-[#80EF80]" />
            <p className="font-bold">{agree}</p>
          </div>
          <div className="flex gap-1 items-center">
            <FaCircleXmark className="text-[#FF0000]" />
            <p className="font-bold">{disagree}</p>
          </div>
        </div>
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="w-fit">Exibir detalhes</p>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>
    </div>
  );
};

const sugestoes = [
  {
    title: "Expulsar flamenguistas",
    agree: "54",
    disagree: "38",
    description:
      "teste teste teste teste teste teste teste teste teste teste teste teste",
  },
  {
    title: "Expulsar corinthianos",
    agree: "54",
    disagree: "38",
    description:
      "teste teste teste teste teste teste teste teste teste teste teste teste",
  },
];

export const WithdrawalRequestsContainer = ({
  handleWithdrawalRequestPopup,
}: {
  handleWithdrawalRequestPopup: () => void;
}) => {
  return (
    <div className="w-full h-[50%] bg-[#313131] flex flex-col items-center overflow-hidden justify-start rounded-4xl py-6 px-6 gap-4">
      <p className="text-2xl font-bold text-[#AAAAAA]">Solicitações de saque</p>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 w-full max-h-[200px] overflow-y-auto">
          {sugestoes.length !== 0 &&
            sugestoes.map((e: Suggestion, index) => {
              return (
                <WithdrawalRequestContainer
                  key={index}
                  title={e.title}
                  description={e.description}
                  agree={e.agree}
                  disagree={e.disagree}
                />
              );
            })}
        </div>
        <MotionButton
          label="Solicitar saque"
          className="bg-[#E3BA6A]! text-black rounded-2xl!"
          Icon={PiHandWithdrawFill}
          func={() => handleWithdrawalRequestPopup()}
        />
      </div>
    </div>
  );
};
