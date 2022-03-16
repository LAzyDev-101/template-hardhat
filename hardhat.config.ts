import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: [`0x${process.env.OWNER_PRIVATE_KEY}`, `0x${process.env.ADDR1_PRIVATE_KEY}`],
      gas: "auto",
      gasPrice: "auto",
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsctestnet: {
      chainId: 97,
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts: [`0x${process.env.BSC_TESTNET_PRIVATE_KEY}`],
      gas: "auto",
      gasPrice: "auto",
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    showTimeSpent: true,
    currency: "USD",
  }
};

export default config;

