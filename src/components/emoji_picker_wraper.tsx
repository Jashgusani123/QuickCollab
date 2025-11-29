"use client";

import EmojiPicker, {
  EmojiClickData,
  Theme,
  Categories,
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react";

interface EmojiPickerWrapperProps {
  onEmojiSelect: (emoji: EmojiClickData) => void;
  theme?: Theme;
  previewPosition?: "none" | "bottom";
  height?: number;   
  width?: number;    
}

export const EmojiPickerWrapper = ({
  onEmojiSelect,
  theme = Theme.LIGHT,
  previewPosition = "none",
  height = 300,   
  width = 280,    
}: EmojiPickerWrapperProps) => {
  return (
     <EmojiPicker
      onEmojiClick={onEmojiSelect}
      className="z-10 bg-transparent"
      theme={theme}
      suggestedEmojisMode={SuggestionMode.FREQUENT}
      defaultSkinTone={SkinTones.LIGHT}
      previewConfig={{ showPreview: false }}
      searchDisabled={true}
      skinTonesDisabled={false}
      skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
      lazyLoadEmojis={false}
      height={height}
      width={width}
      emojiStyle={EmojiStyle.FACEBOOK}
      categories={[
        { category: Categories.SUGGESTED, name: "Suggested" },
        { category: Categories.SMILEYS_PEOPLE, name: "Smiley" },
        { category: Categories.ACTIVITIES, name: "Activites" },
        { category: Categories.ANIMALS_NATURE, name: "Animals" },
        { category: Categories.SYMBOLS, name: "Symbols" },
        { category: Categories.FOOD_DRINK, name: "Foods & Drinks" },
        { category: Categories.CUSTOM, name: "Custom" },
        { category: Categories.FLAGS, name: "Flags" },
      ]}
    />
  );
};
