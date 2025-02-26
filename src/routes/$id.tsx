import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { useToggle } from '@/commons/hooks/useToggle';

import { DialogAfterMeetCreation } from '@/features/create-meeting/DialogAfterMeetCreation';
import { MeetingStatistics } from '@/features/meeting-statistics/MeetingStatistics';
import { PickTimeSlot } from '@/features/pick-time-slot/PickTimeSlot';
import { getMeeting } from '@/features/pick-time-slot/api-calls/getMeeting';

const productSearchSchema = z.object({
  afterCreation: z.boolean().optional(),
});

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getMeeting(Number(id)));
  },

  validateSearch: productSearchSchema,
});

function RouteComponent() {
  const { afterCreation } = Route.useSearch();
  const [isDialogAfterMeetCreationOpen, toggleIsDialogAfterMeetCreationOpen] = useToggle(Boolean(afterCreation));

  const { id } = Route.useParams();
  const navigate = useNavigate();
  const meeting = useSuspenseQuery({
    ...getMeeting(Number(id)),
    staleTime: 1,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  return (
    <main className="flex min-h-svh">
      <DialogAfterMeetCreation
        createdMeeting={meeting.data}
        isOpen={isDialogAfterMeetCreationOpen}
        onOpenChange={async () => {
          toggleIsDialogAfterMeetCreationOpen();
          await navigate({ to: window.location.pathname });
        }}
      />
      <div className="m-auto grid max-w-[1920px] grid-cols-1 gap-16 bg-white p-8 xl:grid-cols-2 xl:gap-64 xl:p-16">
        <MeetingStatistics meeting={meeting.data} />
        <PickTimeSlot meeting={meeting.data} />
      </div>
    </main>
  );
}
