import type { RouteObject } from 'react-router-dom';
import Worker from '@/pages/image/worker.tsx';
import Image from '@/pages/image';

export const imageRoutes: RouteObject[] = [
  {
    path: 'image',
    element: <Image />,
  },
  {
    path: 'worker-image',
    element: <Worker />,
  },
];
