import { styled } from "@mui/material/styles";
import { Dialog } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

const FullScreenDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== "offset",
})<{ offset?: number }>`
  top: ${({ offset = 65 }) => `${offset}px`};
  height: ${({ offset = 65 }) => `calc(100% - ${offset}px)`};
  z-index: 100;

  & .MuiDialog-paper {
    margin: 0;
    width: 100%;
    border-radius: 0;
  }
  & .MuiBackdrop-root {
    top: ${({ offset = 65 }) => `${offset}px`};
  },
`;

const ModalContentContainer = styled("div")`
  display: block;
  width: 100%;
  height: 100%;
  background: #1f2632;
  padding: 24px 16px;
`;

interface BaseDialogFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  tabVisible?: boolean;
}

const BaseDialogFullScreen: FC<BaseDialogFullScreenProps> = ({
  isOpen,
  onClose,
  children,
  tabVisible = true,
}) => {
  const [modalOffset, setModalOffset] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      let scroll =
        65 -
        (tabVisible ? 0 : 60) -
        (document.documentElement.scrollTop || document.body.scrollTop);
      scroll = scroll < 0 ? 0 : scroll;
      setModalOffset(scroll);
    }
  }, [isOpen, setModalOffset, tabVisible]);

  return (
    <FullScreenDialog
      offset={modalOffset}
      fullScreen={true}
      open={isOpen}
      onClose={onClose}
    >
      <ModalContentContainer>{children}</ModalContentContainer>
    </FullScreenDialog>
  );
};

export default BaseDialogFullScreen;
