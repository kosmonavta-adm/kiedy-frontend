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

export const Route = createFileRoute('/$meetingId')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { meetingId } }) => {
    return queryClient.ensureQueryData(getMeeting(Number(meetingId)));
  },

  validateSearch: productSearchSchema,
});

function RouteComponent() {
  const { afterCreation } = Route.useSearch();
  const [isDialogAfterMeetCreationOpen, toggleIsDialogAfterMeetCreationOpen] = useToggle(Boolean(afterCreation));

  const { meetingId } = Route.useParams();

  const navigate = useNavigate();

  //TODO: This should be implemented as websockets.
  const meeting = useSuspenseQuery({
    ...getMeeting(Number(meetingId)),
    staleTime: 1,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const isAnySlotPicked = meeting.data.availability.some((day) => day.chosenSlots.length > 0);

  return (
    <main className="flex min-h-svh flex-col p-12">
      <h1 className="text-center text-4xl font-bold leading-snug xl:text-7xl xl:font-normal">{meeting.data.name}</h1>
      <DialogAfterMeetCreation
        createdMeeting={meeting.data}
        isOpen={isDialogAfterMeetCreationOpen}
        onOpenChange={async () => {
          toggleIsDialogAfterMeetCreationOpen();
          await navigate({ to: window.location.pathname });
        }}
      />
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-16 bg-white p-8 xl:grid-cols-2 xl:gap-64 xl:p-16">
        <PickTimeSlot meeting={meeting.data} />
        {isAnySlotPicked && <MeetingStatistics meeting={meeting.data} />}
      </div>
    </main>
  );
}
