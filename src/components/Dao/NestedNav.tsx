import { useMemo } from "react";
import { useRouter } from "next/router";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "@/components/Base/Nav/NestedNav";

const DaoNestedNav = () => {
  const location = useRouter();

  const isStakingActive = useMemo(
    () => ["/dao"].includes(location.pathname),
    [location.pathname]
  );

  const isGovernanceActive = useMemo(
    () => ["/dao/governance"].includes(location.pathname),
    [location.pathname]
  );

  const isTutorialActive = useMemo(() => {
    return location.pathname.includes("/dao/tutorial");
  }, [location.pathname]);
  return (
    <NestedRouteNav>
      <NestedRouteLink className={isStakingActive ? "active" : ""} href="/dao">
        Staking
      </NestedRouteLink>
      <NestedRouteLink
        className={isGovernanceActive ? "active" : ""}
        href="/dao/governance"
      >
        Governance
      </NestedRouteLink>
      <NestedRouteLink
        className={isTutorialActive ? "active" : ""}
        href="/dao/tutorial"
      >
        Tutorial
      </NestedRouteLink>
    </NestedRouteNav>
  );
};

export default DaoNestedNav;
