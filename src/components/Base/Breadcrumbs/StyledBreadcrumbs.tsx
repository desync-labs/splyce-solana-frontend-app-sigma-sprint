import Link from "next/link";
import { Breadcrumbs, styled, Typography } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import useVaultContext from "@/context/vaultDetail";
import { CustomSkeleton } from "@/components/Base/Skeletons/StyledSkeleton";

export const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-bottom: 36px;
  .close {
    float: right;
  }
  &.MuiBreadcrumbs-root {
    color: #a9bad0;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 0;
    margin-bottom: 20px;

    & .MuiBreadcrumbs-separator {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
`;

const VaultBreadcrumbsLink = styled(Link)`
  color: #a9bad0;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

export const VaultBreadcrumbsCurrentPage = styled(Typography)`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: default;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

export const VaultBreadcrumbs = () => {
  const { vault, vaultLoading } = useVaultContext();
  const breadcrumbs = [
    <VaultBreadcrumbsLink key="1" href={"/vaults"}>
      Vaults
    </VaultBreadcrumbsLink>,
    vaultLoading || !vault.id ? (
      <CustomSkeleton key="2" width="80px" />
    ) : (
      <VaultBreadcrumbsCurrentPage key="2">
        {vault?.name}
      </VaultBreadcrumbsCurrentPage>
    ),
  ];

  return (
    <BreadcrumbsWrapper
      separator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </BreadcrumbsWrapper>
  );
};
