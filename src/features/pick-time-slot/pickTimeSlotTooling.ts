import { z } from 'zod';

import { meetingEntity } from '@/features/pick-time-slot/api-calls/getMeeting';

export type ChosenBy = {
  fullName: string;
  id: number;
  userId: string;
};

export type Slot = {
  chosenBy: ChosenBy[];
  time: number;
};

export type Availability = {
  date: Date;
  id: number;
  slots: Slot[];
};

export function transformTimeSlots(meeting: z.infer<typeof meetingEntity>) {
  const slots = meeting.availability.reduce<Availability[]>((result, day) => {
    result.push({
      date: new Date(day.date),
      id: day.id,
      slots: day.slots.reduce<Slot[]>((slotsResult, slot) => {
        let currentTime = slot.beginning;

        while (currentTime !== slot.ending) {
          const foundSlots = day.chosenSlots
            .filter((chosenSlot) => chosenSlot.time === currentTime)
            .map(({ fullName, id, userId }) => ({ fullName, id, userId }));

          slotsResult.push({ chosenBy: foundSlots, time: currentTime });
          currentTime += meeting.duration;
        }

        return slotsResult;
      }, []),
    });
    return result;
  }, []);

  return slots;
}

export function checkIsSlotPicked({
  timeSlot,
  userId,
  slotsToCheck,
}: {
  timeSlot: number;
  userId: string;
  slotsToCheck: Slot[];
}) {
  return slotsToCheck.some(
    (slotToCheck) => slotToCheck.time === timeSlot && slotToCheck.chosenBy.some((user) => user.userId === userId)
  );
}
