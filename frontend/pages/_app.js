import Head from 'next/head';
import React, { useState, useEffect } from "react";

import 'styles/globals.css';
import 'styles/fonts.css';

import { Alert } from 'components';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { useRouter } from "next/router";
import { userService } from "services";

import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

export default App;

const clientSideEmotionCache = createEmotionCache();
const publicPaths = ["/account/login", "/account/forgotPassword", "/account/resetPassword", "/account/resetComplete"];
function App(props) {
    const { Component, emotionCache =
        clientSideEmotionCache, pageProps } = props;
    const getLayout = Component.getLayout ?? ((page) => page);

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(router.asPath);
        const hideContent = () => setAuthorized(false);
        router.events.on("routeChangeStart", hideContent);
        router.events.on("routeChangeComplete", authCheck);

        return () => {
            router.events.off("routeChangeStart", hideContent);
            router.events.off("routeChangeComplete", authCheck);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        setUser(userService.userValue);
        const path = url.split("?")[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: "/account/login",
                query: { returnUrl: router.asPath },
            });
        } else {
            setAuthorized(true);
        }
    }

    if (!authorized) {
        return <div />;
    }

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Hero Alert</title>
                <meta name="viewport"
                    content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Alert />
                {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
        </CacheProvider>
    );
}
