import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const config: any = {
  paymasterAddress: "0xB1DB1aA707731F7DCBb680072969b014cda9dA58",
  eipRenderAddress: "0xF6a719612562718FBC125175B40Ee9077EC9eE9f",
  nftContractAddress: "0x8492633f498daB898cFC40Ae00678b75041F6710",
  smartAccountAddress: "0x71F9Fdd643a334806E9e7aBfb2376c537193c816"
};

const shouldDeploy = process.env.DEPLOY_CONTRACTS || "false"

const getOrDeployContractAddress = async (shouldDeploy: string, contract: string, hre: HardhatRuntimeEnvironment, deployFunc: () => Promise<string>): Promise<string> => {
  if (shouldDeploy == "true") {
    console.log("Deploying contract: ", contract);
    const deployedAddress = await deployFunc();
    await wait(5, hre);
    console.log("Deployed address: ", deployedAddress);
    return deployedAddress;
  }
  else {
    console.log("Retrieving contract: ", contract);
    return config[contract]
  }
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`\n############################ `);
  console.log(`######### Gas Pass #########`);
  console.log(`############################ `);

  const signers = await hre.ethers.getSigners();
  const providerSigner = await hre.ethers.provider.getSigner();

  console.log(`Deployer Address: ${signers[0].address}`);
  console.log(`Starting balance: ${await hre.ethers.provider.getBalance(signers[0].address)}`);

  /**
   * Deploying Paymaster
   */
  const nftGatedPaymasterFactory = await hre.ethers.getContractFactory("NftGatedPaymaster");
  const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";

  const deployPaymasterContract = async () => {
    const deployedContract = await nftGatedPaymasterFactory.connect(signers[0]).deploy(entryPointContract);
    const address = deployedContract.getAddress();
    return address;
  };
  const paymasterAddress = await getOrDeployContractAddress(shouldDeploy, "paymasterAddress", hre, deployPaymasterContract);
  const paymasterAbi = nftGatedPaymasterFactory.interface.formatJson();
  const paymasterContract = new hre.ethers.Contract(paymasterAddress, paymasterAbi, providerSigner);
  console.log("paymasterAddress: ", paymasterAddress);

  /**
   * Deploying NFT contracts
   */
  const eipRenderFactory = await hre.ethers.getContractFactory("EIPRender");
  const eipRenderContract = async () => {
    const deployedContract = await eipRenderFactory.connect(signers[0]).deploy();
    return deployedContract.getAddress();
  };
  const eipRenderAddress = await getOrDeployContractAddress(shouldDeploy, "eipRenderAddress", hre, eipRenderContract);
  console.log(`eipRenderAddress: ${eipRenderAddress}`);

  const eipNftFactory = await hre.ethers.getContractFactory("EIPNFT", {
    libraries: {
      EIPRender: eipRenderAddress,
    },
  });
  const eipNftContract = async () => {
    const deployedContract = await eipNftFactory.connect(signers[0]).deploy(signers[0].address, 1000, paymasterAddress);;
    return deployedContract.getAddress();
  };
  const nftContractAddress = await getOrDeployContractAddress(shouldDeploy, "nftContractAddress", hre, eipNftContract);
  const nftContractAbi = eipNftFactory.interface.formatJson();
  const nftContract = new hre.ethers.Contract(nftContractAddress, nftContractAbi, providerSigner);

  await paymasterContract.addNFTCollection(nftContractAddress);
  console.log("nftContractAddress: ", nftContractAddress);
  const addressCountTwo = await paymasterContract.getAddressCount();
  console.log("Number of NFT collections registered to paymaster: ", addressCountTwo);

  const eipNumber = 1559;
  const allowedEipMints = 255;
  const nftOwner = signers[0];
  const dateCreated = "2020-09-15";
  const eipDescription = "NFT Royalty Standard";

  await nftContract.authenticatedMint(
    eipNumber,
    allowedEipMints,
    nftOwner,
    dateCreated,
    eipDescription
  );
  await wait(5, hre);
  const mintCount = await nftContract.getMintCount(eipNumber);

  const mintedOwnerBalance = await nftContract.balanceOf(signers[0].address);
  console.log("Deployer NFT balance: ", mintedOwnerBalance);


  /**
   * Deploying Smart Contract Account
   */
  const smartAccountContractFactory = await hre.ethers.getContractFactory("SmartAccount");
  const smartAccountContractDeploy = async () => {
    const deployedContract = await smartAccountContractFactory.connect(signers[0]).deploy(entryPointContract);;
    return deployedContract.getAddress();
  };
  const smartAccountAddress = await getOrDeployContractAddress(shouldDeploy, "smartAccountAddress", hre, smartAccountContractDeploy);
  const smartAccountContractAbi = smartAccountContractFactory.interface.formatJson();
  const smartAccountContract = new hre.ethers.Contract(smartAccountAddress, smartAccountContractAbi, providerSigner);

  const entrypointRes = await smartAccountContract.entryPoint();
  console.log("smartAccountAddress: ", smartAccountAddress, " with entrypoint: ", entrypointRes);


  /**
  * Send NFT from EOA to smart account
  */
  const tokenId = encodeTokenId(eipNumber, parseInt(mintCount, 10) - 1);
  await nftContract.transferFrom(signers[0].address, smartAccountAddress, tokenId);
  await wait(5, hre);


  const smartAccountBalance = await nftContract.balanceOf(smartAccountAddress);
  console.log("Smart Account balance: ", smartAccountBalance);
  console.log("Deployer NFT balance: ", await nftContract.balanceOf(signers[0].address));
  console.log(`Ending balance: ${await hre.ethers.provider.getBalance(signers[0].address)}`);


  /**
  * Send tiny amount of Eth to Smart account from EOA
  */

  await signers[0].sendTransaction({
    to: smartAccountAddress,
    value: hre.ethers.parseEther("0.00000000000000001")
  })
  await wait(5, hre);
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



