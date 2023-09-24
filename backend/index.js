const express = require('express');
require('dotenv').config();
const axios = require('axios');
import { fetchQuery } = require("@airstack/node");

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

app.get('/airstack/query', async (req, res) => {
  const address = req.query.address;
  const query = `query MyQuery {
    GoerliOptimism: TokenBalances(
      input: {filter: {owner: {_eq: "{address}"}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: 50}
    ) {
      TokenBalance {
        owner {
          identity
        }
        amount
        tokenAddress
        tokenId
        tokenType
        tokenNfts {
          contentValue {
            image {
              small
            }
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }`;
  const { data, error } = await fetchQuery(query, variables);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})