import { Global, css } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Menu from './Menu';
import Game from './Game';
// import Scanlines from './zoo/Scanlines';

const globalStyles = css`
  html,
  body {
    font-family: sans-serif;
    margin: 0;
  }
`;

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
export default App;
