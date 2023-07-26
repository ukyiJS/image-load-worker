import type { PropsWithChildren } from 'react';

export default function ImageContainer({ children }: Required<PropsWithChildren>): JSX.Element {
  return (
    <article className="flex justify-center flex-wrap gap-2">
      {children}
    </article>
  );
}
