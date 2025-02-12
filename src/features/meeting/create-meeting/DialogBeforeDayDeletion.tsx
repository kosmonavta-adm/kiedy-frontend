import { Button } from '@/commons/components/Button';
import { Dialog, type DialogProps } from '@/commons/components/Dialog';

interface DialogBeforeDayDeletionProps extends Omit<DialogProps, 'children'> {
  onConfirm: () => void;
}

export const DialogBeforeDayDeletion = ({ isOpen, onOpenChange, onConfirm }: DialogBeforeDayDeletionProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={true}
    >
      Czy na pewno chcesz usunąć dzień?
      <div className="ml-auto mt-4 flex gap-4">
        <Button slot="close">Anuluj</Button>
        <Button onPress={onConfirm}>Tak, usuń</Button>
      </div>
    </Dialog>
  );
};
