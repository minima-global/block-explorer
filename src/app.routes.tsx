import Block from './pages/Block/Block';
import BlockDetail from './pages/Block/BlockDetail';

export interface RouteType {
    path: string;
    sidebarName?: string;
    element: JSX.Element;
}

const Routes: RouteType[] = [
    {
        path: '/',
        sidebarName: 'Block',
        element: <Block></Block>,
    },
    {
        path: '/:txpowid',
        // no sidebar item
        element: <BlockDetail></BlockDetail>,
    },
];

export default Routes;
