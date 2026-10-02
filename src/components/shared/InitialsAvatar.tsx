import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-[#ff8a65] to-[#ec3a8d]",
  "from-[#ffc535] to-[#ff6868]",
  "from-[#6c7bff] to-[#9b5cff]",
  "from-[#44e7a7] to-[#2bb3c0]",
  "from-[#ec3a8d] to-[#9b5cff]",
  "from-[#526cff] to-[#2bb3c0]",
];

function pick(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

/** Round avatar with initials. The colour stays the same for the same name. */
export function InitialsAvatar({
  name,
  initials,
  size = "default",
  className,
}: {
  name: string;
  initials: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback
        className={cn(
          "bg-linear-to-br font-semibold text-[#1b1215]",
          size === "sm" ? "text-[10px]" : "text-xs",
          pick(name)
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
