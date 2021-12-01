/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import * as Sentry from 'sentry-expo';

import RootStack from './src/navigators/RootStack';
import { AppContextProvider } from './src/context/AppContext';
// @ts-ignore
import { Root } from 'popup-ui';
import './src/i18n/i18n.index';
import { useTranslation } from 'react-i18next';

Sentry.init({
    dsn: 'https://4f05120f2e374419bde4492d55b16f56@o51258.ingest.sentry.io/5933308',
    enableInExpoDevelopment: false,
    debug: true,
});

export default function App() {
    const { t } = useTranslation();
    return <AppContextProvider t={t}>
        <Root><RootStack/></Root>
    </AppContextProvider>;
}
