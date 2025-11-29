import { useCreateMessage } from "@/features/messages/hook/use_create_message";
import { useChannelId } from "@/hooks/use_channel_id";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: createMessage, isPending } = useCreateMessage(
    channelId,
  );

  const handleSubmit = ({ body, image }: { body: string; image: File | null }) => {
    if (!body) return;

    const form = new FormData();
    form.append("body", body);
    form.append("channelId", channelId);
    form.append("workspaceId", workspaceId);
    if (image) form.append("image", image);

    createMessage(form, {
      onSuccess: () => {
        setEditorKey((prev) => prev + 1); // reset editor
      },
    });
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
