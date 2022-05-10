/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import 'react-native-gesture-handler';
import React from 'react';

import RootStack from './src/navigators/RootStack';
import { AppContextProvider } from './src/context/AppContext';
// @ts-ignore
import { Root } from 'popup-ui';
import './src/i18n/i18n.index';
import { useTranslation } from "react-i18next";
import { AppAuthContextProvider } from './src/context/AppAuthContext';


export default function App() {
    const { t } = useTranslation();

    return <AppAuthContextProvider>
        <AppContextProvider t={t}>
            <Root>
                <RootStack/>
            </Root>
        </AppContextProvider>
    </AppAuthContextProvider>;
}
