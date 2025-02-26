import { motion } from 'motion/react';
import { ReactNode } from 'react';

type BoxProps = {
  children: ReactNode;
};

export function Box({ children }: BoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 'all' }}
      className="flex min-w-max snap-center flex-col gap-8 rounded-3xl bg-blue-400 p-8 text-white shadow-xl shadow-blue-200"
    >
      {children}
    </motion.div>
  );
}
