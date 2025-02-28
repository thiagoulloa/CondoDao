"use client";
import { FaBuildingUser } from "react-icons/fa6";
import { HiClipboardCopy } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaUserCog } from "react-icons/fa";

export const ResidentContainer = ({ ap, address, admin }: ResidentProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [copied]);
  return (
    <div
      onClick={copyToClipboard}
      title="Copiar address"
      className="w-full bg-[#4B4B4B] py-3 flex rounded-2xl px-6 gap-3 items-center cursor-pointer group"
    >
      <div className="flex">
        {!copied ? (
          <>
            {admin ? (
              <FaUserCog className="text-4xl text-[#AAAAAA] group-hover:w-0 " />
            ) : (
              <FaBuildingUser className="text-4xl text-[#AAAAAA] group-hover:w-0 " />
            )}
            <HiClipboardCopy className="text-4xl text-[#AAAAAA] w-0 group-hover:w-fit" />{" "}
          </>
        ) : (
          <FaCheck className="text-4xl text-[#AAAAAA]" />
        )}
      </div>
      <p className="text-xl font-bold whitespace-nowrap">Ap: {ap}</p>
      <p className="text-xl font-bold truncate">Address: {address}</p>
    </div>
  );
};
