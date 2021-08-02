import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import poppins from "typeface-poppins";

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196F3',
        },
        secondary: {
            main: '#27AE60',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
    typography: {
        fontFamily: '"poppins", sans-serif'
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "@font-face": [poppins],
                '.MuiButtonBase-root': {
                    textTransform: "none",
                }
            }
        }
    }
});

export default theme;