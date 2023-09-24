import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from "@biconomy/core-types";

const chainId = ChainId.OPTIMISM_GOERLI_TESTNET;

const bundler: IBundler = new Bundler({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
  chainId, // or any supported chain of your choice
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/420/2G9l4Jq-W.72a5f863-2b4c-4848-8a8c-6d41cc282d36',
});


const connect = async () => {
  const { ethereum } = window;
  try {
    const provider = new ethers.providers.Web3Provider(ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const ownerShipModule = ECDSAOwnershipValidationModule.create({
      signer: signer,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })
    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: ownerShipModule,
      activeValidationModule: ownerShipModule
    })
    const address = await biconomySmartAccount.getAccountAddress()
    console.log(address)
  } catch (error) {
    console.error(error);
  }
};


/**
 * Get the installed
 * snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum
    .request({
      method: 'eth_sendTransaction',
      // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
      params: [
        {
          from: '0x2AC510768F6dAc4C84E472bE25768466afC21c88', // The user's active address.
          to: '0x2AC510768F6dAc4C84E472bE25768466afC21c88', // Required except during contract publications.
          value: '0', // Only required to send ether to the recipient from the initiating external account.
          gasLimit: '0x5028', // Customizable by the user during MetaMask confirmation.
          maxPriorityFeePerGas: '0x3b9aca00', // Customizable by the user during MetaMask confirmation.
          maxFeePerGas: '0x2540be400', // Customizable by the user during MetaMask confirmation.
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error(error));
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

export const getAccount = async () => {
  accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
};

export const sendCreateSmartAccount = async () => {
  await connect().then((txHash) => console.log(txHash));
};
