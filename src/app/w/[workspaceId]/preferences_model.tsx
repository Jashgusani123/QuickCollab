"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAllworkspacesQuery, removeWorkspaceMutation, updateWorkspaceMutation } from "@/features/workspace/hooks/use_workspaces";
import { useConfirm } from "@/hooks/use_confirm";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PreferencesModelProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModel = ({ open, setOpen, initialValue }: PreferencesModelProps) => {
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { mutate: updateWorkspace, isPending: updatingWorkspace } = updateWorkspaceMutation();
    const { mutate: deleteWorkspace, isPending: removingWorkspace } = removeWorkspaceMutation();
    const { data: workspaces } = getAllworkspacesQuery();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure ?", "This action is irreversible.")

    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) {
            return;
        }

        deleteWorkspace(workspaceId, {
            onSuccess: () => {
                toast.success("Workspace deleted");

                const remaining = workspaces?.filter(w => w._id !== workspaceId);

                if (remaining && remaining.length > 0) {
                    router.replace(`/w/${remaining[0]._id}`);
                } else {
                    router.replace("/")
                }
            },
            onError: () => toast.error("Failed to delete workspace"),
        });
    };

    const onUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace(
            { workspaceId, name: value },
            {
                onSuccess: () => {
                    toast.success("Workspace updated");
                    setEditOpen(false);
                },
                onError: () => toast.error("Failed to update workspace"),
            }
        );
    };

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>{value}</DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        {/* Edit section */}
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-semibold">Workspace Name</p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{value}</p>
                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this workspace</DialogTitle>
                                </DialogHeader>

                                <form className="space-y-4" onSubmit={onUpdateSubmit}>
                                    <Input
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        disabled={updatingWorkspace}
                                        required
                                        minLength={3}
                                        maxLength={80}
                                        autoFocus
                                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" disabled={updatingWorkspace}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={updatingWorkspace}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Delete button */}
                        <button
                            disabled={removingWorkspace}
                            onClick={handleDelete}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                        >
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">Delete Workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
