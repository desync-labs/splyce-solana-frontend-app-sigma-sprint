import SPLYlogo from "@/assets/tokens/sply.png";
import USDClogo from "@/assets/tokens/usdc.png";
import { USDC_MINT_ADDRESSES } from "@/utils/addresses";

export const getTokenLogoURL = (address: string) => {
  if (USDC_MINT_ADDRESSES.includes(address.toLowerCase())) {
    return USDClogo as unknown as string;
  }
  return SPLYlogo as unknown as string;
};
