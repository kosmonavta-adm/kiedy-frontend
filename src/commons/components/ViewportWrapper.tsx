import { ReactNode } from 'react';

import { useWindowSize } from '@/commons/hooks/useWindowsSize';
import { cxTw } from '@/commons/utils';

export function ViewportWrapper({
  children,
  xMargin = 64,
  isSnapActive = true,
}: {
  children: ReactNode;
  xMargin?: number;
  isSnapActive?: boolean;
}) {
  const { width } = useWindowSize();

  return (
    <div
      id="x"
      className={cxTw(
        'xl:overflow-visiblecxTw flex items-start justify-start overflow-auto xl:w-fit',
        isSnapActive && 'snap-x snap-mandatory'
      )}
      {...(width <= 1280 && { style: { width: `calc(100vw - ${xMargin}px)` } })}
    >
      <div className="mx-4 my-8 flex grow basis-full flex-nowrap gap-16 xl:flex-wrap">{children}</div>
    </div>
  );
}
