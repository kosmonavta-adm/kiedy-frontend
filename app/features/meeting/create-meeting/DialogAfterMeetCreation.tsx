import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { z } from 'zod';

import { Button } from '~/commons/components/Button';
import { Dialog, type DialogProps } from '~/commons/components/Dialog';
import { Input } from '~/commons/components/Input';

import { MeetingEntity } from '~/features/meeting/MeetingEntity';

interface DialogAfterMeetCreationProps extends Omit<DialogProps, 'children'> {
  createdMeeting: z.infer<typeof MeetingEntity> | undefined;
}

export function DialogAfterMeetCreation({ isOpen, onOpenChange, createdMeeting }: DialogAfterMeetCreationProps) {
  if (createdMeeting === undefined) return;

  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const meetingUrl = `${window.location.href}${createdMeeting.id}`;

  const handleCopyLink = async (link: string) => {
    await navigator.clipboard.writeText(link).catch((e) => console.log(e));
    setIsCopied(true);
  };

  useEffect(() => {
    return () => {
      setIsCopied(false);
    };
  }, []);

  return (
    <Dialog
      className="w-xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <p className="mb-4 w-fit">Wydarzenie zostało pomyślnie utworzone!</p>
      <div className="flex gap-2">
        <Input
          readOnly={true}
          ref={inputRef}
          className="w-full"
          onClick={() => inputRef.current?.setSelectionRange(0, -1)}
          value={meetingUrl}
        />
        <Button
          onPress={() => handleCopyLink(meetingUrl)}
          className="w-52"
          isPending={isCopied}
        >
          {isCopied ? 'Skopiowano' : 'Skopiuj link'}
          {isCopied && <Check />}
        </Button>
      </div>
      <Button
        className="mt-8"
        slot="close"
      >
        Zamknij
      </Button>
    </Dialog>
  );
}
