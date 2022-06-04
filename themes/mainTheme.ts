import {createTheme, responsiveFontSizes} from "@mui/material";

const mainTheme =responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: '#FE4F5A',
            light: '#f6747c',
            dark: '#e7444c',
            contrastText: '#f5f5f5'
        },
        secondary: {
            main: '#395A66',
            light: '#456c7a',
            dark: '#1A2E33',
        },
        text: {
            primary: '#1A2E33',
            secondary: '#395A66'
        }
    },
    typography: {
        fontFamily: [
            'Nunito',
            'Roboto',
            'sans-serif'
        ].join(','),
    }
}));

export default mainTheme;