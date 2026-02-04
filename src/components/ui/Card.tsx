import { type HTMLAttributes, type ElementType } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const Card = ({
  as: Component = "div",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) => {
  const paddingClass = paddingClasses[padding];
  const withShadow =
    padding !== "none"
      ? "shadow-soft ring-1 ring-slate-100"
      : "";
  const base =
    "rounded-2xl bg-white overflow-hidden transition-shadow " + withShadow;
  const combined = [base.trim(), paddingClass, className].filter(Boolean).join(" ");

  return (
    <Component className={combined} {...props}>
      {children}
    </Component>
  );
};

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`space-y-1 ${className}`.trim()}>{children}</div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

const CardContent = ({ children, className = "" }: CardContentProps) => {
  return <div className={className || undefined}>{children}</div>;
};

export default Card;
export { CardHeader, CardContent };
