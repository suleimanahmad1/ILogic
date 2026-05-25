import { Link } from "react-router-dom";
import logoImg from "@/assets/inference-logic-logo.png";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
  href?: string | null;
};

const BrandLogo = ({ className, imageClassName, showName = false, href = "/" }: Props) => {
  const img = (
    <img
      src={logoImg}
      alt="Inference Logic"
      className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-primary/20", imageClassName)}
    />
  );

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {img}
      {showName ? (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Inference</span>
          <span className="text-sm font-semibold text-foreground">Logic</span>
        </span>
      ) : null}
    </span>
  );

  if (href != null && href !== "") {
    return (
      <Link to={href} className="hover:opacity-90 transition-opacity shrink-0">
        {content}
      </Link>
    );
  }

  return <span className="shrink-0">{content}</span>;
};

export default BrandLogo;
