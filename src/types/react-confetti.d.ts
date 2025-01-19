declare module "react-confetti" {
  import { FC } from "react";

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    [key: string]: string | number | boolean | undefined;
  }

  const Confetti: FC<ConfettiProps>;
  export default Confetti;
}
