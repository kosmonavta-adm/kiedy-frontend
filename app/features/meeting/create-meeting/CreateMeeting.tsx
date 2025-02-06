import { useEffect, useState } from 'react';
import { z } from 'zod';

import { useToggle } from '~/commons/hooks/useToggle';

import { MeetingEntity } from '~/features/meeting/MeetingEntity';
import { CreateMeetingForm } from '~/features/meeting/create-meeting/CreateMeetingForm';
import { DialogAfterMeetCreation } from '~/features/meeting/create-meeting/DialogAfterMeetCreation';

export const CreateMeeting = () => {
  const [isDialogOpen, toggleIsDialogOpen] = useToggle(false);
  const [createdMeeting, setCreatedMeeting] = useState<z.infer<typeof MeetingEntity>>();

  return (
    <>
      <CreateMeetingForm
        onCreateMeeting={(formData) => {
          setCreatedMeeting(formData);
          toggleIsDialogOpen();
        }}
      />
      <DialogAfterMeetCreation
        key={createdMeeting?.id}
        isOpen={isDialogOpen}
        onOpenChange={toggleIsDialogOpen}
        createdMeeting={createdMeeting}
      />
    </>
  );
};
