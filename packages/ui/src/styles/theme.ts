import { createTheme, ThemeOptions } from '@mui/material/styles';

const palette = {
  primary: {
    light: '#757ce8',
    main: '#3f50b5',
    dark: '#002884',
    contrastText: '#fff',
  },
  secondary: {
    light: '#ff7961',
    main: '#f44336',
    dark: '#ba000d',
    contrastText: '#000',
  },
};

const themeOptions: ThemeOptions = {
    palette,
    spacing: 4,
}
const theme = createTheme(themeOptions);

theme.typography = {
    ...theme.typography,
    h1: {
      fontSize: '1.2rem',
      '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
    }
};


export { theme as MUItheme }
