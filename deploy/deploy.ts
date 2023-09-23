import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { waitForDebugger } from "inspector";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`\n############################ `);
  console.log(`######### Gas Pass #########`);
  console.log(`############################ `);

  const signers = await hre.ethers.getSigners();
  console.log(`Deployer Address: ${signers[0].address}`);
  console.log(`Starting balance: ${await hre.ethers.provider.getBalance(signers[0].address)}`);
  /**
   * Deploying Paymaster
   */
  const nftGatedPaymasterFactory = await hre.ethers.getContractFactory("NftGatedPaymaster");
  const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";
  const nftGatedPaymaster = await nftGatedPaymasterFactory.connect(signers[0]).deploy(entryPointContract);
  console.log("NftGatedPaymaster deployed to: ", await nftGatedPaymaster.getAddress());

  await wait(5, hre);

  const addressCount = await nftGatedPaymaster.getAddressCount();
  console.log("Number of NFT collections registered to paymaster: ", addressCount);

  /**
   * Deploying NFT contracts
   */
  const eipRenderFactory = await hre.ethers.getContractFactory("EIPRender");
  const eipRender = await eipRenderFactory.connect(signers[0]).deploy();
  await wait(5, hre);

  const eipRenderAddress = await eipRender.getAddress();
  console.log(`NFT Render contract deployed: ${eipRenderAddress}`);
  // const eipNftFactory = await hre.ethers.getContractFactory("EIPNFT", {
  //   libraries: {
  //     EIPRender: eipRenderAddress,
  //   },
  // });
  // const paymasterAddress = await nftGatedPaymaster.getAddress();
  // const eipNFT = await eipNftFactory.connect(signers[0]).deploy(signers[0].address, 1000, paymasterAddress);
  // const eipNFTAddress = await eipNFT.getAddress();
  // await nftGatedPaymaster.addNFTCollection(eipNFTAddress);
  // console.log("NFT address: ", eipNFTAddress);
  // const addressCountTwo = await nftGatedPaymaster.getAddressCount();
  // console.log("Number of NFT collections registered to paymaster: ", addressCountTwo);

  // const eipNumber = 1559;
  // const allowedEipMints = 2;
  // const nftOwner = signers[0];
  // const dateCreated = "2020-09-15";
  // const eipDescription = "NFT Royalty Standard";

  // const mintRes = await eipNFT.authenticatedMint(
  //   eipNumber,
  //   allowedEipMints,
  //   nftOwner,
  //   dateCreated,
  //   eipDescription
  // );

  // const mintedOwnerBalance = await eipNFT.balanceOf(signers[0].address);
  // console.log("EOA balance: ", mintedOwnerBalance);


  // /**
  //  * Deploying Smart Contract Account
  //  */
  // const smartAccountContractFactory = await hre.ethers.getContractFactory("SmartAccount");
  // const smartAccount = await smartAccountContractFactory.connect(signers[0]).deploy(entryPointContract);
  // const smartAccountAddress = await smartAccount.getAddress();
  // const entrypointRes = await smartAccount.entryPoint();

  // console.log("Smart Account deployed to: ", smartAccountAddress, " with entrypoint: ", entrypointRes);


  // /**
  // * Send NFT from EOA to smart account
  // */

  // const tokenId = encodeTokenId(eipNumber, 1);
  // await eipNFT.transferFrom(signers[0].address, smartAccountAddress, tokenId);


  // const smartAccountBalance = await eipNFT.balanceOf(smartAccountAddress);
  // console.log("Smart Account balance: ", smartAccountBalance);
  // console.log(`Starting balance: ${await hre.ethers.provider.getBalance(signers[0].address)}`);

};

const wait = async (blocks: number, hre: HardhatRuntimeEnvironment) => {
  let currentBlock = await hre.ethers.provider.getBlockNumber();
  while (currentBlock + blocks > (await hre.ethers.provider.getBlockNumber())) {
    sleep(1000);
  }
}

const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const encodeTokenId = (eipNumber: number, tokenNumber: number) => {
  const topLevelMultiplier = 100000000000;
  const midLevelMultiplier = 100000;
  return topLevelMultiplier + eipNumber * midLevelMultiplier + tokenNumber;
};

export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = [""];



