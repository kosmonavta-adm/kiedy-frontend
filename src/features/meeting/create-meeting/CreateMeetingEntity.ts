import { z } from 'zod';

export const CreateMeetingEntity = z.object({
  name: z.string(),
  duration: z.number(),
  availability: z.array(
    z.object({
      date: z.string(),
      slot: z.array(
        z.object({
          beginning: z.number(),
          ending: z.number(),
        })
      ),
    })
  ),
});
