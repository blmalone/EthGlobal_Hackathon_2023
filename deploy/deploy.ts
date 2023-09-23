import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  // EOA signer
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

  await nftGatedPAymaster.addNFTCollection("0xcafebabeb0fdcd49dca30c7cf57e578a026d2789");

  const addressCountTwo = await nftGatedPAymaster.getAddressCount();
  console.log("Number of NFT collections registered to paymaster: ", addressCountTwo);

  /**
   * Deploying NFT contracts
   */
  const eipRenderFactory = await hre.ethers.getContractFactory("EIPRender");
  const eipRender = await eipRenderFactory.connect(signers[0]).deploy();

  await eipRender.waitForDeployment();

  const eipRenderAddress = await eipRender.getAddress()
  const eipNftFactory = await hre.ethers.getContractFactory("EIPNFT", {
    libraries: {
      EIPRender: eipRenderAddress,
    },
  });
  const paymasterAddress = await nftGatedPAymaster.getAddress();
  const eipNFT = await eipNftFactory.connect(signers[0]).deploy(signers[0].address, 1000, paymasterAddress);
  const eipNFTAddress = await eipNFT.getAddress();
  console.log("NFT address: ", eipNFTAddress);

  const eipNumber = 1559;
  const allowedEipMints = 2;
  const nftOwner = signers[0];
  const dateCreated = "2020-09-15";
  const eipDescription = "NFT Royalty Standard";

  const mintRes = await eipNFT.authenticatedMint(
    eipNumber,
    allowedEipMints,
    nftOwner,
    dateCreated,
    eipDescription
  );

  const mintedOwnerBalance = await eipNFT.balanceOf(signers[0].address);
  console.log("EOA balance: ", mintedOwnerBalance);


  /**
   * Deploying Smart Contract Account
   */
  const smartAccountContractFactory = await hre.ethers.getContractFactory("SmartAccount");
  const smartAccount = await smartAccountContractFactory.connect(signers[0]).deploy(entryPointContract);
  const smartAccountAddress = await smartAccount.getAddress();
  const entrypointRes = await smartAccount.entryPoint();

  console.log("Smart Account deployed to: ", smartAccountAddress, " with entrypoint: ", entrypointRes);


  /**
  * Send NFT from EOA to smart account
  */

  const tokenId = encodeTokenId(eipNumber, 1);
  await eipNFT.transferFrom(signers[0].address, smartAccountAddress, tokenId);


  const smartAccountBalance = await eipNFT.balanceOf(smartAccountAddress);
  console.log("Smart Account balance: ", smartAccountBalance);

};


const encodeTokenId = (eipNumber: number, tokenNumber: number) => {
  const topLevelMultiplier = 100000000000;
  const midLevelMultiplier = 100000;
  return topLevelMultiplier + eipNumber * midLevelMultiplier + tokenNumber;
};

export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = [""];
