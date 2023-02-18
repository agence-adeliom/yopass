import "@mui/material/styles/createPalette";
declare module "@mui/material/styles/createPalette" {
    interface PaletteOptions {
        dark: PaletteColorOptions;
    }
}

import "@mui/material/AppBar";
declare module "@mui/material/AppBar" {
    interface AppBarPropsColorOverrides {
        dark: true;
    }
}

import "@mui/material/TextField";
declare module "@mui/material/TextField" {
    interface TextFieldPropsColorOverrides {
        dark: true;
    }
}

