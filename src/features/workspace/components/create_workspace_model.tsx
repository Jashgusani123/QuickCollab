"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use_create_workspace_model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createWorkspaceMutation } from "../hooks/use_workspaces";

export const CreateWorkspaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceModel();
  const [workspaceName, setWorkspaceName] = useState("");
  const createMutation = createWorkspaceMutation(); 
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setWorkspaceName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createMutation.mutate(
      { name: workspaceName },
      {
        onSuccess: (res) => {
          const { workspaceId, message } = res.data;
          router.push(`/w/${workspaceId}`);
          toast.success(message);
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create workspace");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            disabled={createMutation.isPending}  
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />

          <div className="flex justify-end">
            <Button disabled={createMutation.isPending} type="submit">
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
