"use client";

import { useState } from "react";

import { EmojiPickerWrapper } from "./emoji_picker_wraper";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Theme } from "emoji-picker-react";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
  height?: number;
  width?: number;
}

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
  height,
  width,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);
    setTimeout(() => setTooltipOpen(false), 150);
  };

  return (
    <TooltipProvider>
      <Popover modal={false} open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>

          <TooltipContent className="rounded-md bg-black px-2 py-1 text-xs text-white">
            {hint}
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="border-none p-0 shadow-none" sideOffset={4} align="start">
          <EmojiPickerWrapper
            onEmojiSelect={handleSelect}
            theme={Theme.DARK}
            previewPosition="none"
            height={height ?? 250}
            width={width ?? 300}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
