"use client";

import { MotionButton } from "@/components/ui/MotionButton";
import { useAuth } from "@/providers/AuthContext";
import { BsBuildingFillGear } from "react-icons/bs";
import { FaBuildingUser } from "react-icons/fa6";

export default function Home() {
  const { isLoggedIn, login, logout, account, signer } = useAuth();

  return (
    <div className="flex flex-col relative items-center justify-center min-h-screen p-8 gap-16 bg-[#1E1E1E] text-white">
      <div className="w-full py-4 absolute top-0 flex justify-end items-center px-4 gap-4">
        {isLoggedIn ? (
          <>
            <p className="text-xl py-4 rounded-3xl bg-[#313131] items-center justify-center font-bold px-4">
              {account}
            </p>
            <MotionButton label="Sair" func={logout} className="px-6 w-fit" />
          </>
        ) : (
          <MotionButton
            label="Conectar carteira"
            func={login}
            className="px-6 w-fit"
          />
        )}
      </div>
      <p className="text-4xl font-bold text-white">CondoDAO</p>
      <div className="flex gap-10">
        <MotionButton
          label="Entrar como condômino"
          Icon={FaBuildingUser}
          func={login}
          className="w-xs"
        />
        <MotionButton
          label="Cadastrar condomínio"
          Icon={BsBuildingFillGear}
          func={login}
          className="w-xs"
        />
      </div>
    </div>
  );
}
