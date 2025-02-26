import { z } from 'zod';

export const getMeetingKey = (id: number) => ['meeting', id];

export const meetingEntity = z.object({
  id: z.number(),
  name: z.string(),
  duration: z.number(),
  availability: z.array(
    z.object({
      id: z.number(),
      date: z.string(),
      chosenSlots: z.array(
        z.object({
          id: z.number(),
          fullName: z.string(),
          time: z.number(),
          userId: z.string(),
        })
      ),
      slots: z.array(
        z.object({
          id: z.number(),
          beginning: z.number(),
          ending: z.number(),
        })
      ),
    })
  ),
});

export function getMeeting(id: number) {
  return {
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/meeting/${id}`);
      const parsedResponse = await response.json();

      return meetingEntity.parse(parsedResponse);
    },
    queryKey: getMeetingKey(id),
  };
}
