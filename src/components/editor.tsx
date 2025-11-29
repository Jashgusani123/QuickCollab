import { cn } from "@/lib/utils";
import {
  CaseSensitive,
  ImageIcon,
  SendHorizontal,
  Smile,
  XIcon,
} from "lucide-react";
import Quill, { Delta, Op } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EmojiPopover } from "./emoji_popover";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  // -------------------------
  // INIT QUILL EDITOR
  // -------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const quill = new Quill(editorContainer, {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const empty = !addedImage && quill.getText().trim().length === 0;
                if (empty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ image: addedImage, body });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    });

    quillRef.current = quill;
    quill.focus();

    if (innerRef) innerRef.current = quill;

    // Set default value
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    // Track cursor
    quill.on("selection-change", (range) => {
      if (range && range.index != null) setCursorIndex(range.index);
    });

    // Track text
    quill.on(Quill.events.TEXT_CHANGE, () => setText(quill.getText()));

    // GET TOOLBAR ELEMENT
    const toolbar = container.querySelector(".ql-toolbar") as HTMLDivElement;
    toolbarRef.current = toolbar;

    if (toolbar && !isToolbarVisible) toolbar.style.display = "none";

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      container.innerHTML = "";
      quillRef.current = null;
      if (innerRef?.current) innerRef.current = null;
    };
  }, [innerRef]);

  // -------------------------
  // TOGGLE TOOLBAR
  // -------------------------
  const toggleToolbar = () => {
    setIsToolbarVisible((prev) => {
      const next = !prev;
      if (toolbarRef.current) {
        toolbarRef.current.style.display = next ? "block" : "none";
      }
      return next;
    });
  };

  // -------------------------
  // EMOJI INSERTION
  // -------------------------
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    if (!quill) return;

    const safeIndex =
      cursorIndex > quill.getLength() - 1
        ? quill.getLength() - 1
        : cursorIndex;

    quill.insertText(safeIndex, emoji.emoji);
    quill.setSelection(safeIndex + emoji.emoji.length);
    quill.focus();
  };

  const isEmpty = !image && text.trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />

      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />

        {/* IMAGE PREVIEW */}
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove Image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 border-2 border-white"
                >
                  <XIcon className="size-3.5 cursor-pointer" />
                </button>
              </Hint>

              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl border object-cover"
              />
            </div>
          </div>
        )}

        {/* TOOLBAR BUTTONS */}
        <div className="flex p-2 pb-2">
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <CaseSensitive className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {/* IMAGE BUTTON */}
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {/* ACTIONS */}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Button
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-foreground"
                  : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              )}
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() =>
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }
            >
              <SendHorizontal className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* SHIFT + RETURN Info */}
      {variant === "create" && !isEmpty && (
        <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
