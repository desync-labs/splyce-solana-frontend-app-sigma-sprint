import { gql } from "@apollo/client";

/**
 * Vault queries
 */
export const VAULTS = gql`
  query Vaults(
    $first: Int!
    $skip: Int!
    $shutdown: Boolean
    $network: String
  ) {
    vaults(first: $first, skip: $skip, where: { shutdown: $shutdown }) {
      id
      token {
        id
        decimals
        name
        symbol
      }
      shareToken {
        id
        decimals
        name
        symbol
      }
      sharesSupply
      balanceTokens
      depositLimit
      totalShare
      apr
      shutdown
      performanceFees
      strategies(orderBy: activation, orderDirection: asc) {
        id
        delegatedAssets
        currentDebt
        maxDebt
        apr
      }
    }
  }
`;
export const VAULT = gql`
  query Vault($id: ID, $network: String) {
    vault(id: $id) {
      id
      token {
        id
        decimals
        name
        symbol
      }
      shareToken {
        id
        decimals
        name
        symbol
      }
      sharesSupply
      balanceTokens
      depositLimit
      totalShare
      apr
      shutdown
      performanceFees
      strategies(orderBy: activation, orderDirection: asc) {
        id
        delegatedAssets
        currentDebt
        maxDebt
        apr
        performanceFees
      }
    }
  }
`;

export const VAULT_POSITION = gql`
  query AccountVaultPositions(
    $account: String!
    $vault: String!
    $network: String
  ) {
    accountVaultPositions(
      where: { account_contains_nocase: $account, vault: $vault }
    ) {
      id
      balancePosition
      balanceProfit
      balanceShares
      balanceTokens
      vault {
        id
      }
      token {
        id
        symbol
        name
      }
      shareToken {
        id
        symbol
        name
      }
    }
  }
`;

export const VAULT_STRATEGY_REPORTS = gql`
  query VaultStrategyReports(
    $strategy: String!
    $reportsFirst: Int
    $reportsSkip: Int
    $network: String
  ) {
    strategyHistoricalAprs(
      first: $reportsFirst
      skip: $reportsSkip
      where: { strategy: $strategy }
    ) {
      id
      apr
      timestamp
    }
    strategyReports(
      orderBy: timestamp
      orderDirection: desc
      first: $reportsFirst
      skip: $reportsSkip
      where: { strategy: $strategy }
    ) {
      id
      timestamp
      gain
      loss
      currentDebt
    }
  }
`;

export const ACCOUNT_VAULT_POSITIONS = gql`
  query AccountVaultPositions(
    $account: String!
    $network: String
    $first: Int!
  ) {
    accountVaultPositions(
      where: { account_contains_nocase: $account }
      first: $first
    ) {
      id
      balancePosition
      balanceProfit
      balanceShares
      balanceTokens
      vault {
        id
      }
      token {
        id
        decimals
        symbol
        name
      }
      shareToken {
        id
        decimals
        symbol
        name
      }
    }
  }
`;

export const VAULT_POSITION_TRANSACTIONS = gql`
  query VaultPositionTransactions(
    $account: String!
    $vault: String!
    $network: String
    $first: Int
  ) {
    deposits(
      where: {
        account_contains_nocase: $account
        vault_contains_nocase: $vault
      }
      first: $first
      orderBy: blockNumber
    ) {
      id
      timestamp
      sharesMinted
      tokenAmount
      blockNumber
    }
    withdrawals(
      where: {
        account_contains_nocase: $account
        vault_contains_nocase: $vault
      }
      first: $first
      orderBy: blockNumber
    ) {
      id
      timestamp
      sharesBurnt
      tokenAmount
      blockNumber
    }
  }
`;

export const VAULTS_ACCOUNT_DEPOSITS = gql`
  query VaultAccountDeposits(
    $account: String!
    $network: String
    $first: Int
    $skip: Int
  ) {
    deposits(
      where: { account_contains_nocase: $account }
      orderBy: blockNumber
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      sharesMinted
      tokenAmount
      blockNumber
    }
  }
`;

export const VAULTS_ACCOUNT_WITHDRAWALS = gql`
  query VaultAccountWithdrawals(
    $account: String!
    $network: String
    $first: Int
    $skip: Int
  ) {
    withdrawals(
      where: { account_contains_nocase: $account }
      orderBy: blockNumber
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      sharesBurnt
      tokenAmount
      blockNumber
    }
  }
`;
