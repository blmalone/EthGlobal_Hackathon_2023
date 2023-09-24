import "./App.css";
import Homepage from "./Homepage.jsx";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, polygon, polygonMumbai } from "wagmi/chains";

const chains = [arbitrum, mainnet, polygon, goerli, sepolia, polygonMumbai];
const projectId = "aae549724982e724fe290ad620cfa847";


const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WagmiConfig config={wagmiConfig}>
          <Homepage />
        </WagmiConfig>

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </header>
    </div>
  );
}

export default App;
