import React from "react";
import AppRouter from "router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { MUItheme } from "styles/theme";
import { appStyles } from "styles/app";
import { detectMetamask } from "utils/web3";

function App() {
  detectMetamask().then((hasMetamask: boolean) => {
    if (!hasMetamask) {
      console.log("Metamask is not installed or not available");
      // alert("Install Meta Mask")
      // window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en", "_blank");
    } else {
      console.log("Metamask is installed and available");
    }
  });
  return (
    <div style={appStyles}>
      <CssBaseline />
        {/* <WagmiConfig client={client}> */}
          <ThemeProvider theme={MUItheme}>
            <AppRouter />
          </ThemeProvider>
      {/* </WagmiConfig> */}
    </div>
  );
}

export default App;
