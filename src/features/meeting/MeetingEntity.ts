import { z } from 'zod';

export const MeetingEntity = z.object({ name: z.string(), selectedDays: z.array(z.date()), id: z.number() });
