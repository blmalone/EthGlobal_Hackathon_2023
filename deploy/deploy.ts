import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const config: any = {
<<<<<<< HEAD
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
    eipDescription,
    1
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

=======
  paymasterAddress: '0xd06B9c0A22556398c0486c18849477C1F522F1D2',
  eipRenderAddress: '0xDBC9CAd4C5202FA2E535f354583588bb972f6c22',
  nftContractAddress: '0x13Fa5B158eE69e760138d844be214F7d67001374',
  smartAccountAddress: '0xc8b3F6d084ccFF208380000336A13E20Eb7Afda5'
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
  const entryPointContractAddress = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";

  const deployPaymasterContract = async () => {
    const deployedContract = await nftGatedPaymasterFactory.connect(signers[0]).deploy(entryPointContractAddress);
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
    const deployedContract = await eipNftFactory.connect(signers[0]).deploy(signers[0].address, 1000, paymasterAddress);
    return deployedContract.getAddress();
  };
  const nftContractAddress = await getOrDeployContractAddress(shouldDeploy, "nftContractAddress", hre, eipNftContract);
  const nftContractAbi = eipNftFactory.interface.formatJson();
  const nftContract = new hre.ethers.Contract(nftContractAddress, nftContractAbi, providerSigner);

  await paymasterContract.addNFTCollection(nftContractAddress);
  await wait(5, hre);
  console.log("nftContractAddress: ", nftContractAddress);
  const addressCountTwo = await paymasterContract.getAddressCount();
  console.log("Number of NFT collections registered to paymaster: ", parseInt(addressCountTwo, 10));

  const nftOwner = signers[0];
  await nftContract.authenticatedMint(nftOwner, 1);
  await wait(5, hre);

  const mintedOwnerBalance = await nftContract.balanceOf(signers[0].address);
  console.log("Deployer NFT balance: ", parseInt(mintedOwnerBalance, 10));


  /**
   * Deploying Smart Contract Account
   */
  const smartAccountContractFactory = await hre.ethers.getContractFactory("SmartAccount");
  const smartAccountContractDeploy = async () => {
    const deployedContract = await smartAccountContractFactory.connect(signers[0]).deploy(entryPointContractAddress);;
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
  const tokenId = await nftContract.getCurrentTokenId();
  await nftContract.transferFrom(signers[0].address, smartAccountAddress, parseInt(tokenId, 10));
  await wait(5, hre);

  const smartAccountBalance = await nftContract.balanceOf(smartAccountAddress);
  console.log("Smart Account balance: ", smartAccountBalance);
  console.log("Deployer NFT balance: ", await nftContract.balanceOf(signers[0].address));
  console.log(`Ending balance: ${await hre.ethers.provider.getBalance(signers[0].address)}`);

  console.log({
    paymasterAddress: paymasterAddress,
    eipRenderAddress: eipRenderAddress,
    nftContractAddress: nftContractAddress,
    smartAccountAddress: smartAccountAddress
  });

  /**
  * Stake Ethers with Entrypoint for Paymaster
  */

  const entryPointContractFactory = await hre.ethers.getContractFactory("EntryPoint");
  // const entryPointContractAbi = entryPointContractFactory.interface.formatJson();
  const entryPointContract = new hre.ethers.Contract(entryPointContractAddress, ENTRYPOINT_ABI, providerSigner);
  const stakeInfoPaymaster = await entryPointContract.getDepositInfo(paymasterAddress);
  const isStaked = stakeInfoPaymaster[1];
  const stakeAmount = stakeInfoPaymaster[2];
  console.log(`Paymasters Stake in Entrypoint: ${stakeAmount}`);
  if (!isStaked || parseInt(stakeAmount, 10) <= 0) {
    await paymasterContract.addStake(1, { value: hre.ethers.parseEther("0.00000000000000001") });
    await wait(5, hre);
  } else {
    console.log(`Already staked for paymaster: ${paymasterAddress}`);
  }

  /**
  * Send Ether to paymaster
  * 1. To pay for gas for NFT holders
  */
  const depositInfoPaymaster = await entryPointContract.getDepositInfo(paymasterAddress);
  const depositAmountForPaymaster = parseInt(depositInfoPaymaster[0], 10);
  if (depositAmountForPaymaster <= 0) {
    await paymasterContract.deposit({ value: hre.ethers.parseEther("0.00000000000000001") });
    await wait(5, hre);
  } else {
    console.log(`Already deposited for paymaster: ${paymasterAddress}`);
  }
  console.log(`Paymasters Deposit in Entrypoint: ${depositAmountForPaymaster}`);

  /**
  * Send tiny amount of Eth to Smart account from EOA
  * 1. Going to be for the gasless transaction.
  */
  await signers[0].sendTransaction({
    to: smartAccountAddress,
    value: hre.ethers.parseEther("0.00000000000000001")
  })
  await wait(5, hre);
};

>>>>>>> 0632678707b9768d75f2b7ec4d910bd767d903ce
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

<<<<<<< HEAD
=======
const ENTRYPOINT_ABI = [
  { "inputs": [{ "internalType": "uint256", "name": "preOpGas", "type": "uint256" }, { "internalType": "uint256", "name": "paid", "type": "uint256" }, { "internalType": "uint48", "name": "validAfter", "type": "uint48" }, { "internalType": "uint48", "name": "validUntil", "type": "uint48" }, { "internalType": "bool", "name": "targetSuccess", "type": "bool" }, { "internalType": "bytes", "name": "targetResult", "type": "bytes" }], "name": "ExecutionResult", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "opIndex", "type": "uint256" }, { "internalType": "string", "name": "reason", "type": "string" }], "name": "FailedOp", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "SenderAddressResult", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "aggregator", "type": "address" }], "name": "SignatureValidationFailed", "type": "error" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "preOpGas", "type": "uint256" }, { "internalType": "uint256", "name": "prefund", "type": "uint256" }, { "internalType": "bool", "name": "sigFailed", "type": "bool" }, { "internalType": "uint48", "name": "validAfter", "type": "uint48" }, { "internalType": "uint48", "name": "validUntil", "type": "uint48" }, { "internalType": "bytes", "name": "paymasterContext", "type": "bytes" }], "internalType": "struct IEntryPoint.ReturnInfo", "name": "returnInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "senderInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "factoryInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "paymasterInfo", "type": "tuple" }], "name": "ValidationResult", "type": "error" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "preOpGas", "type": "uint256" }, { "internalType": "uint256", "name": "prefund", "type": "uint256" }, { "internalType": "bool", "name": "sigFailed", "type": "bool" }, { "internalType": "uint48", "name": "validAfter", "type": "uint48" }, { "internalType": "uint48", "name": "validUntil", "type": "uint48" }, { "internalType": "bytes", "name": "paymasterContext", "type": "bytes" }], "internalType": "struct IEntryPoint.ReturnInfo", "name": "returnInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "senderInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "factoryInfo", "type": "tuple" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "paymasterInfo", "type": "tuple" }, { "components": [{ "internalType": "address", "name": "aggregator", "type": "address" }, { "components": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "internalType": "struct IStakeManager.StakeInfo", "name": "stakeInfo", "type": "tuple" }], "internalType": "struct IEntryPoint.AggregatorStakeInfo", "name": "aggregatorInfo", "type": "tuple" }], "name": "ValidationResultWithAggregation", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "userOpHash", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "address", "name": "factory", "type": "address" }, { "indexed": false, "internalType": "address", "name": "paymaster", "type": "address" }], "name": "AccountDeployed", "type": "event" }, { "anonymous": false, "inputs": [], "name": "BeforeExecution", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "totalDeposit", "type": "uint256" }], "name": "Deposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "aggregator", "type": "address" }], "name": "SignatureAggregatorChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "totalStaked", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "unstakeDelaySec", "type": "uint256" }], "name": "StakeLocked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "withdrawTime", "type": "uint256" }], "name": "StakeUnlocked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "address", "name": "withdrawAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "StakeWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "userOpHash", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "address", "name": "paymaster", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "success", "type": "bool" }, { "indexed": false, "internalType": "uint256", "name": "actualGasCost", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "actualGasUsed", "type": "uint256" }], "name": "UserOperationEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "userOpHash", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "revertReason", "type": "bytes" }], "name": "UserOperationRevertReason", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "address", "name": "withdrawAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawn", "type": "event" }, { "inputs": [], "name": "SIG_VALIDATION_FAILED", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }], "name": "_validateSenderAndPaymaster", "outputs": [], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "unstakeDelaySec", "type": "uint32" }], "name": "addStake", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "depositTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint112", "name": "deposit", "type": "uint112" }, { "internalType": "bool", "name": "staked", "type": "bool" }, { "internalType": "uint112", "name": "stake", "type": "uint112" }, { "internalType": "uint32", "name": "unstakeDelaySec", "type": "uint32" }, { "internalType": "uint48", "name": "withdrawTime", "type": "uint48" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getDepositInfo", "outputs": [{ "components": [{ "internalType": "uint112", "name": "deposit", "type": "uint112" }, { "internalType": "bool", "name": "staked", "type": "bool" }, { "internalType": "uint112", "name": "stake", "type": "uint112" }, { "internalType": "uint32", "name": "unstakeDelaySec", "type": "uint32" }, { "internalType": "uint48", "name": "withdrawTime", "type": "uint48" }], "internalType": "struct IStakeManager.DepositInfo", "name": "info", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint192", "name": "key", "type": "uint192" }], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "nonce", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "initCode", "type": "bytes" }], "name": "getSenderAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation", "name": "userOp", "type": "tuple" }], "name": "getUserOpHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation[]", "name": "userOps", "type": "tuple[]" }, { "internalType": "contract IAggregator", "name": "aggregator", "type": "address" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct IEntryPoint.UserOpsPerAggregator[]", "name": "opsPerAggregator", "type": "tuple[]" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }], "name": "handleAggregatedOps", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation[]", "name": "ops", "type": "tuple[]" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }], "name": "handleOps", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint192", "name": "key", "type": "uint192" }], "name": "incrementNonce", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "callData", "type": "bytes" }, { "components": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "address", "name": "paymaster", "type": "address" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }], "internalType": "struct EntryPoint.MemoryUserOp", "name": "mUserOp", "type": "tuple" }, { "internalType": "bytes32", "name": "userOpHash", "type": "bytes32" }, { "internalType": "uint256", "name": "prefund", "type": "uint256" }, { "internalType": "uint256", "name": "contextOffset", "type": "uint256" }, { "internalType": "uint256", "name": "preOpGas", "type": "uint256" }], "internalType": "struct EntryPoint.UserOpInfo", "name": "opInfo", "type": "tuple" }, { "internalType": "bytes", "name": "context", "type": "bytes" }], "name": "innerHandleOp", "outputs": [{ "internalType": "uint256", "name": "actualGasCost", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint192", "name": "", "type": "uint192" }], "name": "nonceSequenceNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation", "name": "op", "type": "tuple" }, { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "targetCallData", "type": "bytes" }], "name": "simulateHandleOp", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation", "name": "userOp", "type": "tuple" }], "name": "simulateValidation", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unlockStake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "withdrawAddress", "type": "address" }], "name": "withdrawStake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "withdrawAddress", "type": "address" }, { "internalType": "uint256", "name": "withdrawAmount", "type": "uint256" }], "name": "withdrawTo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];

>>>>>>> 0632678707b9768d75f2b7ec4d910bd767d903ce
export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = [""];



