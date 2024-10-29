import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { styled } from "@mui/system";

import useVH from "@/hooks/General/useVH";
import useMainLayout from "@/hooks/General/useMainLayout";
import useSharedContext from "@/context/shared";

import { MainBox } from "@/components/Base/Boxes/StyledBoxes";
import SolWallet from "@/components/SolWallet";
import { Menu } from "@/components/AppLayout/Menu";
import Footer from "@/components/AppLayout/Footer";

import SplyceAppLogoSrc from "@/assets/png/splyce-logo.png";
import SplyceAppLogoMobileSrc from "@/assets/png/splyce-logo-mobile.png";
import MobileMenuIcon from "@/assets/svg/mobile-menu.svg";
import MobileMenuIconActive from "@/assets/svg/mobile-menu-active.svg";
import MobileMenu from "@/components/AppLayout/MobileMenu";

const LogoLink = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MobileMenuWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 7px;
  font-size: 1rem;
`;

const AppNavLayout = ({ children }: { children: ReactNode }) => {
  const { openMobile, mainBlockClickHandler, openMobileMenu, setOpenMobile } =
    useMainLayout();
  const { isMobile } = useSharedContext();
  useVH();

  return (
    <Box onClick={mainBlockClickHandler}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <>
              <LogoLink href={"/"}>
                <Image
                  src={SplyceAppLogoMobileSrc as string}
                  alt={"splyce-logo"}
                  width={36}
                  height={36}
                />
              </LogoLink>
              <MobileMenuWrapper
                onClick={openMobile ? mainBlockClickHandler : openMobileMenu}
              >
                <Image
                  style={{ display: openMobile ? "none" : "block" }}
                  src={MobileMenuIcon as string}
                  alt={"menu"}
                  width={20}
                  height={20}
                />
                <Image
                  style={{ display: openMobile ? "block" : "none" }}
                  src={MobileMenuIconActive as string}
                  alt={"menu"}
                  width={20}
                  height={20}
                />
                Apps
              </MobileMenuWrapper>
            </>
          ) : (
            <>
              <LogoLink href={"/"}>
                <Image
                  src={SplyceAppLogoSrc as string}
                  alt={"splyce-logo"}
                  width={132}
                  height={20}
                />
              </LogoLink>
              <Menu />
            </>
          )}

          <SolWallet />
        </Toolbar>
      </AppBar>
      <MainBox component="main">{children}</MainBox>
      <Footer />
      {isMobile && openMobile && <MobileMenu setOpenMobile={setOpenMobile} />}
    </Box>
  );
};

export default AppNavLayout;
