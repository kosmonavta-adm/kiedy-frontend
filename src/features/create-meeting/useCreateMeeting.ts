import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { CreateMeetingEntity } from '@/features/create-meeting/CreateMeetingEntity';

export const useCreateMeeting = () =>
  useMutation({
    mutationFn: (meeting: z.infer<typeof CreateMeetingEntity>) => {
      return fetch(`${import.meta.env.VITE_API}/meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meeting),
      });
    },
  });
