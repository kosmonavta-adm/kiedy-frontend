import { AnimatePresence, motion } from 'motion/react';
import { ReactNode } from 'react';

type ToggleVisibilityProps = {
  condition: boolean;
  children: ReactNode;
};

export function ToggleVisibility({ condition, children }: ToggleVisibilityProps) {
  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
