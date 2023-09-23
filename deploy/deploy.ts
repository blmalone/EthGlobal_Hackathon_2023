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
};
export default func;
func.id = "deploy_greeter"; // id required to prevent reexecution
func.tags = ["Greeter"];
