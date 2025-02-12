import type { ComponentPropsWithRef, ReactNode } from 'react';
import {
  Button,
  Dialog as DefaultDialog,
  Modal as DefaultModal,
  DialogTrigger,
  Heading,
  Input,
  Label,
  ModalOverlay,
  TextField,
} from 'react-aria-components';

import { cxTw } from '@/commons/utils';

export interface DialogProps extends ComponentPropsWithRef<typeof ModalOverlay> {
  children: ReactNode;
}

export const Dialog = ({ children, ref, className, ...props }: DialogProps) => {
  return (
    <ModalOverlay
      className={({ isEntering, isExiting }) =>
        cxTw(
          'fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur',
          isEntering && 'animate-fade-in',
          isExiting && 'animate-fade-out'
        )
      }
      {...props}
    >
      <DefaultModal
        className={({ isEntering, isExiting }) =>
          cxTw('rounded-md bg-white p-4', isEntering && 'animate-fade-in', isExiting && 'animate-fade-out', className)
        }
      >
        <DefaultDialog className="flex flex-col outline-none">{children}</DefaultDialog>
      </DefaultModal>
    </ModalOverlay>
  );
};
