/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';

import RootStack from './navigators/RootStack';
import { AppContextProvider } from './AppContext';

export default function App() {
    return <AppContextProvider>
        <RootStack/>
    </AppContextProvider>;
}
