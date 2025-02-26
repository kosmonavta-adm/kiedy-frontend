import { ReactNode } from '@tanstack/react-router';
import { format } from 'date-fns/format';
import { pl } from 'date-fns/locale';
import { motion } from 'motion/react';

type SlotsColumnProps = {
  date: Date;
  children: ReactNode;
};

export function SlotsColumn({ date, children }: SlotsColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 'some' }}
      className="flex w-[135px] snap-center flex-col items-end gap-2"
      data-testid="column"
    >
      <p className="flex min-w-24 flex-col text-center font-semibold">{format(date, 'dd.MM (EE)', { locale: pl })}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </motion.div>
  );
}
