interface TextAreaProps<T> {
  setContent: (param: string) => T;
  value?: string;
  className?: string;
  placeholder?: string;
}

export const TextArea = ({
  setContent,
  placeholder,
  className,
  value,
}: TextAreaProps<void>) => {
  return (
    <textarea
      value={value}
      onChange={(e) => setContent(e.target.value)}
      placeholder={placeholder}
      className={`input input-bordered w-full h-30 rounded-2xl bg-[#1E1E1E] text-white px-4 py-2 resize-none ${className}`}
    />
  );
};
