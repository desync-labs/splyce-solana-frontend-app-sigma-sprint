import { FC, memo, useMemo } from "react";
import { useRouter } from "next/router";
import { Button, styled } from "@mui/material";

const MenuWrapper = styled("nav")`
  display: flex;
  justify-content: flex-start;
  gap: 0;
`;

const MenuItem = styled(Button)`
  height: 40px;
  color: #d1dae6;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  border-radius: 50px;
  padding: 8px 24px;

  &:hover {
    background: transparent;
    color: #fff;
  }

  &.active {
    color: #fff;
    background: #314156;
  }
`;

export const Menu: FC = memo(() => {
  const location = useRouter();

  const isLendingActive = useMemo(
    () => location.pathname.includes("lending"),
    [location.pathname]
  );
  const isVaultsActive = useMemo(
    () => location.pathname.includes("vaults"),
    [location.pathname]
  );
  const isDaoActive = useMemo(
    () => location.pathname.includes("dao"),
    [location.pathname]
  );

  const appMenuItems = [
    {
      name: "Lending",
      link: "/lending",
      isActive: isLendingActive,
    },
    {
      name: "Vaults",
      link: "/vaults",
      isActive: isVaultsActive,
    },
    {
      name: "DAO",
      link: "/dao",
      isActive: isDaoActive,
    },
  ];

  const handleClickMenuItem = (link: string) => {
    location.push(link);
  };

  return (
    <MenuWrapper>
      {appMenuItems.map((item) => (
        <MenuItem
          key={item.name}
          onClick={() => handleClickMenuItem(item.link)}
          className={item.isActive ? "active" : ""}
        >
          {item.name}
        </MenuItem>
      ))}
    </MenuWrapper>
  );
});
