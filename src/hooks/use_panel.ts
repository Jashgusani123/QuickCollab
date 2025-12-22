import { useParentMessageId } from "@/features/messages/store/use_parent_message_id"
import { on } from "events";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
    }

    const onCloseMessage = ()=>{
        setParentMessageId(null);
    }

    return {
        parentMessageId,
        onOpenMessage,
        onCloseMessage
    }
}