import { useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { useWeb3React } from "@src/hooks/useWeb3React";
import WalletModal from "../WalletModal";

const ButtonMarco = ({
  isShortText = false,
  ...rest
}) => {
  const [isMobileScreen] = useMediaQuery("(max-width: 480px)");

  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!account) {
    return (
      <>
        <button
          style={{
            backgroundColor: "var(--chakra-colors-bg-brand)",
            color: "var(--chakra-colors-bg-default)",
            borderRadius: "8px",
            padding: isMobileScreen ? "0.5rem 1rem" : "0.75rem 1.5rem",
            cursor: "pointer",
          }}
          onClick={onOpen} // triggers the modal
          {...rest}
        >
          {isMobileScreen || isShortText ? "Send" : "Send Ether"}
        </button>
      </>
    );
  }
  return <>Nothing</>; 
};

export default ButtonMarco;
