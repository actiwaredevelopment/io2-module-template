import React, { Suspense } from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import { Stack } from '@fluentui/react';

import { FullSpinner } from './components/full-spinner';

export const App: React.FunctionComponent = () => {
    return (
        <Stack verticalFill>
            <BrowserRouter>
                <Routes>
                    <Route path='/api/v2/function/name/config' element={
                        <Suspense fallback={<FullSpinner />}>
                            <div>Example</div>
                        </Suspense>
                    }
                    />
                </Routes>
            </BrowserRouter>
        </Stack>
    );
};
