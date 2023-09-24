import PaymasterNftAbi from "./artifacts/PaymasterNft.json";
import { Web3Button } from "@web3modal/react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function NftInteraction() {
  const defaultStyle = {
    margin: "5px",
    border: "5px solid white",
  };

  const selectedStyle = {
    margin: "5px",
    border: "5px solid red",
  };

  const { address, isConnected } = useAccount();
  const { error } = useConnect();
  const { disconnect } = useDisconnect();
  const [beganMintingProcess, setBeganMintingProcess] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(0);
  const images = [1, 2, 3, 4, 5];

  const { config } = usePrepareContractWrite({
    address: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
    abi: PaymasterNftAbi.abi,
    functionName: "awardItem",
    args: [address, `${selectedImageId}`],
  });

  const { data, write } = useContractWrite(config);

  const doMint = () => {
    if (selectedImageId === 0) {
      return alert("Must select an image");
    } else {
      write();
    }
  };

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (isConnected) {
    return (
      <div>
        <div>Connected to address: {address}</div>
        <div>
          {!beganMintingProcess && (
            <div>
              <button onClick={() => setBeganMintingProcess(true)}>Begin Minting Process</button>
            </div>
          )}
          {beganMintingProcess && (
            <div>
              {" "}
              Select Image:
              <div>
                {images.map((item) => {
                  return (
                    <img
                      onClick={() => setSelectedImageId(item)}
                      style={selectedImageId === item ? selectedStyle : defaultStyle}
                      alt="Nouns Dao"
                      id={`image_${item}`}
                      src={`./assets/${item}.svg`}
                    />
                  );
                })}
              </div>
              <button onClick={doMint} disabled={!write || isLoading}>
                {isLoading ? "Minting..." : "Mint"}
              </button>
            </div>
          )}
          {isSuccess && (
            <div>
              Successfully minted your NFT! If you spend from this address using our metamask extension, you will now
              have gas-less transactions. Thank you for your service to the community, and for using our permissionless
              public goods product!
              <div>Tx Hash: {data?.hash}</div>
            </div>
          )}
        </div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return <Web3Button />;
}

export default NftInteraction;
