"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useUpdateChannel } from "@/features/channel/hooks/use_update_channel"
import { useDeleteChannel } from "@/features/channel/hooks/use_remove_channel"
import { useChannelId } from "@/hooks/use_channel_id"
import { TrashIcon } from "lucide-react"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/hooks/use_confirm"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { useCurrentMember } from "@/features/member/hooks/use_current_member"

interface HeaderProps {
    channelName: string
}

export const Header = ({ channelName }: HeaderProps) => {
    const [value, setValue] = useState(channelName)
    const [editOpen, setEditOpen] = useState(false)

    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const router = useRouter();

    const { mutate: updateChannel, isPending: updatingChannel } = useUpdateChannel();
    const { mutate: deleteChannel, isPending: deletingChannel } = useDeleteChannel();
    const { data: member } = useCurrentMember(workspaceId);

    const [ConfirmDialog, confirm] = useConfirm("Delete this channel ?", "You are about to delete this channel. This action is irreversible");

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== "admin") return;
        setEditOpen(value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateChannel(
            { channelId, name: value },
            {
                onSuccess: () => {
                    toast.success('Channel updated');
                    setEditOpen(false);
                },
                onError: () => toast.error('Failed to update channel')
            }
        );
    };

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteChannel({ channelId }, {
            onSuccess: () => {
                toast.success("Channel deleted");
                router.replace(`/w/${workspaceId}`);
            },
            onError: () => toast.error("Failed to delete channel")
        });
    };

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} className="text-lg font-semibold px-2 overflow-hidden w-auto" size={"sm"}>
                        <span className="truncate"># {channelName}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                             # {channelName}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        {/* Edit */}
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        {member?.role === "admin" && (
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm">
                                        # {channelName}
                                    </p>
                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <Input
                                        value={value}
                                        disabled={updatingChannel}
                                        autoFocus
                                        onChange={handleChange}
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="e.g. plan-budget"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant={"outline"} disabled={updatingChannel}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={updatingChannel}>
                                            {updatingChannel ? "Saving..." : "Save"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        {member?.role === "admin" && (
                            <button
                                disabled={deletingChannel}
                                onClick={handleDelete}
                                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                            >
                                <TrashIcon className="size-4" />
                                <p className="text-sm font-semibold">
                                    Delete channel
                                </p>
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
