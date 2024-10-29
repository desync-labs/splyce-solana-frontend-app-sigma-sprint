import { Dispatch, FC, memo } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { Menu } from "@/components/AppLayout/Menu";

export const MobileMenuWrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: fit-content;
  background: #3a4f6a;
  border-top: 1px solid #5a799d;
  padding: 12px 20px;
  z-index: 1000;
  & nav {
    display: flex;
    flex-direction: column;
    gap: 14px;

    > button {
      justify-content: flex-start;
      border-radius: 8px;
    }
  }
`;

type MobileMenuPropsType = {
  setOpenMobile: Dispatch<boolean>;
};

const MobileMenu: FC<MobileMenuPropsType> = memo(({ setOpenMobile }) => {
  return (
    <MobileMenuWrapper onClick={() => setOpenMobile(false)}>
      <Menu open={true} />
    </MobileMenuWrapper>
  );
});

export default MobileMenu;
