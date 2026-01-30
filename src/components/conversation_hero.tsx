import { generateDarkPalette } from "@/lib/bg_color_generator";
import { Avatar } from "@radix-ui/react-avatar";
import { useMemo } from "react";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserIcon } from "lucide-react";

interface ConversationHeroProps {
  name: string;
  image: string;
}

export const ConversationHero = ({ name, image }: ConversationHeroProps) => {
  const colorHex = useMemo(() => generateDarkPalette(1), []);

//   const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <div className="mx-5 mt-[88px] ">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="size-14 rounded-full">
          <AvatarImage className="rounded-md" src={image} />

          <AvatarFallback
            className="flex items-center justify-center rounded-full"
            style={{ backgroundColor: colorHex }}
          >
            <UserIcon className="size-8 text-white" />
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold"># {name}</p>
      </div>
      <p className="mb-4 font-normal text-slate-800">
        This conversation with <strong>{name}</strong> is private and secure.
      </p>
    </div>
  );
};
