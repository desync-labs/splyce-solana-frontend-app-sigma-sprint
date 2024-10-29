import { useMemo } from "react";
import { useRouter } from "next/router";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "@/components/Base/Nav/NestedNav";

const LendingNestedNav = () => {
  const location = useRouter();

  const isOverviewActive = useMemo(
    () => ["/lending"].includes(location.pathname),
    [location.pathname]
  );

  const isTutorialActive = useMemo(() => {
    return location.pathname.includes("/lending/tutorial");
  }, [location.pathname]);
  return (
    <NestedRouteNav>
      <NestedRouteLink
        className={isOverviewActive ? "active" : ""}
        href="/lending"
      >
        Supply/Borrow
      </NestedRouteLink>
      <NestedRouteLink
        className={isTutorialActive ? "active" : ""}
        href="/lending/tutorial"
      >
        Tutorial
      </NestedRouteLink>
    </NestedRouteNav>
  );
};

export default LendingNestedNav;
