"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createMutation.mutate(
      { name: workspaceName },
      {
        onSuccess: (res) => {
          const { workspaceId, message } = res.data;
          toast.success(message);
          setOpen(false); 
          router.push(`/w/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to create workspace");
        },
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()} // ❌ block outside click
        onEscapeKeyDown={(e) => e.preventDefault()}   // ❌ block ESC
      >
        <DialogHeader>
          <DialogTitle>Create your first workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            disabled={createMutation.isPending}
            required
            minLength={3}
            autoFocus
            placeholder="Workspace name (e.g. Work, Personal)"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
