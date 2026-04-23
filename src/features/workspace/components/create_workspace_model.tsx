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
import { createWorkspaceMutation, getAllworkspacesQuery } from "../hooks/use_workspaces";

export const CreateWorkspaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceModel();
  const [workspaceName, setWorkspaceName] = useState("");
  const createMutation = createWorkspaceMutation();
  const router = useRouter();

  // ✅ Get all workspaces
  const { data: workspaces } = getAllworkspacesQuery();

  // ✅ Check if user already has workspace
  const hasWorkspace = (workspaces?.length ?? 0) > 0;

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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        // ✅ Allow closing ONLY if user already has workspace
        if (hasWorkspace) {
          setOpen(val);
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (!hasWorkspace) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!hasWorkspace) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {hasWorkspace ? "Create Workspace" : "Create your first workspace"}
          </DialogTitle>
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