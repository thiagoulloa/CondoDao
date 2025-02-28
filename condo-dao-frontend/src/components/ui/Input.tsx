import { Dispatch, SetStateAction } from "react";

interface InputProps<T> {
  setContent: Dispatch<SetStateAction<any>>;
  value?: any;
  placeholder?: string;
}

export const Input = ({
  setContent,
  placeholder,
  value,
}: InputProps<string | number>) => {
  if (typeof value === "string") {
    return (
      <input
        className="w-full h-12 rounded-2xl bg-[#1E1E1E] text-white px-4 py-2"
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        value={value}
      ></input>
    );
  } else if (typeof value === "number") {
    return (
      <input
        className="w-full h-12 rounded-2xl bg-[#1E1E1E] text-white px-4 py-2"
        onChange={(e) => setContent(Number(e.target.value))}
        placeholder={placeholder}
        type="number"
        value={value}
      ></input>
    );
  }
};
