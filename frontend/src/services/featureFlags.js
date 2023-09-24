const getNftContractAddress = () => {
  const network = process.env.REACT_APP_NFT_NETWORK;
  if (network === "sepolia") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_SEPOLIA;
  } else if (network === "goerli") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_GOERLI;
  }
}

export {
  getNftContractAddress
}