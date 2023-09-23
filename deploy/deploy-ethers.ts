import { ethers } from "hardhat";

async function main() {
  //const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = ethers.parseEther("0.001");

  const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";

  const lock = await ethers.deployContract("NftGatedPaymaster", [], {
    _entryPoint: entryPointContract
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});