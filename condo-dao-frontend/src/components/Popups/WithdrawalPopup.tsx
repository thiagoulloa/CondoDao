import { IoMdClose } from "react-icons/io";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";
import { useState } from "react";
import { TextArea } from "../ui/TextArea";
import { MotionButton } from "../ui/MotionButton";
import { FaLongArrowAltRight } from "react-icons/fa";
import { PiHandWithdrawFill } from "react-icons/pi";

export const WithdrawalRequestPopup = ({
  handleWithdrawalRequestPopup,
}: {
  handleWithdrawalRequestPopup: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [suggestedValue, setSuggestedValue] = useState<number>(0);

  return (
    <div className="fixed inset-0 z-20 bg-black/50 flex items-center justify-center  max-w-[100vw]">
      <div className="w-150 h-fit bg-[#313131] flex flex-col items-center overflow-hidden justify-start rounded-4xl py-6 px-6 gap-4">
        <div className="flex gap-3 items-center w-full justify-center relative">
          <PiHandWithdrawFill className="text-3xl" />
          <p className="text-3xl font-bold">Solicitar saque</p>
          <IconButton
            className="text-3xl absolute right-0"
            Icon={IoMdClose}
            func={handleWithdrawalRequestPopup}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold text-xl">Título/Motivo:*</p>
          <Input setContent={setTitle} value={title} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold text-xl">Descrição:*</p>
          <TextArea setContent={setDesc} value={description} />
        </div>
        <div className="flex gap-4 w-full items-end">
          <div className="flex w-full flex-col gap-2">
            <p className="font-bold text-xl">Valor de saque:*</p>
            <Input setContent={setSuggestedValue} value={suggestedValue} />
          </div>
          <MotionButton
            label="Enviar"
            func={() => console.log("teste")}
            className="bg-[#222C42]! w-full h-12 rounded-2xl!"
            Icon={FaLongArrowAltRight}
          />
        </div>
      </div>
    </div>
  );
};
