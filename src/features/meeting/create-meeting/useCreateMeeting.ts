import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { CreateMeetingEntity } from '@/features/meeting/create-meeting/CreateMeetingEntity';

export const useCreateMeeting = () =>
  useMutation({
    mutationFn: (meeting: z.infer<typeof CreateMeetingEntity>) => {
      return fetch('http://localhost:8080/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meeting),
      });
    },
  });
