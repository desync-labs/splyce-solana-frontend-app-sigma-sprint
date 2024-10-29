import Image from "next/image";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import TelegramSrc from "assets/svg/socials/telegram.svg";
import TwitterSrc from "assets/svg/socials/twitter.svg";
import LinkedInSrc from "assets/svg/socials/linkedln.svg";

const FooterWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  height: 60px;
  background: #1f2632;
  border-top: 1px solid #3a4f6a;
  padding: 0 40px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
  }
`;

const LinksWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;

  a {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    color: #7b96b5;
    opacity: 1;
    display: flex;
    justify-content: start;
    padding: 0;

    &:hover {
      opacity: 0.8;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    justify-content: center;
    gap: 18px 32px;
    padding: 16px 0;
  }
`;

const SocialLinksWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 0;

  & a {
    height: 20px;
  }

  & img {
    height: 20px;
    width: 20px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
    & a {
      height: 32px;
    }

    & img {
      height: 32px;
      width: 32px;
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper component="footer">
      <LinksWrapper>
        <a href={"https://splyce.finance"} rel="noreferrer" target={"_blank"}>
          splyce.fi
        </a>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          Docs
        </a>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          Privacy Policy
        </a>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          Terms of Service
        </a>
        <a href={"#"} target={"_blank"} rel="noreferrer">
          spUSD
        </a>
        <a href={"#"} target={"_blank"} rel="noreferrer">
          SPLY
        </a>
      </LinksWrapper>
      <SocialLinksWrapper>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          <Image
            src={TelegramSrc as string}
            width={20}
            height={20}
            alt={"telegram"}
          />
        </a>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          <Image
            src={TwitterSrc as string}
            width={20}
            height={20}
            alt={"twitter"}
          />
        </a>
        <a href={"#"} rel="noreferrer" target={"_blank"}>
          <Image
            src={LinkedInSrc as string}
            width={20}
            height={20}
            alt={"linked-in"}
          />
        </a>
      </SocialLinksWrapper>
    </FooterWrapper>
  );
};

export default Footer;
