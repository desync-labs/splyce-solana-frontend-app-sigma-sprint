import { useCallback, useEffect, useState, MouseEvent } from "react";
import useSharedContext from "@/context/shared";

const useMainLayout = () => {
  const { isMobile } = useSharedContext();

  const [openMobile, setOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      const inputs = document.querySelectorAll('input[type="number"]');
      for (let i = inputs.length; i--; ) {
        inputs[i].setAttribute("pattern", "\\d*");
      }
    }
  }, [isMobile]);

  const mainBlockClickHandler = useCallback(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, openMobile, setOpenMobile]);

  const openMobileMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenMobile(true);
    },
    [setOpenMobile]
  );

  return {
    openMobile,
    mainBlockClickHandler,
    openMobileMenu,
    setOpenMobile,
  };
};

export default useMainLayout;
