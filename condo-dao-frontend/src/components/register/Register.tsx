"use client";

import Logo from ".././../../public/images/logo.svg";

import Image from "next/image";
import { IconButton } from "../ui/IconButton";
import { IoMdClose } from "react-icons/io";
import { Input } from "../ui/Input";
import { MotionButton } from "../ui/MotionButton";
import { BsBuildingsFill } from "react-icons/bs";

import { FaLongArrowAltRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContent } from "@/lib/content-context";

export const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tax, setTax] = useState<number>(0);

  const [ap, setAp] = useState("");
  const [committeeMembersAddress, setCommitteeMembersAddress] = useState<
    string[]
  >([]);
  const [committeeMembersAp, setCommitteeMembersAp] = useState<string[]>([]);
  const { createCondoDAO } = useContent();

  useEffect(() => {
    console.log(committeeMembersAddress, committeeMembersAp);
  }, [committeeMembersAddress]);

  return (
    <div className="flex flex-col relative items-center justify-start min-h-screen gap-10 bg-[#1E1E1E] text-white">
      <div className="w-full py-4 top-0 bg-[#4B4B4B] flex justify-start items-center px-6 gap-4">
        <Image src={Logo} alt="" width={40} />
      </div>
      <div className="w-full min-h-full flex-grow flex justify-center items-center">
        <div className="w-150 h-fit bg-[#313131] flex flex-col items-center overflow-hidden justify-start rounded-4xl py-6 px-6 gap-4">
          <div className="flex gap-3 items-center w-full justify-center relative">
            <BsBuildingsFill className="text-3xl" />
            <p className="text-3xl font-bold">Cadastrar condomínio</p>
            <IconButton
              className="text-3xl absolute right-0"
              Icon={IoMdClose}
              func={() => router.push("/")}
            />
          </div>
          <div className="flex gap-8 w-full">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold text-xl">Nome do condomínio:</p>
                <Input setContent={setName} value={name} />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold text-xl">Taxa do condomínio:</p>
                <Input setContent={setTax} value={tax} />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold text-xl">
                  Adicionar membros ao comitê:
                </p>
                <div className="flex flex-col gap-4">
                  <Input
                    setContent={setAddress}
                    value={address}
                    placeholder="Endereço do condômino"
                  />
                  <Input
                    setContent={setAp}
                    value={ap}
                    placeholder="Apartamento (Ex: 112)"
                  />
                  <MotionButton
                    label="Adicionar"
                    func={() => {
                      setCommitteeMembersAddress([
                        ...committeeMembersAddress,
                        address,
                      ]);
                      setCommitteeMembersAp([...committeeMembersAp, ap]);
                      setAddress("");
                    }}
                    className="bg-[#E3BA6A]! w-full h-12 rounded-2xl! text-black"
                  />
                </div>
              </div>
              <MotionButton
                label="Enviar"
                func={() =>
                  createCondoDAO(
                    name,
                    committeeMembersAddress,
                    committeeMembersAp,
                    tax
                  )
                }
                Icon={FaLongArrowAltRight}
                className="bg-[#222C42]! w-full h-12 rounded-2xl!"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
