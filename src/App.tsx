import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "./App.css";
import AuxoReport from "./AuxoReport";

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()]);

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});


function App() {
  return (
    <WagmiConfig client={client}>
      <div className="App">
        <AuxoReport />
      </div>
    </WagmiConfig>
  );
}

export default App;