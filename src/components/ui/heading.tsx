interface HeadingProps {
  align?: "left" | "center";
  className?: string;
  description?: string;
  subDescription?: string;
  title: string;
}

export function Heading({
  title,
  description,
  align = "center",
  subDescription,
  className = "",
}: HeadingProps) {
  return (
    <div
      className={`space-y-1 ${
        align === "center" ? "text-center" : "text-center md:text-left"
      } ${className}`}
    >
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {description && <p className="ext-current/50">{description}</p>}
      {subDescription && <p className="ext-current/50">{subDescription}</p>}
    </div>
  );
}
