import { z } from 'zod';

export const pickedTimeSlotEntity = z.object({
  fullName: z.string(),
  time: z.number(),
  availabilityId: z.number(),
  userId: z.string().nullable(),
});

export const postTimeSlotMutation = async (timeSlotToPost: z.infer<typeof pickedTimeSlotEntity>): Promise<number> => {
  const response = await fetch('http://localhost:8080/chosenSlots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timeSlotToPost),
  });

  return await response.json();
};
