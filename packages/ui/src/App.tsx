import React from "react";
import AppRouter from "router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { MUItheme } from "styles/theme";
import { appStyles } from "styles/app";
import { detectWeb3 } from "utils";

// NOTE Find a way to call this inside a component.
// Except doing so will call the function more than once, which will create a bad UX.
// Find out what other solutions are out there.

detectWeb3()
function App() {
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
