import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    to?: never;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    to: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
  outline:
    "border-2 border-slate-300 bg-transparent text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus:ring-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
  icon: "bg-transparent border-2 border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 focus:ring-slate-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-3 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
  icon: "w-12 h-12 p-0 rounded-lg inline-flex items-center justify-center",
};

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 inline-flex items-center justify-center gap-2";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  const combinedClassName = [base, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");

  if ("to" in props && props.to) {
    const { to, ...rest } = props;
    return (
      <Link to={to} className={combinedClassName} {...(rest as object)}>
        {children}
      </Link>
    );
  }

  const { disabled, ...rest } = props as ButtonAsButton;
  return (
    <button
      type="button"
      className={combinedClassName}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
