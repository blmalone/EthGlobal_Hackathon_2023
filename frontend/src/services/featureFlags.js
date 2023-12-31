const getNftContractAddress = () => {
  const network = process.env.REACT_APP_NFT_NETWORK;
  if (network === "sepolia") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_SEPOLIA;
  } else if (network === "goerli") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_GOERLI;
  } else if (network === "polygon") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_POLYGON;
  } else if (network === "scroll") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_SCROLL;
  } else if (network === "linea") {
    return process.env.REACT_APP_NFT_CONTRACT_ADDRESS_LINEA
  }
}

export {
  getNftContractAddress
}