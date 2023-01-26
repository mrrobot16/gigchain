import React from "react";
import AppRouter from "router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { WagmiConfig  } from "wagmi"

import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { createClient, configureChains, goerli } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'

const { REACT_APP_INFURA_ID: INFURA_API_KEY } = process.env;
const { chains, provider } = configureChains([goerli], [publicProvider(), infuraProvider({ apiKey: INFURA_API_KEY as string })])
 
const client = createClient({
  connectors: [
    new InjectedConnector({ chains }),
  ],
  provider,
})

import { MUItheme } from "styles/theme";
function App() {
  return (
    <>
      <CssBaseline />
        <WagmiConfig client={client}>
          <ThemeProvider theme={MUItheme}>
            <AppRouter />
          </ThemeProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
