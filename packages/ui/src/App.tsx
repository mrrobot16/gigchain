import React from "react";
import AppRouter from "router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { MUItheme } from "styles/theme";
function App() {
  return (
    <div style={{backgroundColor: "#0d0208bd", color: "#003B00"}}>
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
