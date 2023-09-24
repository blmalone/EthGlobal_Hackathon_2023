import PaymasterNftAbi from "./frontend-contracts/PaymasterNft.json";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import * as featureFlags from './services/featureFlags';
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
    address: featureFlags.getNftContractAddress(),
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
          <br/>
          {!beganMintingProcess && (
            <div>
              <Button onClick={() => setBeganMintingProcess(true)} variant="contained" color="primary">Begin Minting Process</Button>
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
              <Button onClick={doMint} disabled={!write || isLoading} variant="contained" color="primary">
                {isLoading ? "Minting..." : "Mint"}
              </Button>
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
        <br/>
        <Button onClick={disconnect} variant="contained" color="primary">Disconnect</Button>
      </div>
    );
  }
}

export default NftInteraction;
