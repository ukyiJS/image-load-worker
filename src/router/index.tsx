import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '@/pages';
import { imageRouter } from '@/router/image.router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        loader: () => redirect('/image'),
      },
      ...imageRouter,
    ],
  },
]);
