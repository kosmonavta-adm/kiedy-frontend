import { type RouteConfig, index } from '@react-router/dev/routes';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export default [index('routes/home.tsx')] satisfies RouteConfig;
