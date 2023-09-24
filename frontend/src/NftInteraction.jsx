import EIPNFT from "./frontend-contracts/EIPNFT.json";
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
    width: "350px",
    height: "350px",
    flex: "0 0 calc(33.33% - 20px)"
  };

  const selectedStyle = {
    margin: "5px",
    border: "5px solid red",
    width: "350px",
    height: "350px",
    flex: "0 0 calc(33.33% - 20px)"
  };

  const { address, isConnected } = useAccount();
  const { error } = useConnect();
  const { disconnect } = useDisconnect();
  const [beganMintingProcess, setBeganMintingProcess] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(0);
  const images = [
    {
      url: 'https://ipfs.io/ipfs/QmQ6VgRFiVTdKbiebxGvhW3Wa3Lkhpe6SkWBPjGnPkTttS/7913.png',
      id: 1,
      eip: "EIP-2"
    },
    {
      url: '/assets/2.svg',
      id: 2,
      eip: "EIP-20"
    },
    {
      url: '/assets/3.svg',
      id: 3,
      eip: "EIP-196"
    },
    {
      url: '/assets/4.svg',
      id: 4,
      eip: "EIP-214"
    },
    {
      url: '/assets/5.svg',
      id: 5,
      eip: "EIP-4337"
    },
  ]

  const { config } = usePrepareContractWrite({
    address: featureFlags.getNftContractAddress(),
    abi: EIPNFT.abi,
    functionName: "authenticatedMint",
    args: [address, selectedImageId],
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
        <div>Welcome, Vitalik Buterin!</div>
        <div>
          <br />
          {!beganMintingProcess && (
            <div>
              <Button onClick={() => setBeganMintingProcess(true)} variant="contained" color="primary">Begin Minting Process</Button>
            </div>
          )}
          {beganMintingProcess && (
            <div>
              Thank you for your contribution to the public good that is the Ethereum Network.
              <br /><br />
              You have contributed to 5 different EIPS.
              <br /><br />
              You now have the opportunity to mint 1/5 of the below NFT's thanks to our partners at APECoin & Nouns Dao.
              <br /><br />
              With these, anytime you spend from your connected wallet - you will have gas-less transaction fees.
              <br /><br />
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {images.map((item) => {
                  return (
                    <div>
                      <img
                        onClick={() => setSelectedImageId(item.id)}
                        style={selectedImageId === item.id ? selectedStyle : defaultStyle}
                        alt="Nouns Dao"
                        id={`image_${item.id}`}
                        src={item.url}
                      />
                      <div class="cented-eip">{item.eip}</div>
                    </div>

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
        <br />
        <Button onClick={disconnect} variant="contained" color="primary">Disconnect</Button>
      </div>
    );
  }
}

export default NftInteraction;
