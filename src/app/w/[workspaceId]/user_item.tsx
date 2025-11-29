import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ID } from "@/constants";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { generateDarkPalette } from "@/lib/bg_color_generator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { User as UserIcon } from "lucide-react";    
import Link from "next/link";
import { useMemo } from "react";

const userItemVariants = cva(
  "flex items-center gap-2.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
        rightMargin: "mr-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UserItemProps {
  id: ID["memberId"];
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({ id, label, image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const colorHex = useMemo(() => generateDarkPalette(1), []);

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/w/${workspaceId}/m/${id}`}>
        <Avatar className="size-6 rounded-md ">
          <AvatarImage className="rounded-md" src={image} />
          
          <AvatarFallback
            className="rounded-md flex items-center justify-center"
            style={{ backgroundColor: colorHex }}
          >
            <UserIcon className="size-4 text-white" />  
          </AvatarFallback>
        </Avatar>
        
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
