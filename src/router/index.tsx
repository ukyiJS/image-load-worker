import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '@/pages';
import { imageRoutes } from '@/router/image.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        loader: () => redirect('/image'),
      },
      ...imageRoutes,
    ],
  },
]);
