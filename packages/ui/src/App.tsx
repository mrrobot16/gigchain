import React from "react";
import AppRouter from "router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { MUItheme } from "styles/theme";
import { appStyles } from "styles/app";
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
