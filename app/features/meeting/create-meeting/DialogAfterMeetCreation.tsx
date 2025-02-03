import { z } from 'zod';

import { Dialog, type DialogProps } from '~/commons/components/Dialog';

import { MeetingEntity } from '~/features/meeting/MeetingEntity';

interface DialogAfterMeetCreationProps extends DialogProps {
    createdMeeting: z.infer<typeof MeetingEntity> | undefined;
}

export const DialogAfterMeetCreation = ({ isOpen, onOpenChange, createdMeeting }: DialogAfterMeetCreationProps) => {
    return (
        <Dialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={true}
        >
            <p>{JSON.stringify(createdMeeting?.date)}</p>
            <p>Link do spotkania: {createdMeeting?.name}</p>
            <p>{createdMeeting?.id} </p>
        </Dialog>
    );
};
