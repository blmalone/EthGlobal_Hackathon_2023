import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(deployer);

  const greeter = await deploy("PaymasterNft", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`Greeter contract: `, greeter.address);

  const entryPointContract = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";

  const nftGatedPaymaster = await deploy("NftGatedPaymaster", {
    from: deployer,
    args: [entryPointContract],
    log: true,
  })

  console.log(`NftGatedPaymaster contract: `, nftGatedPaymaster.address);
};
export default func;
func.id = "deploy_greeter"; // id required to prevent reexecution
func.tags = ["Greeter"];
