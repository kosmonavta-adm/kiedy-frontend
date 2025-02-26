import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/commons/components/Button';
import { Input } from '@/commons/components/Input';
import { ViewportWrapper } from '@/commons/components/OverflowWrapper';
import { ToggleVisibility } from '@/commons/components/ToggleVisibility';
import { Tooltip, TooltipTrigger } from '@/commons/components/Tooltip';
import { useUser } from '@/commons/providers/UserProvider';
import { cxTw, getDateFromMinutes } from '@/commons/utils';

import { deleteTimeSlotMutation } from '@/features/pick-time-slot/api-calls/deleteTimeSlot';
import { getMeetingKey, meetingEntity } from '@/features/pick-time-slot/api-calls/getMeeting';
import { postTimeSlotMutation } from '@/features/pick-time-slot/api-calls/postTimeSlot';
import { SlotsColumn } from '@/features/pick-time-slot/internal/SlotsColumn/SlotsColumn';
import { SlotCounter } from '@/features/pick-time-slot/internal/SlotsColumn/parts/SlotCounter';
import { checkIsSlotPicked, transformTimeSlots } from '@/features/pick-time-slot/pickTimeSlotTooling';

type PickTimeProps = {
  meeting: z.infer<typeof meetingEntity>;
};

export function PickTimeSlot({ meeting }: PickTimeProps) {
  const { userId } = useUser();

  const slots = transformTimeSlots(meeting);

  const [fullName, setFullName] = useState(() => window.localStorage.getItem('fullName') ?? '');

  useEffect(() => {
    window.localStorage.setItem('fullName', fullName);
  }, [fullName]);

  const queryClient = useQueryClient();

  const postTimeSlot = useMutation({
    mutationFn: postTimeSlotMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getMeetingKey(meeting.id) }),
  });
  const deleteTimeSlot = useMutation({
    mutationFn: deleteTimeSlotMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getMeetingKey(meeting.id) }),
  });

  const isFullNameNotFilled = fullName.length === 0;
  const isAnySlotPickedByCurrentUser = meeting.availability.some((day) =>
    day.chosenSlots.some((slot) => slot.userId === userId)
  );
  const daysCount = meeting.availability.length;

  return (
    <div className="flex flex-col gap-8">
      <Input
        label="Imię i nazwisko"
        value={fullName}
        onChange={({ target: { value } }) => setFullName(value)}
        disabled={isAnySlotPickedByCurrentUser}
      />
      <div className="relative flex">
        <p
          className={cxTw(
            'pointer-events-none absolute inset-0 z-10 m-auto h-fit w-fit rounded border border-blue-600/20 bg-blue-500 p-4 font-semibold text-white opacity-0 shadow-xl transition',
            isFullNameNotFilled && 'pointer-events-auto opacity-100'
          )}
        >
          Wpisz swoje imię i nazwisko zanim przejdziesz dalej.
        </p>
        <ViewportWrapper>
          {/* <div
            className={cxTw(
              'grid gap-16',
              daysCount >= 3 && 'm-auto grid-cols-3',
              daysCount === 2 && 'grid-cols-2',
              daysCount === 1 && 'm-auto grid-cols-1',
              isFullNameNotFilled && 'pointer-events-none opacity-85 blur-[3px] saturate-0'
            )}
          > */}
          {slots.map((availability, index) => (
            <SlotsColumn
              key={index}
              date={availability.date}
            >
              {availability.slots.map((slot) => {
                const isoDay = formatISO(availability.date, { representation: 'date' });
                const slotChosenByCount = slot.chosenBy.length;
                const isSlotSelected = checkIsSlotPicked({
                  timeSlot: slot.time,
                  slotsToCheck: availability.slots,
                  userId,
                });

                return (
                  <div className="flex items-center justify-end gap-2">
                    <ToggleVisibility condition={slotChosenByCount > 0}>
                      <SlotCounter>{slotChosenByCount}</SlotCounter>
                    </ToggleVisibility>
                    <TooltipTrigger>
                      <Button
                        variant="secondary"
                        isPending={postTimeSlot.isPending}
                        className={cxTw(isSlotSelected && 'border-blue-400 bg-blue-400 text-white', 'w-24')}
                        onPress={() => {
                          if (isSlotSelected) {
                            deleteTimeSlot.mutate({ userId, time: slot.time });
                          } else {
                            postTimeSlot.mutate({
                              time: slot.time,
                              availabilityId: availability.id,
                              fullName,
                              userId,
                            });
                          }
                        }}
                      >
                        {format(getDateFromMinutes(isoDay, slot.time), 'HH:mm')}
                      </Button>
                      {slotChosenByCount > 0 && (
                        <Tooltip>
                          {slot.chosenBy.map((user) => (
                            <p>{user.fullName}</p>
                          ))}
                        </Tooltip>
                      )}
                    </TooltipTrigger>
                  </div>
                );
              })}
            </SlotsColumn>
          ))}
          {/* </div> */}
        </ViewportWrapper>
      </div>
    </div>
  );
}
