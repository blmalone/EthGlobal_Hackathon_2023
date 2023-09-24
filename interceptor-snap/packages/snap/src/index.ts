import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

export interface UserOperation {
  sender: string
  nonce: string
  initCode: string
  callData: string
  callGasLimit: string
  verificationGasLimit: string
  preVerificationGas: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  signature: string
  paymasterAndData: string
}

async function createUnsignedUserOp(request: any): Promise<any> {
  // <OB> TODO HARDCODE
  const accountAddress = "0x35D67Ae919CD86621C2B31F1eAF30733Fe893db8";
  const entryPointAddress = ""
  console.log("########## We're in createUnsignedUserOp");
  console.log("inside the snap");
  // const nonce = 0;
  const nonce = await window.ethereum.request({ method: 'eth_getTransactionCount', params: [accountAddress, 'latest'] });
  console.log(`Retrieved nonce: ${nonce}`);
  const userOp: UserOperation = {
    sender: request.from,
    nonce: nonce,
    initCode: "0x",
    callData: "0x", // 
    callGasLimit: '', // this
    verificationGasLimit: '', // this
    preVerificationGas: '', // this
    maxFeePerGas: '', // this
    maxPriorityFeePerGas: '', // this
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    paymasterAndData: "0xd06B9c0A22556398c0486c18849477C1F522F1D2"
  }
  return userOp;
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
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
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
    case 'eth_sendTransaction':
      console.log('request', request);
      const userOp = await createUnsignedUserOp(request);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Intercepted a send transaction and converted to unsigned user operation.`),
            text(`UserOperation: ${JSON.stringify(userOp)}`),
          ]),
        },
      });
    default:
      throw new Error(`Method not found: ${request}`);
  }
};


const SMART_ACCOUNT_ABI = [{ "type": "constructor", "stateMutability": "undefined", "payable": false, "inputs": [{ "type": "address", "name": "anEntryPoint" }] }, { "type": "event", "anonymous": false, "name": "AdminChanged", "inputs": [{ "type": "address", "name": "previousAdmin", "indexed": false }, { "type": "address", "name": "newAdmin", "indexed": false }] }, { "type": "event", "anonymous": false, "name": "BeaconUpgraded", "inputs": [{ "type": "address", "name": "beacon", "indexed": true }] }, { "type": "event", "anonymous": false, "name": "Initialized", "inputs": [{ "type": "uint8", "name": "version", "indexed": false }] }, { "type": "event", "anonymous": false, "name": "SmartAccountInitialized", "inputs": [{ "type": "address", "name": "entryPoint", "indexed": true }, { "type": "address", "name": "owner", "indexed": true }] }, { "type": "event", "anonymous": false, "name": "Upgraded", "inputs": [{ "type": "address", "name": "implementation", "indexed": true }] }, { "type": "function", "name": "addDeposit", "constant": false, "stateMutability": "payable", "payable": true, "inputs": [], "outputs": [] }, { "type": "function", "name": "entryPoint", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [{ "type": "address" }] }, { "type": "function", "name": "execute", "constant": false, "payable": false, "inputs": [{ "type": "address", "name": "dest" }, { "type": "uint256", "name": "value" }, { "type": "bytes", "name": "func" }], "outputs": [] }, { "type": "function", "name": "executeBatch", "constant": false, "payable": false, "inputs": [{ "type": "address[]", "name": "dest" }, { "type": "uint256[]", "name": "value" }, { "type": "bytes[]", "name": "func" }], "outputs": [] }, { "type": "function", "name": "getDeposit", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [{ "type": "uint256" }] }, { "type": "function", "name": "getNonce", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [{ "type": "uint256" }] }, { "type": "function", "name": "initialize", "constant": false, "payable": false, "inputs": [{ "type": "address", "name": "anOwner" }], "outputs": [] }, { "type": "function", "name": "onERC1155BatchReceived", "constant": true, "stateMutability": "pure", "payable": false, "inputs": [{ "type": "address" }, { "type": "address" }, { "type": "uint256[]" }, { "type": "uint256[]" }, { "type": "bytes" }], "outputs": [{ "type": "bytes4" }] }, { "type": "function", "name": "onERC1155Received", "constant": true, "stateMutability": "pure", "payable": false, "inputs": [{ "type": "address" }, { "type": "address" }, { "type": "uint256" }, { "type": "uint256" }, { "type": "bytes" }], "outputs": [{ "type": "bytes4" }] }, { "type": "function", "name": "onERC721Received", "constant": true, "stateMutability": "pure", "payable": false, "inputs": [{ "type": "address" }, { "type": "address" }, { "type": "uint256" }, { "type": "bytes" }], "outputs": [{ "type": "bytes4" }] }, { "type": "function", "name": "owner", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [{ "type": "address" }] }, { "type": "function", "name": "proxiableUUID", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [{ "type": "bytes32" }] }, { "type": "function", "name": "supportsInterface", "constant": true, "stateMutability": "view", "payable": false, "inputs": [{ "type": "bytes4", "name": "interfaceId" }], "outputs": [{ "type": "bool" }] }, { "type": "function", "name": "tokensReceived", "constant": true, "stateMutability": "pure", "payable": false, "inputs": [{ "type": "address" }, { "type": "address" }, { "type": "address" }, { "type": "uint256" }, { "type": "bytes" }, { "type": "bytes" }], "outputs": [] }, { "type": "function", "name": "upgradeTo", "constant": false, "payable": false, "inputs": [{ "type": "address", "name": "newImplementation" }], "outputs": [] }, { "type": "function", "name": "upgradeToAndCall", "constant": false, "stateMutability": "payable", "payable": true, "inputs": [{ "type": "address", "name": "newImplementation" }, { "type": "bytes", "name": "data" }], "outputs": [] }, { "type": "function", "name": "validateUserOp", "constant": false, "payable": false, "inputs": [{ "type": "tuple", "name": "userOp", "components": [{ "type": "address", "name": "sender" }, { "type": "uint256", "name": "nonce" }, { "type": "bytes", "name": "initCode" }, { "type": "bytes", "name": "callData" }, { "type": "uint256", "name": "callGasLimit" }, { "type": "uint256", "name": "verificationGasLimit" }, { "type": "uint256", "name": "preVerificationGas" }, { "type": "uint256", "name": "maxFeePerGas" }, { "type": "uint256", "name": "maxPriorityFeePerGas" }, { "type": "bytes", "name": "paymasterAndData" }, { "type": "bytes", "name": "signature" }] }, { "type": "bytes32", "name": "userOpHash" }, { "type": "uint256", "name": "missingAccountFunds" }], "outputs": [{ "type": "uint256", "name": "validationData" }] }, { "type": "function", "name": "withdrawDepositTo", "constant": false, "payable": false, "inputs": [{ "type": "address", "name": "withdrawAddress" }, { "type": "uint256", "name": "amount" }], "outputs": [] }, { "type": "receive", "stateMutability": "payable" }]