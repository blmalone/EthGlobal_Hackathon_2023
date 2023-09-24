const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express()
const cors = require("cors")

app.use(express.json());
app.use(cors())


const { Bundler } = require('@biconomy/bundler');
const { ChainId } = require("@biconomy/core-types");

const chainId = ChainId.POLYGON_MUMBAI;

const bundler = new Bundler({
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
  chainId: chainId,
  entryPointAddress: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
});

const port = 4001;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})


// respond with "hello world" when a GET request is made to the homepage
app.get('/nft', async (req, res) => {
  const address = req.query.address;
  const nftContract = req.query.contractAddress;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-qn-api-version': '1',
    },
  };

  const requestData = {
    method: 'qn_fetchNFTs',
    params: {
      wallet: address,
      page: 1,
      contracts: [nftContract],
    },
  };

  try {
    const response = await axios.post(process.env.QUICK_NODE_ETHEREUM_GOERLI, requestData, config);
    const responseData = response.data;
    res.send(responseData);
    // Handle the response data as needed
  } catch (error) {
    // Handle errors here
    console.error('An error occurred:', error);
    console.error(error.response.data);
    res.send(error.response.data).status(500);
  }
});

app.post('/bundler/estimateUserOpGas', async (req, res) => {
  console.log("body estimate", req.body);
  const sender = req.body.sender;
  const nonce = req.body.nonce;
  const signature = "0x703fb95ca8148f4d38693c413f06293e9a6f8b39c89fe433187c18761ba13004703fb95ca8148f4d38693c413f06293e9a6f8b39c89fe433187c18761ba13004";
  const estimate = await bundler.estimateUserOpGas({
    // data,
    sender,
    signature,
    nonce,
    initCode: "0x",
    callData: "0x",
  }).catch((error) => console.error(error));
  console.log("estimate", estimate);
  return res.send(estimate);
});

app.post('/bundler/sendUserOp', async (req, res) => {
  console.log("body sendU", req.body);
  const userOp = await bundler.sendUserOp({
    ...req.body
  })
    .catch((error) => console.error(error));
  console.log(`User operation: ${JSON.stringify(userOp)}`);
  return res.send(JSON.stringify(userOp));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})