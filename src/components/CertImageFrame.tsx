import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "max-w-[140px]",
  md: "max-w-[220px]",
  lg: "max-w-[320px]",
};

/** Square frame for certificate artwork (matches typical 1:1 cert graphics). */
const CertImageFrame = ({ src, alt, className, frameClassName, size = "md" }: Props) => (
  <div
    className={cn(
      "relative aspect-square w-full overflow-hidden rounded-xl border border-border/30 bg-muted/15",
      sizeClasses[size],
      frameClassName
    )}
  >
    <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full object-contain p-2", className)} />
  </div>
);

export default CertImageFrame;
