import { cn } from '@/lib/utils';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn('px-1 py-0.5 text-xs bg-muted rounded border', className)}
      {...props}
    >
      {children}
    </kbd>
  );
}

export { Kbd };
