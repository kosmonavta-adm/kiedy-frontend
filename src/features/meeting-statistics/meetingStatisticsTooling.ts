import { z } from 'zod';

import { getDateFromMinutes } from '@/commons/utils';

import { meetingEntity } from '@/features/pick-time-slot/api-calls/getMeeting';

export function transformToStatistics(meeting: z.infer<typeof meetingEntity>) {
  const allAttendees = meeting.availability.reduce<Map<string, string>>((attendees, day) => {
    day.chosenSlots.forEach(({ userId, fullName }) => attendees.set(userId, fullName));
    return attendees;
  }, new Map());

  const slotsPickedByAll = meeting.availability.reduce<Map<string, Date[]>>((slots, day) => {
    const chosenSlotsGroupedByTime = Object.groupBy(day.chosenSlots, ({ time }) => time);

    Object.entries(chosenSlotsGroupedByTime).forEach(([time, slot]) => {
      if (slot?.length === allAttendees.size) {
        const dateFromTime = getDateFromMinutes(day.date, Number(time));
        const slotsFromDay = slots.get(day.date);
        if (slotsFromDay !== undefined) {
          slotsFromDay.push(dateFromTime);
          slots.set(day.date, slotsFromDay);
        } else {
          slots.set(day.date, [dateFromTime]);
        }
      }
    });
    return slots;
  }, new Map());

  const slotsSortedByPopularity = meeting.availability.reduce<
    Map<string, { time: Date; popularity: number; attendees: string[] }[]>
  >((slots, day) => {
    const chosenSlotsGroupedByTime = Object.groupBy(day.chosenSlots, ({ time }) => time);

    Object.entries(chosenSlotsGroupedByTime).forEach(([time, slot]) => {
      if (slot === undefined) {
        throw new Error('Slot is undefined!');
      }

      if (slot.length !== allAttendees.size) {
        const dateFromTime = getDateFromMinutes(day.date, Number(time));
        const attendees = slot
          ?.map(({ fullName }) => fullName)
          .toSorted((fullNameA, fullNameB) => fullNameA.localeCompare(fullNameB));

        const slotsFromDay = slots.get(day.date);

        if (slotsFromDay !== undefined) {
          slotsFromDay.push({ time: dateFromTime, popularity: slot.length, attendees });

          slots.set(
            day.date,
            slotsFromDay.toSorted((slotA, slotB) => slotB.popularity - slotA.popularity)
          );
        } else {
          slots.set(day.date, [{ time: dateFromTime, popularity: slot.length, attendees }]);
        }
      }
    });
    return slots;
  }, new Map());

  return {
    slotsPickedByAll: Array.from(slotsPickedByAll.entries()),
    slotsSortedByPopularity: Array.from(slotsSortedByPopularity.entries()),
    allAttendees: allAttendees.size,
  };
}
