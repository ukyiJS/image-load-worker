import { useMemo } from 'react';

export const useRandomImage = (length: number): string[] => useMemo(() => Array.from({ length }, () => `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/720/1080`), [length]);
