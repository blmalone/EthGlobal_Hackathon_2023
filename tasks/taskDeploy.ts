import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployContracts")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const nftGatedPaymasterFactory = await ethers.getContractFactory("NftGatedPaymaster");
    const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";
    const nftGatedPAymaster = await nftGatedPaymasterFactory.connect(signers[0]).deploy(entryPointContract);
    await nftGatedPAymaster.waitForDeployment();
    console.log("NftGatedPAymaster deployed to: ", await nftGatedPAymaster.getAddress());

    const addressCount = await nftGatedPAymaster.getAddressCount();
    console.log(addressCount);


    await nftGatedPAymaster.addNFTCollection("0xcafebabeb0fdcd49dca30c7cf57e578a026d2789");

    const addressCountTwo = await nftGatedPAymaster.getAddressCount();
    console.log(addressCountTwo);
  });
