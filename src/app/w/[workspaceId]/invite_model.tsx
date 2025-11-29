import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNewJoinCodeMutation } from "@/features/workspace/hooks/use_new_joinCode"
import { useConfirm } from "@/hooks/use_confirm"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { CopyIcon, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface InviteModelProps {
    open: boolean;
    setOpen: (state: boolean) => void;
    name: string;
    joinCode: string;
}

export const InviteModel = ({ open, setOpen, name, joinCode }: InviteModelProps) => {
    const workspaceId = useWorkspaceId();
    const { mutate: generateNewCode, isPending } = useNewJoinCodeMutation();
    const [ConfirmDialog , confirm] = useConfirm("Are you sure ?" , "This will deactivate the current invite code and generate a new one. ");

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() =>
            toast.success("Invite Link copied to clipboard")
        );
    };

    const handleNewCode = async() => {
        const ok = await confirm();
        if(!ok)return;
        generateNewCode(workspaceId, {
            onSuccess: () => toast.success("Invite code regenerated"),
            onError: () => toast.error("Failed to generate code"),
        });
    };

    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite people to your workspace</DialogTitle>
                    <DialogDescription>
                        Use the code below to invite people to your workspace
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                    <p className="text-4xl font-bold tracking-wide uppercase">
                        {joinCode}
                    </p>

                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        Copy link
                        <CopyIcon className="size-4 ml-2" />
                    </Button>


                </div>
                <div className="flex items-center justify-between w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNewCode}
                        disabled={isPending}
                    >
                        Generate new code
                        <RefreshCw className="size-4 ml-2" />
                    </Button>
                    <DialogClose asChild>
                        <Button>    
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};
