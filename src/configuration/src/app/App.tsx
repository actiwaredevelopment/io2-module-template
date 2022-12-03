import { lazy } from 'react';

import { Route, Routes } from 'react-router-dom';

const DataQueryExampleConfig = lazy(() => import('./data-query/example'));

const ProcessorExampleConfig = lazy(() => import('./processor/example'));

export const App: React.FunctionComponent = () => {
    return (
        <Routes>
            <Route
                path='/api/v2/data-query/example/config'
                element={<DataQueryExampleConfig />}
            />
            <Route
                path='/api/v2/processor/example/config'
                element={<ProcessorExampleConfig />}
            />
        </Routes>
    );
};

