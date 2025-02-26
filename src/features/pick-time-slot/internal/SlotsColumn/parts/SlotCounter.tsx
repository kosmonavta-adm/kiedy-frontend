import { ThumbsUp } from 'lucide-react';
import { ReactNode } from 'react';

export function SlotCounter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <p>{children}</p>
      <ThumbsUp className="w-4.5 stroke-blue-950" />
    </div>
  );
}
