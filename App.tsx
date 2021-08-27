/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useEffect } from 'react';
import * as Sentry from 'sentry-expo';

import RootStack from './navigators/RootStack';
import { AppContextProvider } from './AppContext';
// @ts-ignore
import { Root } from 'popup-ui';
import { startNetworkLogging } from 'react-native-network-logger';

Sentry.init({
    dsn: 'https://4f05120f2e374419bde4492d55b16f56@o51258.ingest.sentry.io/5933308',
    enableInExpoDevelopment: false,
    debug: true,
});

export default function App() {
    useEffect(() => {
        startNetworkLogging({ ignoredHosts: ['127.0.0.1:19000'] });
    }, []);
    return <AppContextProvider>
        <Root><RootStack/></Root>
    </AppContextProvider>;
}
