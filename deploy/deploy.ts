import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const signers = await hre.ethers.getSigners();
  /**
   * Deploying Paymaster
   */
  const nftGatedPaymasterFactory = await hre.ethers.getContractFactory("NftGatedPaymaster");
  const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";
  const nftGatedPAymaster = await nftGatedPaymasterFactory.connect(signers[0]).deploy(entryPointContract);
  await nftGatedPAymaster.waitForDeployment();
  console.log("NftGatedPAymaster deployed to: ", await nftGatedPAymaster.getAddress());

  const addressCount = await nftGatedPAymaster.getAddressCount();
  console.log(addressCount);

  await nftGatedPAymaster.addNFTCollection("0xcafebabeb0fdcd49dca30c7cf57e578a026d2789");

  const addressCountTwo = await nftGatedPAymaster.getAddressCount();
  console.log(addressCountTwo);

  /**
   * Deploying NFT contracts
   */
  const eipRenderFactory = await hre.ethers.getContractFactory("EIPRender");
  const eipRender = await eipRenderFactory.connect(signers[0]).deploy();

  // //  console.log(`The address the Contract (EIPRender) WILL have once mined: ${eipRender.address}`);
  // //  console.log(`The transaction that was sent to the network to deploy the Contract: ${eipRender.deployTransaction.hash}`);
  // //  console.log("The contract is NOT deployed yet; we must wait until it is mined...");
  await eipRender.waitForDeployment();
  //  console.log("EIPRender Mined!");

  const eipRenderAddress = await eipRender.getAddress()
  const eipNftFactory = await hre.ethers.getContractFactory("EIPNFT", {
    libraries: {
      EIPRender: eipRenderAddress,
    },
  });
  const eipNFT = await eipNftFactory.connect(signers[0]).deploy(signers[0].address, 1000);
  const eipNFTAddress = await eipNFT.getAddress();
  console.log(eipNFTAddress);
};
export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = [""];
