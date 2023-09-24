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
  const smartAccountAddress = "E21DB5EF1719Ee378D014D8d48BF0AA3c812f75A";
  const paymasterAddress = "0x40c6e6A6540C30BcBEe1E4991DDbB5f91F4645DC";
  console.log("########## We're in createUnsignedUserOp");
  console.log("inside the snap");

  const nonce = "0x6"; // await window.ethereum.request({ method: 'eth_getTransactionCount', params: [smartAccountAddress, 'latest'] });
  console.log(`Retrieved nonce: ${nonce}`);

  const dataForEstimate = { sender: `0x${smartAccountAddress}`, nonce };
  console.log(`Estimate api payload: ${dataForEstimate}`);

  const urlPath = "bundler/estimateUserOpGas"

  // const response = await fetch(`http://localhost:4001/${urlPath}`,
  //   {
  //     method: "POST", headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(dataForEstimate)
  //   });
  // const estimateResponse = await response.json();
  // console.log(`Estimate response payload:`, estimateResponse);
  // const destinationAddress = smartAccountAddress;
  // const amount = "9184E72A000"; // 10000000000000 wei
  // const toAddress = "4200000000000000000000000000000000000006"; // WETH contract

  // `0x940d3c60000000000000000000000000${toAddress}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000${destinationAddress}00000000000000000000000000000000000000000000000000000${amount}00000000000000000000000000000000000000000000000000000000`,
  const userOp: UserOperation = {
    sender: `0x${smartAccountAddress}`,
    nonce: nonce,
    initCode: "0x",
    callData: "0xb61d27f6000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000e21db5ef1719ee378d014d8d48bf0aa3c812f75a0000000000000000000000000000000000000000000000000000071cefe4492300000000000000000000000000000000000000000000000000000000",
    callGasLimit: "100000",// estimateResponse.callGasLimit, // this
    verificationGasLimit: "100000", // estimateResponse.verificationGasLimit, // this
    preVerificationGas: "100000", //estimateResponse.preVerificationGas, // this
    maxFeePerGas: "1000000000", //estimateResponse.maxFeePerGas, // this
    maxPriorityFeePerGas: "5000000000",// estimateResponse.maxPriorityFeePerGas, // this
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    paymasterAndData: paymasterAddress
  }
  console.log(userOp.callData);

  const sendUserOpPath = "bundler/sendUserOp";
  const submitResponse = await fetch(`http://localhost:4001/${sendUserOpPath}`,
    {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userOp)
    });
  const finalResult = await submitResponse.json();
  console.log(finalResult);
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
