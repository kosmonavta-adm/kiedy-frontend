import { z } from 'zod';

export const postMeetingEntity = z.object({
  name: z.string(),
  duration: z.number(),
  availability: z.array(
    z.object({
      date: z.string(),
      slots: z.array(
        z.object({
          beginning: z.number(),
          ending: z.number(),
        })
      ),
    })
  ),
});

export async function postMeeting(meeting: z.infer<typeof postMeetingEntity>): Promise<number> {
  const response = await fetch(`${import.meta.env.VITE_API}/meeting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meeting),
  });

  const parsedResponse = await response.json();

  return parsedResponse;
}
