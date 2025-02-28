"use client";

import { MotionButton } from "@/components/ui/MotionButton";
import { useAuth } from "@/lib/auth";
import { BsBuildingFillGear } from "react-icons/bs";
import { FaBuildingUser } from "react-icons/fa6";

import { IconButton } from "@/components/ui/IconButton";
import Logo from "../../public/images/logo.svg";

import Image from "next/image";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { FiDivideCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { isLoggedIn, login, logout, account, signer } = useAuth();

  return (
    <div className="flex flex-col relative items-center justify-start min-h-screen gap-10 bg-[#313131] text-white">
      <div className="w-full py-4 top-0 bg-[#4B4B4B] flex justify-start items-center px-6 gap-4">
        <Image src={Logo} alt="" width={40} />
      </div>
      <div className="w-full min-h-full flex-grow flex justify-center">
        <div className="w-[90%] max-w-400 min-h-full flex bg-[#1E1E1E] rounded-tl-[3rem] rounded-tr-[3rem]">
          <div className="w-[40%] px-10 pt-10 flex flex-col justify-between gap-20 items-center">
            <div className="flex flex-col text-center gap-8">
              <p className="text-5xl font-bold">Comece por aqui!</p>
              <p
                className="text-xl font-extralight
"
              >
                Se ainda não estiver com a carteira conectada, conecte-se já
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-tl-[3rem] rounded-tr-[3rem] w-full h-full px-8 pt-10 flex flex-col gap-8">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-3xl text-black font-semibold">
                  Conecte-se a sua carteira WEB3
                </p>
                <p className="text-black">
                  É simples e rápido, basta clicar no botão abaixo para
                  continuar
                </p>
              </div>
              <MotionButton
                label={isLoggedIn ? "Carteira conectada!" : "Acessar carteira"}
                func={isLoggedIn ? () => console.log("") : login}
                className="bg-[#2F6D62]!"
              />
              <div
                className="flex text-black font-light
"
              >
                <p>
                  Não possui uma carteira Metamask?
                  <a
                    href="https://portaldobitcoin.uol.com.br/o-passo-a-passo-para-criar-e-usar-uma-carteira-metamask/"
                    className="text-[#0084FF] underline"
                    target="_blank"
                  >
                    {" "}
                    Clique aqui
                  </a>{" "}
                  para aprender a criar
                </p>
              </div>
            </div>
          </div>
          <div className="w-[0.5px] h-full bg-[#8E8E8EBD]/74"></div>
          <div className="w-[60%] px-10 pt-10 flex flex-col justify-between gap-14 items-center">
            <p className="text-5xl font-bold">
              Selecione uma das opções abaixo
            </p>
            <div className="bg-[#F5F5F5] rounded-tl-[3rem] rounded-tr-[3rem] w-full h-full px-8 py-10 flex flex-col gap-8">
              <div className="w-full h-full flex bg-[#D9D9D9] rounded-3xl">
                <div className="w-[55%] h-full p-8 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-3xl text-[#1E1E1E] font-bold">
                      Conecte-se como condômino
                    </p>
                    <p className="text-sm text-black">
                      Como condômino você pode gerenciar seus pagamentos e
                      enviar sugestões aos outros moradores!
                    </p>
                  </div>
                  <MotionButton
                    label="Conectar"
                    className="bg-[#222C42]!"
                    func={
                      isLoggedIn
                        ? () => router.push("/dashboard")
                        : () =>
                            toast.warn("É necessário conectar uma carteira!", {
                              position: "top-center",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            })
                    }
                  />
                </div>
                <div className="w-[45%] h-full bg-[url('../../public/images/residentLndImage.png')] bg-cover bg-center rounded-3xl"></div>
              </div>
              <div className="w-full h-full flex bg-[#D9D9D9] rounded-3xl">
                <div className="w-[55%] h-full p-8 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-3xl text-[#1E1E1E] font-bold">
                      Cadastrar condomínio
                    </p>
                    <p className="text-sm text-black">
                      Ao cadastrar um condomínio, você controla os gastos do
                      condomínio, vota orçamentos com o comitê e adiciona
                      moradores ao sistema
                    </p>
                  </div>
                  <MotionButton
                    label="Cadastrar"
                    className="bg-[#222C42]!"
                    func={
                      isLoggedIn
                        ? () => router.push("/register")
                        : () =>
                            toast.warn("É necessário conectar uma carteira!", {
                              position: "top-center",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            })
                    }
                  />
                </div>
                <div className="w-[45%] h-full bg-[url('../../public/images/buildingsLndImage.png')] bg-cover bg-center rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
