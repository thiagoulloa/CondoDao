"use client";

import { motion } from "motion/react";
import React from "react";

interface MotionButtonProps<T> {
  label: string;
  className?: string;
  Icon?: React.ComponentType<{ className: string }> | string;
  func: () => void;
}

export const MotionButton = ({
  label,

  className,
  func,
  Icon,
}: MotionButtonProps<void>) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      className={`py-4 rounded-3xl bg-[#313131] items-center justify-center flex gap-2 text-xl font-bold cursor-pointer ${className}`}
      onClick={() => func()}
    >
      {Icon ? (
        <div className="flex items-center justify-center gap-2">
          <p className="truncate">{label}</p>
          <Icon className="text-2xl" />
        </div>
      ) : (
        <p className="truncate">{label}</p>
      )}
    </motion.div>
  );
};
