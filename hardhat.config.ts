import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";

import "./tasks/accounts";
import "./tasks/greet";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  "base-goerli-testnet": 84531,
  bsc: 56,
  ganache: 1337,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "optimism-goerli": 420,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  "polygon-zkevm-testnet": 1442,
  "ethereum-sepolia": 11155111,
  "scroll-sepolia": 534351,
  "mantle": 5001
};

// Look on https://chainlist.org/
function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    case "optimism-goerli":
      jsonRpcUrl = "https://opt-goerli.g.alchemy.com/v2/rCoAKlzApgyPIg0i7JTnex7z3VEi7tMp"
      // "https://goerli.optimism.io";
      break;
    case "polygon-mumbai":
      jsonRpcUrl = "https://polygon-mumbai.infura.io/v3/362a5fc5fdc94650b430aba7e7ce1ef3";
      break;
    case "polygon-zkevm-testnet":
      jsonRpcUrl = "https://rpc.public.zkevm-test.net";
      break;
    case "base-goerli-testnet":
      jsonRpcUrl = "https://base-goerli.public.blastapi.io"; // https://chainlist.org/chain/84531
      break;
    case "ethereum-sepolia":
      jsonRpcUrl = "https://sepolia.infura.io/v3/362a5fc5fdc94650b430aba7e7ce1ef3";
      break;
    case "scroll-sepolia":
      jsonRpcUrl = "https://sepolia-rpc.scroll.io/";
      break;
    case "mantle":
      jsonRpcUrl = "https://rpc.testnet.mantle.xyz/";
      break;
    case "linea":
      jsonRpcUrl = "https://linea-goerli.infura.io/v3/362a5fc5fdc94650b430aba7e7ce1ef3";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }
  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    ganache: {
      accounts: {
        mnemonic: "marble alien armed gate borrow tissue observe return cloth awesome post napkin",
      },
      chainId: chainIds.ganache,
      url: "http://localhost:7545",
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "optimism-goerli": getChainConfig("optimism-goerli"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
    goerli: {
      accounts: ["d27509812d5cba7dc77a7faba290ae814b37fdc82f0e70a566615e9acc90c1a8"],
      chainId: chainIds["base-goerli-testnet"],
      url: "https://base-goerli.public.blastapi.io",
    },
    sepolia: getChainConfig("ethereum-sepolia"),
    scroll: getChainConfig("scroll-sepolia"),
    mantle: getChainConfig("mantle"),
    linea: getChainConfig("linea")
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.12",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: false,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
