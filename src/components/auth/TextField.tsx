import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: ReactNode;
  /** Optional element rendered inside the right side of the field. */
  trailing?: ReactNode;
  error?: string;
}

/**
 * Accessible labelled input with leading icon, inline error message and
 * optional trailing element (e.g. show/hide password toggle).
 */
export default function TextField({
  id,
  label,
  icon,
  trailing,
  error,
  ...rest
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </span>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-surface py-3 pl-11 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-150 ease-out focus:outline-none focus:ring-[3px] ${
            trailing ? "pr-11" : "pr-4"
          } ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/15"
              : "border-border focus:border-primary focus:ring-primary/15"
          }`}
          {...rest}
        />
        {trailing && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
