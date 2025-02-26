import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { UserProvider } from '@/commons/providers/UserProvider';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  const isUserEmpty = window.localStorage.getItem('userId');

  if (isUserEmpty === null) {
    window.localStorage.setItem('userId', crypto.randomUUID());
  }

  return (
    <>
      <UserProvider>
        <Outlet />
      </UserProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
      />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
