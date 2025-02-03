import { z } from 'zod';

export const CreateMeetingEntity = z.object({
    name: z.string(),
    selectedDays: z.array(z.date()),
    duration: z.number(),
    availability: z.array(
        z.object({
            key: z.string(),
            thumbs: z.array(z.number()),
        })
    ),
});
