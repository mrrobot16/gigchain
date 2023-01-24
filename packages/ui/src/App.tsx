import React from 'react';
import AppRouter from 'router';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { MUItheme } from 'styles/theme';
function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={MUItheme}>
          <AppRouter />
      </ThemeProvider>
    </>
  );
}

export default App;