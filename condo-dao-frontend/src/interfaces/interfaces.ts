interface Suggestion {
  title: string;
  agree: string;
  disagree: string;
  description: string;
}

interface IconButtonProps<T> {
  func: (param: T) => T;
  className?: string;
  Icon: React.ComponentType<{ className: string }>;
}

interface ResidentProps {
  ap: string;
  address: string;
  admin?: boolean;
}
