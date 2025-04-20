import { Global, css } from '@emotion/react';
import {
  RouterProvider,
  createRouter,
  createRootRouteWithContext,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Menu from './Menu';
import Game from './Game';

const globalStyles = css`
  html,
  body {
    font-family: sans-serif;
    margin: 0;
    background-color: #131211;
    color: white;
  }
`;

const queryClient = new QueryClient();

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <Outlet />
    </QueryClientProvider>
  ),
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Menu,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId',
  component: Game,
});

const routeTree = rootRoute.addChildren([menuRoute, gameRoute]);

const router = createRouter({
  routeTree,
  context: { queryClient },
  basepath: '/hot-deck',
});

const App = () => <RouterProvider router={router} />;

export default App;
