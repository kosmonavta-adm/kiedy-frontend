import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getMeeting } from '@/features/meeting/choose-date/getMeeting';

type ChooseDateParams = {
  afterCreation?: true;
};

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    return {
      ...params,
      id: Number(params.id),
    };
  },
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getMeeting(id));
  },

  validateSearch: (search: Record<string, unknown>): ChooseDateParams => ({
    afterCreation: search?.afterCreation as true,
  }),
});

function RouteComponent() {
  const { afterCreation } = Route.useSearch();
  const { id } = Route.useParams();
  const meeting = useSuspenseQuery(getMeeting(id));

  const slots = meeting.data.reduce((result, currentDay, index, array) => {
    if (index % 2 === 0) {
    }
    return result;
  }, []);

  return <main></main>;
}
