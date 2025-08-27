export function Divider({
  orientation = "horizontal",
  className = "",
}: {
  className?: string;
  orientation?: "vertical" | "horizontal";
}) {
  if (orientation === "vertical") {
    return (
      <div
        className={`h-full w-px bg-gray-200 dark:bg-gray-700 ${className}`}
      />
    );
  }
  return (
    <hr
      className={`my-4 h-px border-t border-gray-200 dark:border-gray-700 ${className}`}
    />
  );
}
