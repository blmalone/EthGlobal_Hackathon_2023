import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
// import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { IBundler, Bundler } from '@biconomy/bundler';
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from '@biconomy/core-types';
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from '@biconomy/modules';
import { Keyring, KeyringAccount } from '@metamask/keyring-api';
import * as uuid from 'uuid';

const chainId = ChainId.OPTIMISM_GOERLI_TESTNET;

const smartAccounts = [];

// const bundler: IBundler = new Bundler({
//   // get from biconomy dashboard https://dashboard.biconomy.io/
//   bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
//   chainId, // or any supported chain of your choice
//   entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
// });

// const paymaster: IPaymaster = new BiconomyPaymaster({
//   // get from biconomy dashboard https://dashboard.biconomy.io/
//   paymasterUrl:
//     'https://paymaster.biconomy.io/api/v1/420/2G9l4Jq-W.72a5f863-2b4c-4848-8a8c-6d41cc282d36',
// });

const connectEoa = async () => {
  console.log('making web3 provider');

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('provider built');
    await provider.send('eth_requestAccounts', []);
    console.log('requestAccounts sent');
    const signer = provider.getSigner();
    // console.log('signer', signer);
    // const ownerShipModule = ECDSAOwnershipValidationModule.create({
    //   signer,
    //   moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    // });
    console.log('ownerShipModule', ownerShipModule);
    // let biconomySmartAccount = await BiconomySmartAccountV2.create({
    //   chainId: chainId,
    //   bundler,
    //   paymaster,
    //   entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    //   defaultValidationModule: ownerShipModule,
    //   activeValidationModule: ownerShipModule,
    // });
    // const address = await biconomySmartAccount.getAccountAddress();
    // console.log(address);
    // smartAccounts.push(address);
    // return address;
    return signer;
  } catch (error) {
    console.error('failed connectEoa', error);
  }
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'eth_sendTransaction': {
      console.log('request', request);
      // paymaster.getPaymasterAndData()
      const accounts = await connectEoa();
      console.log('accounts', accounts);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`accounts without module: ${JSON.stringify(accounts)}`),
          ]),
        },
      });
    }

    // return snap.request({
    //   method: 'snap_dialog',
    //   params: {
    //     type: 'confirmation',
    //     content: panel([
    //       text(`Intercepted a send TX`),
    //       text(`Params: ${JSON.stringify(request)}`),
    //     ]),
    //   },
    // });
    // connectEoa();
    default:
      throw new Error(`Method not found: ${JSON.stringify(request)}`);
  }
};
