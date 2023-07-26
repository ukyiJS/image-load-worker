import type { RouteObject } from 'react-router-dom';
import Worker from '@/pages/image/worker';
import Image from '@/pages/image';

export const imageRouter: RouteObject[] = [
  {
    path: 'image',
    element: <Image />,
  },
  {
    path: 'worker-image',
    element: <Worker />,
  },
];
