import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

export function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex h-12 w-full items-center justify-center rounded-2xl bg-af-green text-sm font-bold tracking-wide text-white uppercase hover:bg-af-green-dark disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[15px] font-bold text-af-ink">{children}</p>;
}

const controlClass =
  'h-14 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-af-ink';

export function SelectControl(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} appearance-none bg-[length:1rem] ${props.className ?? ''}`} />;
}
