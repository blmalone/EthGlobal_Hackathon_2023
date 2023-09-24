const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express()


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

app.get('/nft-alchemy', async (req, res) => {
  const address = req.query.address;
  const nftContract = req.query.contractAddress;
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const response = await axios.get(`https://polygon-mumbai.g.alchemy.com/nft/v3/F9oZzn4hiBlbbfAMtL9BCPIJ-R7yK8HG/getNFTsForOwner?owner=${address}&contractAddresses[]=${nftContract}&withMetadata=true&pageSize=100`);
  const responseData = response.data;
  if (responseData && responseData.ownedNfts && responseData.ownedNfts.length > 0) {
    return res.send({
      owned: true,
    })
  }
  res.send(responseData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})