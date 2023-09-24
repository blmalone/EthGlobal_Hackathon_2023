const express = require('express');
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
      omitFields: ['provenance', 'traits'],
      page: 1,
      perPage: 100,
      contracts: [nftContract],
    },
  };

  try {
    const response = await axios.post('https://warmhearted-virulent-darkness.ethereum-goerli.discover.quiknode.pro/6feeca8dc83af32bfe7d2365d45f08c4d5608598/', requestData, config);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})