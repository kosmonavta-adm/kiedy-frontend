import { ReactNode } from 'react';

export function ViewportWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[calc(100vw-64px)] snap-x snap-mandatory items-start justify-start overflow-auto xl:w-fit xl:overflow-visible">
      <div className="mx-4 my-8 flex shrink-0 grow basis-full flex-nowrap gap-16 xl:flex-wrap">{children}</div>
    </div>
  );
}
