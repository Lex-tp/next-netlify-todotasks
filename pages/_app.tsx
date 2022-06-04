import type {AppProps} from 'next/app';
import mainTheme from "../themes/mainTheme";
import {ThemeProvider} from "@mui/material";
import '../styles/globals.scss';
import 'normalize.css/normalize.css';
import {Provider} from "react-redux";
import {store} from "../store";
import NextNProgress from "nextjs-progressbar";
import 'regenerator-runtime/runtime';
import {SnackbarProvider} from "notistack";


function App({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider theme={mainTheme}>
            <Provider store={store}>
                <NextNProgress
                    color='#395A66'
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                    nonce='my-nonce'
                    options={{ easing: "ease", speed: 500 }}/>
                <SnackbarProvider maxSnack={2}>
                <Component {...pageProps} />
                </SnackbarProvider>
            </Provider>
        </ThemeProvider>
    )
}

export default App;